import fs from 'fs';
import pixelmatch from 'pixelmatch';
import pngjs from 'pngjs';
import { compareImages } from '../compareImages';
import { pathMocks } from '../../../test/pathMocks';
import { Screenshot } from '../../../types';
import {
  TESTKIT_FILE_NAME,
  TESTKIT_FOLDER_NAME,
} from '../../../constants/testkit.constants';

jest.mock('pixelmatch');

describe('compareImages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should compare images and return result false if there is a difference', async () => {
    const mockNewSnapshotBuffer = Buffer.from('new snapshot image data');
    const mockOldSnapFileBuffer = Buffer.from('old snap file image data');

    jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValueOnce(mockOldSnapFileBuffer);

    pathMocks.resolve();

    (pixelmatch as jest.Mock).mockReturnValue(1);

    const filePath = 'path/to/file';
    const snapName = 'snapshot';

    const result = await compareImages({
      name: snapName,
      saveTo: filePath,
      snapshotBuffer: mockNewSnapshotBuffer,
      description: 'description',
    });

    expect(fs.promises.readFile).toHaveBeenCalledTimes(1);
    expect(fs.promises.readFile).toHaveBeenCalledWith(
      `path/to/${TESTKIT_FOLDER_NAME}/snapshot-description.${TESTKIT_FILE_NAME}.png`,
    );

    expect(result).toEqual({
      diffImageBuffer: new pngjs.PNG({ width: 1, height: 1 }).data,
      oldSnapFileBuffer: mockOldSnapFileBuffer,
      isMatching: false,
      diffRatio: 1,
    });
  });

  it('should compare images and return result true if there is no difference', async () => {
    const mockNewSnapshotBuffer = Buffer.from('new snapshot image data');
    const mockOldSnapFileBuffer = Buffer.from('old snap file image data');

    jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValueOnce(mockOldSnapFileBuffer);

    pathMocks.resolve();

    (pixelmatch as jest.Mock).mockReturnValue(0);

    const filePath = 'path/to/file';
    const snapName = 'snapshot';

    const screenshot: Screenshot = {
      saveTo: filePath,
      name: snapName,
      snapshotBuffer: mockNewSnapshotBuffer,
      description: 'description',
    };

    const result = await compareImages(screenshot);

    expect(result).toEqual({
      diffImageBuffer: null,
      oldSnapFileBuffer: mockOldSnapFileBuffer,
      isMatching: true,
      diffRatio: 0,
    });
  });
});
