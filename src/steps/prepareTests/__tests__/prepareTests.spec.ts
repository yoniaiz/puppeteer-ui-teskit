import type { ResolvedTestkitFile } from '../../../types';
import { BrowserLuncher } from '../BrowserLuncher/BrowserLuncher.js';
import { logger } from '../../../utils/logger.js';
import { prepareTests } from '../prepareTests.js';
import { logs } from '../constants';

jest.mock('../BrowserLuncher/BrowserLuncher.js');

describe('prepareTests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should take screenshots and return an array of screenshots', async () => {
    const mockBrowserInstance = new BrowserLuncher();

    const mockSnapshotFiles: ResolvedTestkitFile[] = [
      {
        path: 'path/to/file1',
        name: 'some name',
        tests: [
          {
            type: 'visual',
            description: 'some description',
            url: 'http://example.com',
          },
        ],
      },
      {
        path: 'path/to/file2',
        name: 'some name',
        tests: [
          {
            type: 'visual',
            description: 'some description',
            url: 'http://example.com',
          },
        ],
      },
    ];

    const mockSnapshotBuffer = Buffer.from('');

    const { screenshots } = await prepareTests(mockSnapshotFiles);

    expect(mockBrowserInstance.navigateToPage).toHaveBeenCalledTimes(
      mockSnapshotFiles.length,
    );

    expect(logger.log).toHaveBeenCalledTimes(mockSnapshotFiles.length);

    mockSnapshotFiles.forEach((snapshotFile, i) => {
      snapshotFile.tests.forEach((_test) => {
        expect(mockBrowserInstance.navigateToPage).toHaveBeenNthCalledWith(
          i + 1,
          _test.url,
        );

        expect(screenshots[i]).toEqual({
          name: snapshotFile.name,
          snapshotBuffer: mockSnapshotBuffer,
          saveTo: snapshotFile.path,
          description: _test.description,
          threshold: 0.005,
        });
        expect(logger.log).toHaveBeenNthCalledWith(
          i + 1,
          logs.takingScreenshot(
            snapshotFile.name,
            _test.description,
            _test.url as string,
          ),
        );
      });
    });

    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should handle axe tests and return an array of axe tests results', async () => {
    const mockBrowserInstance = new BrowserLuncher();

    const mockSnapshotFiles: ResolvedTestkitFile[] = [
      {
        path: 'path/to/file1',
        name: 'some name',
        tests: [
          {
            type: 'axe',
            selector: 'some selector',
            description: 'some description',
            url: 'http://example.com',
          },
        ],
      },
      {
        path: 'path/to/file2',
        name: 'some name',
        tests: [
          {
            type: 'axe',
            selector: 'some selector',
            description: 'some description',
            url: 'http://example.com',
          },
        ],
      },
    ];

    const { axeTestsResults } = await prepareTests(mockSnapshotFiles);

    expect(mockBrowserInstance.navigateToPage).toHaveBeenCalledTimes(
      mockSnapshotFiles.length,
    );

    expect(logger.log).toHaveBeenCalledTimes(mockSnapshotFiles.length);

    mockSnapshotFiles.forEach(({ tests, ...rest }, i) => {
      tests.forEach((_test) => {
        expect(mockBrowserInstance.navigateToPage).toHaveBeenNthCalledWith(
          i + 1,
          _test.url,
        );

        expect(axeTestsResults[i]).toEqual({
          ...rest,
          url: _test.url,
          violations: [],
          description: _test.description,
        });
        expect(logger.log).toHaveBeenNthCalledWith(
          i + 1,
          logs.runningAxe(rest.name, _test.description, _test.url as string),
        );
      });
    });

    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should handle beforeTest error and return screenshot', async () => {
    const mockBrowserInstance = new BrowserLuncher();

    const mockError = new Error('beforeTest error');

    const mockSnapshotFiles: ResolvedTestkitFile[] = [
      {
        name: 'some name',
        path: 'path/to/file1',
        tests: [
          {
            type: 'visual',
            url: 'http://example.com',
            beforeTest: jest.fn(() => {
              throw mockError;
            }),
            description: 'some description',
          },
        ],
      },
      {
        name: 'some name',
        path: 'path/to/file2',
        tests: [
          {
            type: 'visual',
            url: 'http://example.com',
            beforeTest: jest.fn(),
            description: 'some description',
          },
        ],
      },
    ];

    const { screenshots, failedScreenshotsCount } = await prepareTests(
      mockSnapshotFiles,
    );

    expect(mockBrowserInstance.navigateToPage).toHaveBeenCalledTimes(
      mockSnapshotFiles.length,
    );

    expect(mockSnapshotFiles[0].tests[0].beforeTest).toHaveBeenCalledTimes(1);
    expect(mockSnapshotFiles[0].tests[0].beforeTest).toHaveBeenCalledWith(
      mockBrowserInstance.publicDriver(),
    );
    expect(mockSnapshotFiles[1].tests[0].beforeTest).toHaveBeenCalledTimes(1);
    expect(mockSnapshotFiles[1].tests[0].beforeTest).toHaveBeenCalledWith(
      mockBrowserInstance.publicDriver(),
    );

    expect(screenshots).toEqual([
      {
        name: mockSnapshotFiles[1].name,
        snapshotBuffer: Buffer.from(''),
        threshold: 0.005,
        description: mockSnapshotFiles[1].tests[0].description,
        saveTo: mockSnapshotFiles[1].path,
      },
    ]);

    expect(failedScreenshotsCount).toEqual(1);

    expect(logger.log).toHaveBeenCalledWith(
      logs.takingScreenshot(
        mockSnapshotFiles[0].name,
        mockSnapshotFiles[0].tests[0].description,
        mockSnapshotFiles[0].tests[0].url as string,
      ),
    );

    expect((logger.error as unknown as jest.Mock).mock.calls[0][0])
      .toMatchInlineSnapshot(`
      "
        Failed to run beforeTest function for http://example.com

        name: some name

        description: some description

        path: path/to/file1

        Error: beforeTest error
      "
    `);
  });

  it('should handle afterTest error and return screenshot', async () => {
    const mockBrowserInstance = new BrowserLuncher();

    const mockError = new Error('afterTest error');

    const mockSnapshotFiles: ResolvedTestkitFile[] = [
      {
        name: 'some name',
        path: 'path/to/file1',
        tests: [
          {
            type: 'visual',
            url: 'http://example.com',
            afterTest: jest.fn(() => {
              throw mockError;
            }),
            description: 'some description',
          },
        ],
      },
      {
        name: 'some name',
        path: 'path/to/file2',
        tests: [
          {
            type: 'visual',
            url: 'http://example.com',
            afterTest: jest.fn(),
            description: 'some description',
          },
        ],
      },
    ];

    const { screenshots, failedScreenshotsCount } = await prepareTests(
      mockSnapshotFiles,
    );

    expect(mockBrowserInstance.navigateToPage).toHaveBeenCalledTimes(
      mockSnapshotFiles.length,
    );

    expect(mockSnapshotFiles[0].tests[0].afterTest).toHaveBeenCalledTimes(1);
    expect(mockSnapshotFiles[0].tests[0].afterTest).toHaveBeenCalledWith(
      mockBrowserInstance.publicDriver(),
    );
    expect(mockSnapshotFiles[1].tests[0].afterTest).toHaveBeenCalledTimes(1);
    expect(mockSnapshotFiles[1].tests[0].afterTest).toHaveBeenCalledWith(
      mockBrowserInstance.publicDriver(),
    );

    expect(screenshots).toEqual([
      {
        name: mockSnapshotFiles[1].name,
        snapshotBuffer: Buffer.from(''),
        threshold: 0.005,
        description: mockSnapshotFiles[1].tests[0].description,
        saveTo: mockSnapshotFiles[1].path,
      },
    ]);

    expect(failedScreenshotsCount).toEqual(1);

    expect(logger.log).toHaveBeenCalledWith(
      logs.takingScreenshot(
        mockSnapshotFiles[0].name,
        mockSnapshotFiles[0].tests[0].description,
        mockSnapshotFiles[0].tests[0].url as string,
      ),
    );

    expect((logger.error as unknown as jest.Mock).mock.calls[0][0])
      .toMatchInlineSnapshot(`
      "
        Failed to run afterTest function for http://example.com

        name: some name

        description: some description

        path: path/to/file1

        Error: afterTest error
      "
    `);
  });

  it('should call navigate to page when url changes or should reset', async () => {
    const mockBrowserInstance = new BrowserLuncher();

    const mockSnapshotFiles: ResolvedTestkitFile[] = [
      {
        name: 'some name',
        path: 'path/to/file1',
        tests: [
          {
            type: 'visual',
            url: 'http://example.com',
            resetAfterTest: true,
            description: 'some description',
          },
          {
            type: 'visual',
            url: 'http://example.com',
            resetAfterTest: false,
            description: 'some description',
          },
          {
            type: 'visual',
            url: 'http://example3.com',
            description: 'some description',
          },
          {
            type: 'axe',
            selector: 'some selector',
            url: 'http://example3.com',
            description: 'some description',
          },
        ],
      },
    ];

    await prepareTests(mockSnapshotFiles);

    expect(mockBrowserInstance.navigateToPage).toHaveBeenCalledTimes(3);
  });
});
