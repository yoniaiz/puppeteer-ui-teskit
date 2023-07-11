export const logs = {
  startGettingTestkits: 'Getting testkits',
  noTestkitsFound: 'No testkits found',
  testkitFileSkipped: (filePath: string): string =>
    `Testkit file skipped: ${filePath}`,
  notSupportedFileType: (filePath: string): string =>
    `File type not supported: ${filePath}`,
  testkitFileIsEmpty: (filePath: string): string =>
    `Teskit file is empty: ${filePath}`,
  testkitFileInvalidURL: (filePath: string, url: string): string =>
    `Teskit file has invalid URL: ${filePath} - ${url}`,
  testkitFileMissingName: (filePath: string): string =>
    `Teskit file is missing name: ${filePath}`,
  testkitFileMissingTests: (filePath: string) =>
    `Snap file is missing tests: ${filePath}`,
  testkitTestMissingDescription: (filePath: string, type: string): string =>
    `Testkit test is missing description: ${filePath} - ${type}`,
  testkitTestMissingURL: (
    filePath: string,
    type: string,
    description: string,
  ): string =>
    `Testkit test is missing URL: ${filePath} - ${type} - ${description}`,
  testkitTestInvalidURL: (
    filePath: string,
    type: string,
    description: string,
    url: string,
  ): string =>
    `Testkit test has invalid URL: ${filePath} - ${type} - ${description} - ${url}`,
  testkitAxeTestMissingSelector: (
    filePath: string,
    type: string,
    description: string,
    url: string,
  ): string =>
    `Testkit test has invalid URL: ${filePath} - ${type} - ${description} - ${url}`,
};
