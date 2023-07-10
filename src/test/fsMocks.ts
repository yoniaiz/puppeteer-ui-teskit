import fs from 'fs';

export const fsMocks = {
  promises: {
    writeFile: () => jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(),
    readFile: (file: Buffer | string) =>
      jest.spyOn(fs.promises, 'readFile').mockResolvedValue(file),
    unlink: () => jest.spyOn(fs.promises, 'unlink').mockResolvedValue(),
  },
  existsSync: (exists: boolean) =>
    jest.spyOn(fs, 'existsSync').mockReturnValue(exists),
};
