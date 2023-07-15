import fs from 'fs';
import { buildSnapFilePath } from '../../utils/testkit.utils.js';
import { compareImages } from './compareImages.js';
import type { Screenshot, ScreenshotSaveResult } from '../../types';
import { logs } from './constants.js';

const isSnapshotFileExists = (screenshot: Screenshot) => {
  const snapFilePath = buildSnapFilePath(
    screenshot.saveTo,
    screenshot.name,
    screenshot.description,
  );
  return fs.existsSync(snapFilePath);
};

const handleSaveScreenshot = async ({
  isCI = false,
  screenshot,
}: {
  screenshot: Screenshot;
  isCI?: boolean;
}): Promise<ScreenshotSaveResult> => {
  const path = buildSnapFilePath(
    screenshot.saveTo,
    screenshot.name,
    screenshot.description,
  );

  if (isCI) {
    return {
      status: 'failed',
      message: logs.cantSaveScreenshotInCI(path),
    };
  }
  await fs.promises.writeFile(path, screenshot.snapshotBuffer, 'binary');

  return {
    status: 'passed',
  };
};

const screenshotWorker = async ({
  shouldUpdate,
  isCI = false,
  screenshot,
  threshold = 0.005,
}: {
  shouldUpdate: boolean;
  screenshot: Screenshot;
  isCI?: boolean;
  threshold?: number;
}): Promise<ScreenshotSaveResult> => {
  const newBuffer = Buffer.from(screenshot.snapshotBuffer);
  if (!isSnapshotFileExists(screenshot) || shouldUpdate) {
    return handleSaveScreenshot({
      screenshot: {
        ...screenshot,
        snapshotBuffer: newBuffer,
      },
      isCI,
    });
  }

  const { isMatching, diffImageBuffer, oldSnapFileBuffer } =
    await compareImages({
      ...screenshot,
      snapshotBuffer: newBuffer,
      threshold: screenshot.threshold || threshold,
    });

  if (isMatching) {
    return {
      status: 'passed',
    };
  }

  return {
    status: 'notMatched',
    data: {
      diffImageBuffer,
      oldSnapImageBuffer: oldSnapFileBuffer,
      newSnapImageBuffer: newBuffer,
      filePath: screenshot.saveTo,
      snapName: screenshot.name,
      description: screenshot.description,
    },
  };
};

export default screenshotWorker;
