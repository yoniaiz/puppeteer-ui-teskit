import type { ResolvedTestkitFile, AxeTest, AxeTestResult } from '../../types';
import { logger } from '../../utils/logger.js';
import { BrowserLuncher } from './BrowserLuncher/BrowserLuncher.js';
import { logs } from './constants.js';
import { wrapTestWithLifecycle } from './wrapTestWithLifecycle.js';

export const handleAxeTest = async (
  browser: BrowserLuncher,
  snapshotFile: ResolvedTestkitFile,
  snapTest: AxeTest,
): Promise<{
  failed: boolean;
  axeTestResult: AxeTestResult | null;
}> => {
  logger.log(
    logs.runningAxe(snapshotFile.name, snapTest.description, snapTest.url),
  );

  const { data, failed } = await wrapTestWithLifecycle({
    snapTest,
    browserInstance: browser,
    snapFile: snapshotFile,
    cb: async () => browser.runAxe(snapTest.selector, snapTest.config),
  });

  if (failed) {
    return {
      failed: true,
      axeTestResult: null,
    };
  }

  return {
    failed: false,
    axeTestResult: {
      description: snapTest.description,
      name: snapshotFile.name,
      path: snapshotFile.path,
      url: snapTest.url,
      violations: data.violations,
    },
  };
};
