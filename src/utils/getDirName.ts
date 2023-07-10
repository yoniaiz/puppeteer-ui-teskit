import { fileURLToPath } from 'url';
import path from 'path';

export const getDirName = (filePath: string) => {
  const __filename = fileURLToPath(filePath);
  return path.dirname(__filename);
};
