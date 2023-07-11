import fs from 'fs';
import path from 'path';
import { getDirName } from '../../utils/getDirName.js';

let bottomBarBuffer: Buffer;

export const getBottomBarBuffer = async () => {
  if (!bottomBarBuffer) {
    bottomBarBuffer = await fs.promises.readFile(
      path.resolve(getDirName(import.meta.url), '../../assets/bottom-bar.png'),
    );
  }
  return bottomBarBuffer;
};
