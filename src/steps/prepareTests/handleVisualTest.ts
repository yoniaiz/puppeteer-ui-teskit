import type { ResolvedTestkitFile, VisualTest, Screenshot } from '../../types';
import { logger } from '../../utils/logger.js';
import { BrowserLuncher } from './BrowserLuncher/BrowserLuncher.js';
import { logs } from './constants.js';
import { wrapTestWithLifecycle } from './wrapTestWithLifecycle.js';

async function takeScreenshot(
  browserInstance: BrowserLuncher,
  snapFile: ResolvedTestkitFile,
  snapTest: VisualTest,
) {
  const { data, failed } = await wrapTestWithLifecycle({
    snapTest,
    browserInstance,
    snapFile,
    cb: async () => browserInstance.takeScreenshot(snapTest.config),
  });

  if (failed) {
    return;
  }

  return data;
}

export const handleVisualTest = async (
  browser: BrowserLuncher,
  snapshotFile: ResolvedTestkitFile,
  snapTest: VisualTest,
): Promise<{
  screenshot: Screenshot;
  failed: boolean;
}> => {
  logger.log(
    logs.takingScreenshot(
      snapshotFile.name,
      snapTest.description,
      snapTest.url,
    ),
  );

  const snapshotBuffer = (await takeScreenshot(
    browser,
    snapshotFile,
    snapTest,
  )) as Buffer;

  return {
    screenshot: {
      name: snapshotFile.name,
      snapshotBuffer,
      saveTo: snapshotFile.path,
      description: snapTest.description,
      threshold: snapTest.config?.threshold || 0.005,
    },
    failed: !snapshotBuffer,
  };
};
