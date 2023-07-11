import pngjs from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import { buildSnapFilePath } from '../../utils/testkit.utils.js';
import type { Screenshot } from '../../types';

export async function compareImages({
  name,
  saveTo,
  snapshotBuffer,
  threshold = 0.01,
  description,
}: Screenshot) {
  const snapFilePath = buildSnapFilePath(saveTo, name, description);
  const oldSnapFileBuffer = await fs.promises.readFile(snapFilePath);
  const receivedImage = pngjs.PNG.sync.read(snapshotBuffer);
  const baselineImage = pngjs.PNG.sync.read(oldSnapFileBuffer);

  const imageWidth = receivedImage.width;
  const imageHeight = receivedImage.height;

  const diffImage = new pngjs.PNG({ width: imageWidth, height: imageHeight });
  const diffPixelCount = pixelmatch(
    receivedImage.data,
    baselineImage.data,
    diffImage.data,
    imageWidth,
    imageHeight,
    {
      threshold,
    },
  );

  const totalPixels = imageWidth * imageHeight;

  const diffRatio = diffPixelCount / totalPixels;
  const pass = diffRatio <= threshold;

  return {
    diffImageBuffer: pass ? null : pngjs.PNG.sync.write(diffImage),
    oldSnapFileBuffer,
    isMatching: pass,
    diffRatio,
  };
}
