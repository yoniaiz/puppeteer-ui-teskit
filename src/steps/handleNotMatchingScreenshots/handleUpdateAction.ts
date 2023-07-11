import { saveSnapImage } from '../../utils/testkit.utils.js';
import { logger } from '../../utils/logger.js';
import { logs } from './constants.js';
import type { FailedSnapshot } from '../../types';

export async function handleUpdateAction({
  filePath,
  snapName,
  newSnapImageBuffer,
  description,
}: FailedSnapshot) {
  logger.info(logs.updateSnapshot(snapName));
  return saveSnapImage({
    filePath,
    snapName,
    buffer: newSnapImageBuffer,
    description,
  });
}
