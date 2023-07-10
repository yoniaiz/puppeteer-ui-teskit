import path from 'path';

export const pathMocks = {
  resolve: () =>
    jest.spyOn(path, 'resolve').mockImplementation((...args) => args.join('/')),
  extname: (ext: string) => jest.spyOn(path, 'extname').mockReturnValue(ext),
};
