import { glob } from 'glob';
import { getUnusedSnapshots } from '../getUnusedSnapshots';
import { fsMocks } from '../../../test/fsMocks';
import { pathMocks } from '../../../test/pathMocks';
import { logger } from '../../../utils/logger';
import fs from 'fs';
import type { Screenshot } from '../../../types';
import {
  mockProgramOptions,
  resetProgramOptions,
} from '../../../test/mockProgramOptions';
import { logs } from '../constants';
import {
  TESTKIT_FILE_NAME,
  TESTKIT_FOLDER_NAME,
} from '../../../constants/testkit.constants';

const generateMockPaths = (count: number): string[] => {
  return Array.from(
    { length: count },
    (_, index) =>
      `path/to/${TESTKIT_FOLDER_NAME}/file${index}-description.${TESTKIT_FILE_NAME}.png`,
  );
};

const generateMockScreenshots = (count: number): Screenshot[] => {
  return Array.from({ length: count }, (_, index) => ({
    saveTo: `absolute/path/to/file${index}.${TESTKIT_FILE_NAME}.ts`,
    name: `file${index}`,
    description: 'description',
    snapshotBuffer: Buffer.from(''),
  }));
};

describe('getUnusedSnapshots', () => {
  it('Should get unused snapshots', async () => {
    const mockFilePaths = generateMockPaths(3);
    const newScreenshots: Screenshot[] = generateMockScreenshots(2);

    jest.spyOn(glob, 'sync').mockReturnValueOnce(mockFilePaths);
    pathMocks.resolve();

    const unusedSnapshots = await getUnusedSnapshots(newScreenshots);

    expect(unusedSnapshots).toEqual([mockFilePaths[2]]);
  });

  it('Should return empty array if no unused snapshots', async () => {
    const mockFilePaths = generateMockPaths(2);
    const newScreenshots: Screenshot[] = generateMockScreenshots(2);

    jest.spyOn(glob, 'sync').mockReturnValueOnce(mockFilePaths);
    pathMocks.resolve();

    const unusedSnapshots = await getUnusedSnapshots(newScreenshots);

    expect(unusedSnapshots).toEqual([]);
  });

  it('Should return empty array if filtered files', async () => {
    mockProgramOptions({
      file: 'file1',
    });

    const newScreenshots: Screenshot[] = generateMockScreenshots(2);

    const unusedSnapshots = await getUnusedSnapshots(newScreenshots);

    expect(unusedSnapshots).toEqual([]);

    resetProgramOptions();
  });

  it('Should remove unused snapshots it update option is true', async () => {
    mockProgramOptions({
      update: true,
    });

    const mockFilePaths = generateMockPaths(3);
    const newScreenshots: Screenshot[] = generateMockScreenshots(1);

    jest.spyOn(glob, 'sync').mockReturnValue(mockFilePaths);
    pathMocks.resolve();
    fsMocks.promises.unlink();

    const unusedSnapshots = await getUnusedSnapshots(newScreenshots);

    expect(unusedSnapshots).toEqual([]);
    expect(fs.promises.unlink).toHaveBeenCalledTimes(2);
    expect(logger.info).toHaveBeenCalledTimes(2);
    expect(logger.info).toHaveBeenCalledWith(
      logs.removedUnusedSnapshot(mockFilePaths[1]),
    );
    expect(logger.info).toHaveBeenCalledWith(
      logs.removedUnusedSnapshot(mockFilePaths[2]),
    );
  });
});
