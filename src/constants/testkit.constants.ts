export const TESTKIT_FILE_NAME = 'ui-testkit';
export const TESTKIT_FOLDER_NAME = '__visual_snapshots__';
export const TESTKIT_FILE_EXTENSIONS = ['js', 'ts'].map(
  (extension) => `.${TESTKIT_FILE_NAME}.${extension}`,
);
