import { createProgram } from 'typescript';
import { resolveAllTeskitFiles } from '../resolveAllTeskitFiles';
import { TestkitConfigFile } from '../../../types';
import { pathMocks } from '../../../test/pathMocks';
import { logger } from '../../../utils/logger';
import { logs } from '../constants';
import { fsMocks } from '../../../test/fsMocks';
import { getTempFolder } from '../getTempFolder';

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
    const filePaths = ['path/to/file1.js', 'path/to/file2.js'];

    const mockSnapFile: TestkitConfigFile = {
      name: 'Test Snap File',
      url: 'http://example.com',
      tests: [
        {
          type: 'axe',
          description: 'Test Axe Test',
          selector: 'body',
        },
        {
          type: 'visual',
          description: 'Test Visual Test',
        },
      ],
    };
    jest.mock('path/to/file1.js', () => mockSnapFile, { virtual: true });
    jest.mock('path/to/file2.js', () => mockSnapFile, { virtual: true });

    pathMocks.extname('.js');

    const result = await resolveAllTeskitFiles(filePaths);

    expect(result).toEqual([
      {
        name: 'Test Snap File',
        path: 'path/to/file1.js',
        tests: [
          {
            type: 'axe',
            description: 'Test Axe Test',
            selector: 'body',
            url: 'http://example.com',
          },
          {
            type: 'visual',
            description: 'Test Visual Test',
            url: 'http://example.com',
          },
        ],
      },
      {
        name: 'Test Snap File',
        path: 'path/to/file2.js',
        tests: [
          {
            type: 'axe',
            description: 'Test Axe Test',
            selector: 'body',
            url: 'http://example.com',
          },
          {
            type: 'visual',
            description: 'Test Visual Test',
            url: 'http://example.com',
          },
        ],
      },
    ]);

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
    const filePaths = ['path/to/file3.js', 'path/to/file4.js'];

    const mockSnapFile: TestkitConfigFile = {
      name: 'Test Snap File',
      url: 'http://example.com',
      skip: true,
      tests: [
        {
          type: 'axe',
          description: 'Test Axe Test',
          selector: 'body',
        },
        {
          type: 'visual',
          description: 'Test Visual Test',
        },
      ],
    };
    jest.mock('path/to/file3.js', () => mockSnapFile, { virtual: true });
    jest.mock('path/to/file4.js', () => mockSnapFile, { virtual: true });

    pathMocks.extname('.js');

    const result = await resolveAllTeskitFiles(filePaths);

    expect(result).toEqual([]);

    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should resolve ts snap files', async () => {
    const filePaths = ['path/to/file1.ts', 'path/to/file2.ts'];

    const mockSnapFile: TestkitConfigFile = {
      name: 'Test Snap File',
      url: 'http://example.com',
      tests: [
        {
          type: 'axe',
          description: 'Test Axe Test',
          selector: 'body',
        },
        {
          type: 'visual',
          description: 'Test Visual Test',
        },
      ],
    };

    const folderPath = getTempFolder().replace('__tests__', '');
    jest.doMock(`${folderPath}/file1.js`, () => mockSnapFile, {
      virtual: true,
    });
    jest.doMock(`${folderPath}/file2.js`, () => mockSnapFile, {
      virtual: true,
    });

    pathMocks.extname('.ts');
    fsMocks.promises.unlink();

    const result = await resolveAllTeskitFiles(filePaths);

    expect(createProgram).toHaveBeenCalledTimes(1);
    expect(createProgram).toHaveBeenNthCalledWith(1, {
      options: {
        module: 'esnext',
        outDir: folderPath,
      },
      rootNames: ['path/to/file1.ts', 'path/to/file2.ts'],
    });

    expect(result).toEqual([
      {
        name: 'Test Snap File',
        path: 'path/to/file1.ts',
        tests: [
          {
            type: 'axe',
            description: 'Test Axe Test',
            selector: 'body',
            url: 'http://example.com',
          },
          {
            type: 'visual',
            description: 'Test Visual Test',
            url: 'http://example.com',
          },
        ],
      },
      {
        name: 'Test Snap File',
        path: 'path/to/file2.ts',
        tests: [
          {
            type: 'axe',
            description: 'Test Axe Test',
            selector: 'body',
            url: 'http://example.com',
          },
          {
            type: 'visual',
            description: 'Test Visual Test',
            url: 'http://example.com',
          },
        ],
      },
    ]);

    expect(logger.error).not.toHaveBeenCalled();
  });
});
