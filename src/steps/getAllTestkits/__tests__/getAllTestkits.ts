import { glob } from 'glob';
import { getAllTestkits } from '../getAllTestkits.js';
import { TestkitConfigFile } from '../../../types/index.js';
import { logger } from '../../../utils/logger.js';
import { logs } from '../constants.js';

describe('getAllSnapFiles', () => {
  it('should find and return resolved files', async () => {
    const mockFilePaths = [
      'absolute/path/to/file1.js',
      'absolute/path/to/file2.js',
    ];

    const mockSnapFiles: TestkitConfigFile[] = [
      {
        name: 'file1',
        url: 'http://localhost:3000/file1',
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
      },
      {
        name: 'file2',
        url: 'http://localhost:3000/file2',
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
      },
    ];

    jest.mock('absolute/path/to/file1.js', () => mockSnapFiles[0], {
      virtual: true,
    });
    jest.mock('absolute/path/to/file2.js', () => mockSnapFiles[1], {
      virtual: true,
    });

    jest.spyOn(glob, 'sync').mockReturnValueOnce(mockFilePaths);

    const result = await getAllTestkits();

    expect(logger.info).toBeCalledWith(logs.gettingTestkits);
    expect(glob.sync).toHaveBeenCalledWith(
      './**/*{.ui-testkit.js,.ui-testkit.ts}',
    );
    expect(result).toMatchSnapshot();
  });
});
