import {
  buildDiffImagePath,
  saveDiffImage,
} from '../../utils/testkit.utils.js';
import open from 'open';
import { createDiffImage } from './createDiffImage.js';
import { FailedSnapshot } from '../../types/index.js';

export async function handleOpenAction({
  diffImageBuffer,
  filePath,
  snapName,
  newSnapImageBuffer,
  oldSnapImageBuffer,
}: FailedSnapshot) {
  const diffsImage = await createDiffImage({
    diffImageBuffer,
    newSnapImageBuffer,
    oldSnapImageBuffer,
  });

  await saveDiffImage({
    filePath,
    snapName,
    buffer: diffsImage,
  });
  await open(buildDiffImagePath(filePath, snapName));
}
