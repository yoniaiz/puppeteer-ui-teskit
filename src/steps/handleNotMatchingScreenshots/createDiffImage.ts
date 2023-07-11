import sharp from 'sharp';
import { getBottomBarBuffer } from './getBottomBarBuffer.js';

export const IMAGE_WIDTH = 1080;
export const IMAGE_HEIGHT = 1024;
export const MARGIN = 50;
export const BOTTOM_BAR_HEIGHT = 100;

export async function createDiffImage({
  diffImageBuffer,
  newSnapImageBuffer,
  oldSnapImageBuffer,
}: {
  diffImageBuffer: Buffer;
  newSnapImageBuffer: Buffer;
  oldSnapImageBuffer: Buffer;
}) {
  const bottomBarBuffer = await getBottomBarBuffer();
  const images: sharp.OverlayOptions[] = [
    {
      input: newSnapImageBuffer,
      gravity: 'northeast',
    },
    {
      input: diffImageBuffer,
      gravity: 'north',
    },
    {
      input: oldSnapImageBuffer,
      gravity: 'northwest',
    },
  ];

  const diffsImage = await sharp({
    create: {
      width: IMAGE_WIDTH * images.length + MARGIN * (images.length - 1),
      height: IMAGE_HEIGHT + BOTTOM_BAR_HEIGHT,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite([
      ...images,
      {
        input: bottomBarBuffer,
        gravity: 'south',
      },
    ])
    .png()
    .toBuffer();

  return diffsImage;
}
