import {
  TESTKIT_FILE_NAME,
  TESTKIT_FOLDER_NAME,
} from '../constants/testkit.constants';
import { Screenshot, TestkitConfigFile } from '../types';

const generateSnapshotsPaths = (count: number): string[] => {
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

export const generateMockTestkitConfigFile = (
  count: number,
  options: {
    skip?: boolean;
    startCountFrom?: number;
    folder?: string;
    ts?: boolean;
  } = {
    skip: false,
    ts: false,
    folder: '',
    startCountFrom: 0,
  },
): { paths: string[]; testkitConfigs: TestkitConfigFile[] } => {
  const paths = Array.from(
    { length: count },
    (_, index) =>
      `${options.folder || `absolute/path/to`}/file${
        index + options.startCountFrom
      }.${options.ts ? 'ts' : 'js'}`,
  );
  const testkitConfigs: TestkitConfigFile[] = Array.from(
    { length: count },
    (_, index) => ({
      name: `file${index + options.startCountFrom}`,
      url: `http://localhost:3000/file${index + options.startCountFrom}`,
      skip: options.skip,
      tests: [
        {
          type: 'axe',
          description: 'description',
          selector: 'body',
        },
        {
          type: 'visual',
          description: 'description',
        },
      ],
    }),
  );

  for (let i = 0; i < count; i++) {
    jest.doMock(paths[i].replace('.ts', '.js'), () => testkitConfigs[i], {
      virtual: true,
    });
  }

  return {
    paths,
    testkitConfigs,
  };
};

export const testUtils = {
  generateSnapshotsPaths,
  generateMockScreenshots,
  generateMockTestkitConfigFile,
};
