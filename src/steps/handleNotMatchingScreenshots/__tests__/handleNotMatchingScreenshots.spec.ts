import prompts from 'prompts';
import { logger } from '../../../utils/logger';
import { handleNotMatchingScreenshots } from '../handleNotMatchingScreenshots';
import { fsMocks } from '../../../test/fsMocks';
import { pathMocks } from '../../../test/pathMocks';
import open from 'open';
import fs from 'fs';
import { FailedSnapshot } from '../../../types';
import { logs } from '../constants';
import { mockProgramOptions } from '../../../test/mockProgramOptions';

jest.mock('sharp', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    composite: jest.fn(() => ({
      toBuffer: jest.fn(() => Buffer.from('')),
      png: jest.fn(() => ({
        toBuffer: jest.fn(() => Buffer.from('')),
      })),
    })),
  })),
}));

jest.mock('open', () => jest.fn());

const setup = async ({
  isCI = false,
  notMatchedSnapshots = [],
  action = 'update',
}: {
  isCI?: boolean;
  failedSnapshotsCount?: number;
  totalSnapshotsCount?: number;
  notMatchedSnapshots?: FailedSnapshot[];
  action?: string;
}) => {
  mockProgramOptions({}, isCI);
  const promptMock = jest.spyOn(prompts, 'prompt').mockImplementation(() => {
    return Promise.resolve({ action });
  });
  const writeFileMock = fsMocks.promises.writeFile();

  const { notMatchedScreenshotsCount } = await handleNotMatchingScreenshots(
    notMatchedSnapshots,
  );

  return {
    promptMock,
    writeFileMock,
    notMatchedScreenshotsCount,
  };
};

describe('handleFailedSnapshots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle all snapshots passed', async () => {
    const totalSnapshotsCount = 2;

    await setup({
      totalSnapshotsCount,
    });

    expect(logger.warn).toHaveBeenCalledTimes(0);
  });

  it('should handle failed snapshots in CI', async () => {
    const failedSnapshotsCount = 3;
    const totalSnapshotsCount = 5;

    try {
      await setup({
        failedSnapshotsCount,
        totalSnapshotsCount,
        isCI: true,
      });
    } catch (error) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error).toBeDefined();
    }
  });

  it('should update not matching snapshots', async () => {
    const notMatchedSnapshots: FailedSnapshot[] = [
      {
        diffImageBuffer: Buffer.from('diff image data'),
        oldSnapImageBuffer: Buffer.from('old snapshot image data'),
        filePath: 'path/to/file',
        snapName: 'snapshot',
        newSnapImageBuffer: Buffer.from('new snapshot image data'),
      },
    ];

    const totalSnapshotsCount = 2;

    const { promptMock, writeFileMock, notMatchedScreenshotsCount } =
      await setup({
        notMatchedSnapshots,

        totalSnapshotsCount,
        action: 'update',
      });

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      logs.startHandlingNotMatchingSnapshots(notMatchedSnapshots.length),
    );
    expect(promptMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledTimes(1);
    expect(notMatchedScreenshotsCount).toBe(0);
  });

  it('should skip not matching snapshots', async () => {
    const notMatchedSnapshots: FailedSnapshot[] = [
      {
        diffImageBuffer: Buffer.from('diff image data'),
        oldSnapImageBuffer: Buffer.from('old snapshot image data'),
        filePath: 'path/to/file',
        snapName: 'snapshot',
        newSnapImageBuffer: Buffer.from('new snapshot image data'),
      },
    ];

    const { promptMock, writeFileMock, notMatchedScreenshotsCount } =
      await setup({
        notMatchedSnapshots,
        action: 'skip',
      });

    expect(promptMock).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledTimes(0);
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(notMatchedScreenshotsCount).toBe(1);
  });

  it('should open and skip failed snapshot', async () => {
    const notMatchedSnapshots: FailedSnapshot[] = [
      {
        diffImageBuffer: Buffer.from('diff image data'),
        oldSnapImageBuffer: Buffer.from('old snapshot image data'),
        filePath: 'path/to/file',
        snapName: 'snapshot',
        newSnapImageBuffer: Buffer.from('new snapshot image data'),
      },
    ];
    const mockDiffImageBuffer = Buffer.from('diff image data');

    const promptMock = jest
      .spyOn(prompts, 'prompt')
      .mockImplementationOnce(() => {
        return Promise.resolve({ action: 'open' });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({ action: 'update' });
      });

    const writeFileMock = fsMocks.promises.writeFile();
    const unlinkFileMock = fsMocks.promises.unlink();
    jest
      .spyOn(fs, 'existsSync')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    pathMocks.resolve();

    const mockGetBottomBarBuffer =
      fsMocks.promises.readFile(mockDiffImageBuffer);

    await handleNotMatchingScreenshots(notMatchedSnapshots);

    expect(promptMock).toHaveBeenCalledTimes(2);
    expect(mockGetBottomBarBuffer).toHaveBeenCalledTimes(1);
    expect(writeFileMock).toHaveBeenCalledTimes(2);
    expect(open).toHaveBeenCalledTimes(1);
    expect(unlinkFileMock).toHaveBeenCalledTimes(1);
  });
});
