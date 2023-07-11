import screenshotWorker from '../screenshotWorker.js';
import * as compareImageModule from '../compareImages.js';
import { fsMocks } from '../../../test/fsMocks.js';
import { pathMocks } from '../../../test/pathMocks.js';
import { logs } from '../constants.js';
import {
  TESTKIT_FILE_NAME,
  TESTKIT_FOLDER_NAME,
} from '../../../constants/testkit.constants.js';

describe('resolveSnapshotSave', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle saving a new snapshot', async () => {
    const mockSnapshotBuffer = Buffer.from('snapshot image data');

    const filePath = 'path/to/file';
    const snapName = 'snapshot';

    fsMocks.promises.writeFile();
    fsMocks.existsSync(false);

    const result = await screenshotWorker({
      shouldUpdate: false,
      screenshot: {
        saveTo: filePath,
        name: snapName,
        description: 'description',
        snapshotBuffer: mockSnapshotBuffer,
      },
    });

    expect(result).toEqual({
      status: 'passed',
    });
  });

  it('should handle comparing images and return the result of not matching images', async () => {
    const mockSnapshotBuffer = Buffer.from('snapshot image data');
    const mockOldSnapFileBuffer = Buffer.from('old snapshot image data');
    const mockDiffImageBuffer = Buffer.from('diff image data');

    fsMocks.existsSync(true);
    jest.spyOn(compareImageModule, 'compareImages').mockResolvedValueOnce({
      diffImageBuffer: mockDiffImageBuffer,
      oldSnapFileBuffer: mockOldSnapFileBuffer,
      isMatching: false,
      diffRatio: 1,
    });

    const filePath = 'path/to/file';
    const snapName = 'snapshot';
    const shouldUpdate = false;

    const result = await screenshotWorker({
      shouldUpdate,
      screenshot: {
        saveTo: filePath,
        name: snapName,
        description: 'description',
        snapshotBuffer: mockSnapshotBuffer,
      },
    });

    expect(result).toEqual({
      status: 'notMatched',
      message: result.message,
      data: {
        description: 'description',
        diffImageBuffer: mockDiffImageBuffer,
        oldSnapImageBuffer: mockOldSnapFileBuffer,
        newSnapImageBuffer: mockSnapshotBuffer,
        filePath,
        snapName,
      },
    });
  });

  it('should handle comparing images and return the result of matching images', async () => {
    const mockSnapshotBuffer = Buffer.from('snapshot image data');
    const mockOldSnapFileBuffer = Buffer.from('old snapshot image data');

    fsMocks.existsSync(true);
    jest.spyOn(compareImageModule, 'compareImages').mockResolvedValueOnce({
      diffImageBuffer: null,
      oldSnapFileBuffer: mockOldSnapFileBuffer,
      isMatching: true,
      diffRatio: 0,
    });

    const filePath = 'path/to/file';
    const snapName = 'snapshot';
    const shouldUpdate = false;

    const result = await screenshotWorker({
      shouldUpdate,
      screenshot: {
        saveTo: filePath,
        name: snapName,
        description: 'description',
        snapshotBuffer: mockSnapshotBuffer,
      },
    });

    expect(result).toEqual({
      status: 'passed',
    });
  });

  it('should handle updating a snapshot', async () => {
    const mockSnapshotBuffer = Buffer.from('snapshot image data');

    const filePath = 'path/to/file';
    const snapName = 'snapshot';
    const shouldUpdate = true;

    fsMocks.promises.writeFile();
    fsMocks.existsSync(true);

    const result = await screenshotWorker({
      shouldUpdate,
      screenshot: {
        saveTo: filePath,
        name: snapName,
        description: 'description',
        snapshotBuffer: mockSnapshotBuffer,
      },
    });

    expect(result).toEqual({
      status: 'passed',
    });
  });

  it('should return an error when trying to update a snapshot that in CI', async () => {
    const mockSnapshotBuffer = Buffer.from('snapshot image data');

    pathMocks.resolve();
    const filePath = 'path/to/file';
    const snapName = 'snapshot';
    const shouldUpdate = true;

    fsMocks.promises.writeFile();
    fsMocks.existsSync(true);

    const result = await screenshotWorker({
      shouldUpdate,
      screenshot: {
        saveTo: filePath,
        name: snapName,
        description: 'description',
        snapshotBuffer: mockSnapshotBuffer,
      },
      isCI: true,
    });

    expect(result).toEqual({
      status: 'failed',
      message: logs.cantSaveScreenshotInCI(
        `path/to/${TESTKIT_FOLDER_NAME}/snapshot-description.${TESTKIT_FILE_NAME}.png`,
      ),
    });
  });
});
