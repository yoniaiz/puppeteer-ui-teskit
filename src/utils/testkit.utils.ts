import fs from 'fs';
import path from 'path';
import {
  TESTKIT_FILE_NAME,
  TESTKIT_FOLDER_NAME,
} from '../constants/testkit.constants.js';

function createSnapshotsFolderIfNotExists(folderPath: string) {
  const snapshotsFolderPath = path.resolve(folderPath, TESTKIT_FOLDER_NAME);
  if (!fs.existsSync(snapshotsFolderPath)) {
    fs.mkdirSync(snapshotsFolderPath);
  }
}

export function buildSnapFilePath(
  filePath: string,
  snapName: string,
  description = '',
) {
  const snapFileName = `${snapName}${
    description ? '-' + description.replaceAll(' ', '-') : ''
  }.${TESTKIT_FILE_NAME}.png`;
  const filePathFolder = path.dirname(filePath);

  try {
    createSnapshotsFolderIfNotExists(filePathFolder);
  } catch (e) {
    /* empty */
  }

  return path.resolve(filePathFolder, TESTKIT_FOLDER_NAME, snapFileName);
}

export function buildDiffImagePath(filePath: string, snapName: string) {
  const diffImageFileName = `${snapName}.diff.png`;
  const filePathFolder = path.dirname(filePath);
  return path.resolve(filePathFolder, diffImageFileName);
}

interface SaveImageParams {
  buffer: Buffer;
  filePath: string;
  snapName: string;
  description?: string;
}

const saveImage = (
  pathFunction: (
    filePath: string,
    snapName: string,
    description?: string,
  ) => string,
) => {
  return ({ buffer, filePath, snapName, description }: SaveImageParams) => {
    return fs.promises.writeFile(
      pathFunction(filePath, snapName, description),
      buffer,
      'binary',
    );
  };
};

const unlinkImage = (
  pathFunction: (snapName: string, filePath: string) => string,
) => {
  return async (filePath: string, snapName: string) => {
    const path = pathFunction(filePath, snapName);
    if (await fs.existsSync(path)) {
      await fs.promises.unlink(path);
    }
  };
};

export const saveSnapImage = saveImage(buildSnapFilePath);
export const saveDiffImage = saveImage(buildDiffImagePath);

export const unlinkSnapImage = unlinkImage(buildSnapFilePath);
export const unlinkDiffImage = unlinkImage(buildDiffImagePath);
