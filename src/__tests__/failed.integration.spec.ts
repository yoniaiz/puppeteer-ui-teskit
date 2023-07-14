import { glob } from 'glob';
import { run } from '../index';
import { logger } from '../utils/logger';
import {
  OUTPUT_CI_ERROR_MESSAGE,
  logs as handleOutputLogs,
} from '../steps/handleOutput/constants';
import { testUtils } from '../test/utils';
import { AxeViolation, ScreenshotSaveResult } from '../types';
import {
  mockProgramOptions,
  resetProgramOptions,
} from '../test/mockProgramOptions';

jest.mock('open', () => jest.fn());

const violation: AxeViolation = {
  description: 'description',
  help: 'help',
  helpUrl: 'helpUrl',
  id: 'id',
  tags: ['tags'],
  nodes: [
    {
      failureSummary: 'failureSummary',
      html: 'html',
      target: ['target'],
    },
  ],
};

jest.mock('../steps/prepareTests/BrowserLuncher/BrowserLuncher.js', () => {
  const closeBrowser = jest.fn();
  const publicDriver = jest.fn();
  const takeScreenshot = jest.fn(() => {
    return Buffer.from('');
  });
  const navigateToPage = jest.fn();
  const lunchBrowser = jest.fn();
  const runAxe = jest.fn(() => ({
    violations: [violation],
  }));

  const BrowserLuncher = jest.fn().mockImplementation(() => {
    return {
      closeBrowser,
      publicDriver,
      takeScreenshot,
      navigateToPage,
      lunchBrowser,
      runAxe,
    };
  });
  return { BrowserLuncher };
});

jest.mock('piscina', () => {
  class Piscina {
    constructor() {
      // nothing
    }
    run() {
      return Promise.resolve({
        status: 'failed',
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
describe('Failed tests integration', () => {
  beforeEach(() => {
    resetProgramOptions();
    jest.clearAllMocks();
  });

  it('should logs failed tests - local', async () => {
    const { paths } = testUtils.generateMockTestkitConfigFile(2);

    // search files
    jest.spyOn(glob, 'sync').mockReturnValueOnce(paths);

    // unused files
    jest
      .spyOn(glob, 'sync')
      .mockReturnValueOnce(testUtils.generateSnapshotsPaths(2));

    await run();

    expect(logger.error).toHaveBeenCalledWith(
      handleOutputLogs.axeTestsResultsWithErrors(2, 2),
    );
    expect(logger.error).toHaveBeenCalledWith(
      handleOutputLogs.failedScreenshots(2, 2),
    );
  });

  it('should logs failed tests - ci', async () => {
    mockProgramOptions({}, true);

    const { paths } = testUtils.generateMockTestkitConfigFile(2);

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
      expect(e).toEqual(new Error(OUTPUT_CI_ERROR_MESSAGE));
    }

    expect(logger.error).toHaveBeenCalledWith(
      handleOutputLogs.axeTestsResultsWithErrors(2, 2),
    );
    expect(logger.error).toHaveBeenCalledWith(
      handleOutputLogs.failedScreenshots(2, 2),
    );
  });
});
