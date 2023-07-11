import { logger } from '../../utils/logger.js';
import { logs } from './constants.js';
import { getAllTestkitFiles } from './getAllTestkitFiles.js';
import { resolveAllTeskitFiles } from './resolveAllTeskitFiles.js';

export function getAllTestkits() {
  logger.start(logs.startGettingTestkits);
  return resolveAllTeskitFiles(getAllTestkitFiles());
}
