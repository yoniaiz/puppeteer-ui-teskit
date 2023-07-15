import { glob } from 'glob';
import { getAllTestkitFiles } from '../getAllTestkitFiles';
import {
  mockProgramOptions,
  resetProgramOptions,
} from '../../../test/mockProgramOptions';
import { logger } from '../../../utils/logger';
import { logs } from '../constants';

const setup = ({ mockFilePaths }: { mockFilePaths: string[] }) => {
  jest.spyOn(glob, 'sync').mockReturnValueOnce(mockFilePaths);

  return getAllTestkitFiles();
};

describe('findAllSnapFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of file paths', () => {
    const mockFilePaths = [
      'absolute/path/to/file1.js',
      'absolute/path/to/file2.js',
    ];

    const result = setup({ mockFilePaths });

    expect(glob.sync).toHaveBeenCalledWith(
      `${process.cwd()}/**/*{.ui-testkit.js,.ui-testkit.ts}`,
    );
    expect(result).toEqual(mockFilePaths);
  });

  it("should filter file paths when 'program.options.file' is provided", () => {
    mockProgramOptions({
      file: 'file1',
    });

    setup({
      mockFilePaths: [],
    });

    expect(glob.sync).toHaveBeenCalledWith(
      `${process.cwd()}/**/*file1*{.ui-testkit.js,.ui-testkit.ts}`,
    );

    resetProgramOptions();
  });

  it('should log a warning when no snap files are found', () => {
    const result = setup({
      mockFilePaths: [],
    });

    expect(glob.sync).toHaveBeenCalledWith(
      `${process.cwd()}/**/*{.ui-testkit.js,.ui-testkit.ts}`,
    );
    expect(result).toEqual([]);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(logs.noTestkitsFound);
  });
});
