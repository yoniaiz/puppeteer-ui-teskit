export const logs = {
  gettingTestkits: 'Getting testkits...',
  noTestkitsFound: 'No testkits found',
  notSupportedFileType: (filePath: string): string =>
    `File type not supported: ${filePath}`,
  testkitFileIsEmpty: (filePath: string): string =>
    `Teskit file is empty: ${filePath}`,
  testkitFileInvalidURL: (filePath: string, url: string): string =>
    `Teskit file has invalid URL: ${filePath} - ${url}`,
  testkitFileMissingName: (filePath: string): string =>
    `Teskit file is missing name: ${filePath}`,
};
