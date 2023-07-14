import { createProgram } from 'typescript';
import { resolveAllTeskitFiles } from '../resolveAllTeskitFiles';
import { pathMocks } from '../../../test/pathMocks';
import { logger } from '../../../utils/logger';
import { logs } from '../constants';
import { fsMocks } from '../../../test/fsMocks';
import { getTempFolder } from '../getTempFolder';
import { testUtils } from '../../../test/utils';
import { resolveTestkitFile } from '../resolveTestkitFile';

jest.mock('typescript', () => ({
  createProgram: jest.fn(() => ({
    emit: jest.fn(),
  })),
  ModuleKind: {
    CommonJS: 'commonjs',
    ESNext: 'esnext',
  },
}));

describe('resolveFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array when no files are provided', async () => {
    const result = await resolveAllTeskitFiles([]);
    expect(result).toEqual([]);
  });

  it('should resolve JS snap files', async () => {
    const { paths, testkitConfigs } =
      testUtils.generateMockTestkitConfigFile(2);

    pathMocks.extname('.js');

    const result = await resolveAllTeskitFiles(paths);

    expect(result).toEqual(
      testkitConfigs.map((testkit, i) => resolveTestkitFile(testkit, paths[i])),
    );

    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should log an error for unsupported file types', async () => {
    const filePaths = ['path/to/file1.txt', 'path/to/file2.txt'];

    pathMocks.extname('.txt');

    const result = await resolveAllTeskitFiles(filePaths);

    expect(result).toEqual([]);
    expect(logger.warn).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenCalledWith(
      logs.notSupportedFileType('path/to/file1.txt'),
    );
    expect(logger.warn).toHaveBeenCalledWith(
      logs.notSupportedFileType('path/to/file2.txt'),
    );
  });

  it('should skip snapFile', async () => {
    const { paths } = testUtils.generateMockTestkitConfigFile(2, {
      skip: true,
    });

    pathMocks.extname('.js');

    const result = await resolveAllTeskitFiles(paths);

    expect(result).toEqual([]);

    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should resolve ts snap files', async () => {
    const folder = getTempFolder().replace('__tests__', '');
    const { paths: filePaths, testkitConfigs } =
      testUtils.generateMockTestkitConfigFile(2, {
        ts: true,
        folder,
        startCountFrom: 4,
      });

    pathMocks.extname('.ts');
    fsMocks.promises.unlink();

    const result = await resolveAllTeskitFiles(filePaths);

    expect(createProgram).toHaveBeenCalledTimes(1);
    expect(createProgram).toHaveBeenNthCalledWith(1, {
      options: {
        module: 'esnext',
        outDir: folder,
      },
      rootNames: filePaths,
    });

    expect(result).toEqual(
      testkitConfigs.map((testkit, i) =>
        resolveTestkitFile(testkit, filePaths[i]),
      ),
    );

    expect(logger.error).not.toHaveBeenCalled();
  });
});
