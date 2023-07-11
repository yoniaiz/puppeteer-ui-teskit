import type { FailedSnapshot } from '../../types';
import { logger } from '../../utils/logger.js';
import { logs } from './constants.js';

export function handleSkipAction({ snapName }: FailedSnapshot) {
  logger.info(logs.skipSnapshot(snapName));
}
