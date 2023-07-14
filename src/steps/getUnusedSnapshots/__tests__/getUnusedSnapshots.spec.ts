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
import { testUtils } from '../../../test/utils';

describe('getUnusedSnapshots', () => {
  it('Should get unused snapshots', async () => {
    const mockFilePaths = testUtils.generateSnapshotsPaths(3);
    const newScreenshots: Screenshot[] = testUtils.generateMockScreenshots(2);

    jest.spyOn(glob, 'sync').mockReturnValueOnce(mockFilePaths);
    pathMocks.resolve();

    const unusedSnapshots = await getUnusedSnapshots(newScreenshots);

    expect(unusedSnapshots).toEqual([mockFilePaths[2]]);
  });

  it('Should return empty array if no unused snapshots', async () => {
    const mockFilePaths = testUtils.generateSnapshotsPaths(2);
    const newScreenshots: Screenshot[] = testUtils.generateMockScreenshots(2);

    jest.spyOn(glob, 'sync').mockReturnValueOnce(mockFilePaths);
    pathMocks.resolve();

    const unusedSnapshots = await getUnusedSnapshots(newScreenshots);

    expect(unusedSnapshots).toEqual([]);
  });

  it('Should return empty array if filtered files', async () => {
    mockProgramOptions({
      file: 'file1',
    });

    const newScreenshots: Screenshot[] = testUtils.generateMockScreenshots(2);

    const unusedSnapshots = await getUnusedSnapshots(newScreenshots);

    expect(unusedSnapshots).toEqual([]);

    resetProgramOptions();
  });

  it('Should remove unused snapshots it update option is true', async () => {
    mockProgramOptions({
      update: true,
    });

    const mockFilePaths = testUtils.generateSnapshotsPaths(3);
    const newScreenshots: Screenshot[] = testUtils.generateMockScreenshots(1);

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
