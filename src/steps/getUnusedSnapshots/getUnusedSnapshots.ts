import { glob } from 'glob';
import { TESTKIT_FOLDER_NAME } from '../../constants/testkit.constants.js';
import { buildSnapFilePath } from '../../utils/testkit.utils.js';
import fs from 'fs';
import { program } from '../../utils/createProgram.js';
import { logger } from '../../utils/logger.js';
import type { Screenshot } from '../../types';
import { logs } from './constants.js';

export const getUnusedSnapshots = async (screenshot: Screenshot[]) => {
  if (program.options.file) {
    return [];
  }

  logger.start(logs.startGettingUnusedSnapshots);

  const oldSnapshots = glob.sync(`**/${TESTKIT_FOLDER_NAME}/*.png`);
  const newSnapshots = screenshot.map(({ saveTo, name, description }) =>
    buildSnapFilePath(saveTo, name, description),
  );

  const unusedSnapshots = oldSnapshots.filter((oldSnapshot) => {
    return !newSnapshots.some((newSnapshot) =>
      newSnapshot.includes(oldSnapshot),
    );
  });

  if (program.options.update) {
    for (const unusedSnapshot of unusedSnapshots) {
      logger.info(logs.removedUnusedSnapshot(unusedSnapshot));
      await fs.promises.unlink(unusedSnapshot);
    }

    return [];
  }

  return unusedSnapshots;
};
