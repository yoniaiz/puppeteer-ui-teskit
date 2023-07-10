import path from 'path';

export const groupFilesByType = (filesPaths: string[]) => {
  const tsFiles: string[] = [];
  const jsFiles: string[] = [];
  const otherFiles: string[] = [];

  const filesMap = {
    '.ts': (filePath: string) => tsFiles.push(filePath),
    '.js': (filePath: string) => jsFiles.push(filePath),
  };

  const other = (filePath: string) => otherFiles.push(filePath);

  filesPaths.forEach((filePath) => {
    const fileExtension = path.extname(filePath);
    const handler = filesMap[fileExtension] || other;
    handler(filePath);
  });

  return {
    tsFiles,
    jsFiles,
    otherFiles,
  };
};
