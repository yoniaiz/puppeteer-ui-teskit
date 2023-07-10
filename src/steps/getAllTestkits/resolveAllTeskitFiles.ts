import path from 'path';
import { ResolvedTestkitFile } from '../../types/index.js';
import fs from 'fs';
import { logger } from '../../utils/logger.js';
import { logs } from './constants.js';
import { compileTsSnapFiles } from './compileTs.js';
import { groupFilesByType } from './groupFilesByType.js';
import { resolveTestkitFile } from './resolveTestkitFile.js';
import { getTempFolder } from './getTempFolder.js';

async function resolveJsSnapFile(filePath: string) {
  const testkit = await import(filePath);
  return resolveTestkitFile(testkit.default, filePath);
}

async function resolveTsSnapFile(filePath: string) {
  const fileName = path.basename(filePath).replace('.ts', '.js');
  const jsFilePath = `${getTempFolder()}/${fileName}`;

  const result = await resolveJsSnapFile(jsFilePath);

  fs.promises.unlink(jsFilePath);

  result.path = filePath;

  return result;
}

export async function resolveAllTeskitFiles(
  filesPaths: string[],
): Promise<ResolvedTestkitFile[]> {
  if (!filesPaths.length) {
    return [];
  }

  const resolvedTestkits: ResolvedTestkitFile[] = [];

  const { tsFiles, jsFiles, otherFiles } = groupFilesByType(filesPaths);

  if (tsFiles.length) {
    compileTsSnapFiles(tsFiles);

    for (const tsFilePath of tsFiles) {
      const resolvedSnapFile = await resolveTsSnapFile(tsFilePath);
      if (resolvedSnapFile) {
        resolvedTestkits.push(resolvedSnapFile);
      }
    }
  }

  for (const jsFilePath of jsFiles) {
    const resolvedSnapFile = await resolveJsSnapFile(jsFilePath);
    if (resolvedSnapFile) {
      resolvedTestkits.push(resolvedSnapFile);
    }
  }

  for (const other of otherFiles) {
    logger.warn(logs.notSupportedFileType(other));
  }

  return resolvedTestkits;
}
