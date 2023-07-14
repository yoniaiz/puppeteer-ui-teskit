import { glob } from 'glob';
import { run } from '../index';
import { logger } from '../utils/logger';
import { logs } from '../steps/handleOutput/constants';
import { testUtils } from '../test/utils';

jest.mock('open', () => jest.fn());
jest.mock('../steps/prepareTests/BrowserLuncher/BrowserLuncher.js');
jest.mock('piscina', () => {
  class Piscina {
    constructor() {
      // nothing
    }
    run() {
      return Promise.resolve({
        status: 'passed',
      });
    }
  }
  return Piscina;
});
describe('Happy flow', () => {
  it('should pass', async () => {
    const { paths, testkitConfigs } =
      testUtils.generateMockTestkitConfigFile(2);

    // search files
    jest.spyOn(glob, 'sync').mockReturnValueOnce(paths);

    // unused files
    jest
      .spyOn(glob, 'sync')
      .mockReturnValueOnce(testUtils.generateSnapshotsPaths(2));

    await run();

    expect(logger.success).toHaveBeenCalledWith(
      logs.allAxeTestsPassed(testkitConfigs.length),
    );
    expect(logger.success).toHaveBeenCalledWith(
      logs.allScreenshotsPassed(testkitConfigs.length),
    );
    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
