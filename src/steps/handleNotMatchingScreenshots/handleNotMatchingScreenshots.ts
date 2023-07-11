import { logger } from '../../utils/logger.js';
import {
  FailedSnapshotAction,
  promptHandleImage,
} from './promptHandleImage.js';
import { saveSnapImage, unlinkDiffImage } from '../../utils/testkit.utils.js';
import { handleUpdateAction } from './handleUpdateAction.js';
import { handleOpenAction } from './handleOpenAction.js';
import { handleSkipAction } from './handleSkipAction.js';
import { program } from '../../utils/createProgram.js';
import type { FailedSnapshot } from '../../types';
import { logs } from './constants.js';

async function openAction(failedSnapshot: FailedSnapshot) {
  await handleOpenAction(failedSnapshot);
  await handleFailedSnapshot(failedSnapshot);
}

const actionsMap: Record<
  FailedSnapshotAction,
  (failedSnapshot: FailedSnapshot) => Promise<void> | void
> = {
  update: handleUpdateAction,
  open: openAction,
  skip: handleSkipAction,
};

const saveFailedSnapshotsInCI = async (
  notMatchedScreenshots: FailedSnapshot[],
) => {
  for (const notMatchedScreenshot of notMatchedScreenshots) {
    await saveSnapImage({
      filePath: notMatchedScreenshot.filePath,
      snapName: notMatchedScreenshot.snapName,
      buffer: notMatchedScreenshot.newSnapImageBuffer,
      description: notMatchedScreenshot.description,
    });
  }
};

const handleFailedSnapshot = async (failedSnapshot: FailedSnapshot) => {
  const { filePath, snapName } = failedSnapshot;

  const action = await promptHandleImage(snapName);
  await unlinkDiffImage(filePath, snapName);

  await actionsMap[action](failedSnapshot);

  return action === 'skip';
};

export async function handleNotMatchingScreenshots(
  notMatchedScreenshots: FailedSnapshot[],
) {
  if (!notMatchedScreenshots.length) {
    return {
      notMatchedScreenshotsCount: 0,
    };
  }

  if (program.isCI) {
    await saveFailedSnapshotsInCI(notMatchedScreenshots);
    return {
      notMatchedScreenshotsCount: notMatchedScreenshots.length,
    };
  }

  logger.warn(
    logs.startHandlingNotMatchingSnapshots(notMatchedScreenshots.length),
  );

  let notMatchedScreenshotsCount = 0;

  for (const notMatchingScreenshot of notMatchedScreenshots) {
    const isSkipped = await handleFailedSnapshot(notMatchingScreenshot);
    if (isSkipped) {
      notMatchedScreenshotsCount++;
    }
  }

  return {
    notMatchedScreenshotsCount,
  };
}
