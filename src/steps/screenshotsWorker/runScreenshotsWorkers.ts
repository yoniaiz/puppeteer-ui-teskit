import Piscina from 'piscina';
import { program } from '../../utils/createProgram.js';
import { savedScreenshotsToFailed } from './savedScreenshotsToFailed.js';
import { logger } from '../../utils/logger.js';
import type {
  FailedSnapshot,
  Screenshot,
  ScreenshotSaveResult,
} from '../../types';

const piscina = new Piscina({
  // The URL must be a file:// URL
  filename: new URL('./screenshotWorker.js', import.meta.url).href,
});

export async function runScreenshotsWorkers(
  screenshots: Screenshot[],
): Promise<{
  notMatchedScreenshots: FailedSnapshot[];
  failedScreenshotsCount: number;
}> {
  logger.start('Comparing screenshots');

  const promises = screenshots.map((screenshot) => {
    return piscina.run({
      screenshot,
      shouldUpdate: program.options.update,
      isCI: program.isCI,
      threshold: program.options.threshold,
    });
  });

  const results: ScreenshotSaveResult[] = await Promise.all(promises);

  logger.success('Finished comparing screenshots');

  results.forEach((result) => {
    if (result.message) {
      logger.warn(result.message);
    }
  });

  const failedScreenshots = results.filter(
    (result) => result.status === 'failed',
  );

  return {
    notMatchedScreenshots: savedScreenshotsToFailed(results),
    failedScreenshotsCount: failedScreenshots.length,
  };
}
