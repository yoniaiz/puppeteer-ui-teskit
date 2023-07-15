import { glob } from 'glob';
import { program } from '../../utils/createProgram.js';
import { TESTKIT_FILE_EXTENSIONS } from '../../constants/testkit.constants.js';
import { logger } from '../../utils/logger.js';
import { logs } from './constants.js';

export const getAllTestkitFiles = (): string[] => {
  const folderPath = `${program.options.folder}/**/`;
  const fileName = program.options.file ? `*${program.options.file}*` : '*';
  const fileTypes = `{${TESTKIT_FILE_EXTENSIONS.join(',')}}`;

  const files = glob.sync(`${folderPath}${fileName}${fileTypes}`);

  if (!files.length) {
    logger.warn(logs.noTestkitsFound);
  }

  return files;
};
