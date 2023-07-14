import { glob } from 'glob';
import { run } from '../index';
import { logger } from '../utils/logger';
import { logs as handleOutputLogs } from '../steps/handleOutput/constants';
import { testUtils } from '../test/utils';
import { ScreenshotSaveResult } from '../types';
import prompts from 'prompts';
import {
  mockProgramOptions,
  resetProgramOptions,
} from '../test/mockProgramOptions';
import { fsMocks } from '../test/fsMocks';
import { logs as handleNotMatchingScreenshotsLogs } from '../steps/handleNotMatchingScreenshots/constants';

jest.mock('open', () => jest.fn());
jest.mock('../steps/prepareTests/BrowserLuncher/BrowserLuncher.js');
jest.mock('piscina', () => {
  class Piscina {
    constructor() {
      // nothing
    }
    run() {
      return Promise.resolve({
        status: 'notMatched',
        data: {
          diffImageBuffer: Buffer.from(''),
          filePath: 'path/to/file.ui-testkit.js',
          newSnapImageBuffer: Buffer.from(''),
          oldSnapImageBuffer: Buffer.from(''),
          snapName: 'test1',
          description: 'description',
        },
      } as ScreenshotSaveResult);
    }
  }
  return Piscina;
});
describe('Mismatches integration', () => {
  beforeEach(() => {
    resetProgramOptions();
    jest.clearAllMocks();
  });

  it('should logs mismatched - local', async () => {
    const { paths, testkitConfigs } =
      testUtils.generateMockTestkitConfigFile(2);

    // search files
    jest.spyOn(glob, 'sync').mockReturnValueOnce(paths);

    // unused files
    jest
      .spyOn(glob, 'sync')
      .mockReturnValueOnce(testUtils.generateSnapshotsPaths(2));

    jest.spyOn(prompts, 'prompt').mockImplementation(() => {
      return Promise.resolve({ action: 'skip' });
    });

    await run();

    expect(logger.error).toHaveBeenNthCalledWith(
      1,
      handleOutputLogs.notMatchedScreenshots(
        testkitConfigs.length,
        testkitConfigs.length,
      ),
    );
    expect(logger.error).toHaveBeenNthCalledWith(
      2,
      handleOutputLogs.totalFailedTests(
        0,
        testkitConfigs.length,
        0,
        testkitConfigs.reduce((acc, curr) => acc + curr.tests.length, 0),
      ),
    );
  });

  it('should resolve all mismatched - local', async () => {
    const { paths, testkitConfigs } =
      testUtils.generateMockTestkitConfigFile(2);

    const saveFilesMock = fsMocks.promises.writeFile();

    // search files
    jest.spyOn(glob, 'sync').mockReturnValueOnce(paths);

    // unused files
    jest
      .spyOn(glob, 'sync')
      .mockReturnValueOnce(testUtils.generateSnapshotsPaths(2));

    jest.spyOn(prompts, 'prompt').mockImplementation(() => {
      return Promise.resolve({ action: 'update' });
    });

    await run();

    expect(saveFilesMock).toHaveBeenCalledTimes(testkitConfigs.length);

    expect(logger.success).toHaveBeenCalledWith(
      handleOutputLogs.allAxeTestsPassed(testkitConfigs.length),
    );
    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      handleNotMatchingScreenshotsLogs.startHandlingNotMatchingSnapshots(
        testkitConfigs.length,
      ),
    );
  });

  it('should logs mismatched and throw error - CI', async () => {
    const { paths, testkitConfigs } =
      testUtils.generateMockTestkitConfigFile(2);

    const saveFilesMock = fsMocks.promises.writeFile();
    mockProgramOptions({}, true);

    // search files
    jest.spyOn(glob, 'sync').mockReturnValueOnce(paths);

    // unused files
    jest
      .spyOn(glob, 'sync')
      .mockReturnValueOnce(testUtils.generateSnapshotsPaths(2));

    try {
      await run();
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e).toEqual(
        new Error('Failed tests found. See logs above for details.'),
      );
    }

    expect(saveFilesMock).toHaveBeenCalledTimes(testkitConfigs.length);
    expect(logger.error).toHaveBeenNthCalledWith(
      1,
      handleOutputLogs.notMatchedScreenshots(
        testkitConfigs.length,
        testkitConfigs.length,
      ),
    );
    expect(logger.error).toHaveBeenNthCalledWith(
      2,
      handleOutputLogs.totalFailedTests(
        0,
        testkitConfigs.length,
        0,
        testkitConfigs.reduce((acc, curr) => acc + curr.tests.length, 0),
      ),
    );
    resetProgramOptions();
  });
});
