import type { FailedSnapshot, ScreenshotSaveResult } from '../../types';

export function savedScreenshotsToFailed(
  savedScreenshots: ScreenshotSaveResult[],
): FailedSnapshot[] {
  return savedScreenshots
    .filter((result) => result.status === 'notMatched')
    .map((result) => ({
      diffImageBuffer: Buffer.from(result.data.diffImageBuffer),
      oldSnapImageBuffer: Buffer.from(result.data.oldSnapImageBuffer),
      newSnapImageBuffer: Buffer.from(result.data.newSnapImageBuffer),
      description: result.data.description,
      filePath: result.data.filePath,
      snapName: result.data.snapName,
    }));
}
