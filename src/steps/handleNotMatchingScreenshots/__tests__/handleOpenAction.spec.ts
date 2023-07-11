import sharp from 'sharp';
import open from 'open';
import { handleOpenAction } from '../handleOpenAction.js';
import { fsMocks } from '../../../test/fsMocks.js';
import { pathMocks } from '../../../test/pathMocks.js';

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

describe('handleOpenAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle opening the diff image', async () => {
    const mockDiffImageBuffer = Buffer.from('diff image data');
    const mockNewSnapImageBuffer = Buffer.from('new snapshot image data');
    const mockOldSnapImageBuffer = Buffer.from('old snapshot image data');

    pathMocks.resolve();
    fsMocks.promises.writeFile();
    const mockGetBottomBarBuffer =
      fsMocks.promises.readFile(mockDiffImageBuffer);

    const mockFailedSnapshot = {
      diffImageBuffer: mockDiffImageBuffer,
      filePath: 'path/to/file',
      snapName: 'snapshot',
      newSnapImageBuffer: mockNewSnapImageBuffer,
      oldSnapImageBuffer: mockOldSnapImageBuffer,
    };

    await handleOpenAction(mockFailedSnapshot);

    expect(mockGetBottomBarBuffer).toHaveBeenCalledTimes(1);

    expect(sharp).toMatchSnapshot();

    expect(open).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith('path/to/snapshot.diff.png');
  });
});
