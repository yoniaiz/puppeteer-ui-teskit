const error = {
  cantSaveScreenshotInCI: (screenshotPath: string): string =>
    `Can't save screenshot in CI: ${screenshotPath}`,
  failedSnapshotsInCI: (
    failedSnapshotsCount: number,
    totalSnapshots: number,
  ): string =>
    `Found ${failedSnapshotsCount} failed snapshots out of ${totalSnapshots} in CI`,
  screenshotNotMatched: (
    diffRatio: number,
    filePath: string,
    testkitName: string,
  ): string => `
    Found a diff in the snapshot:\n
    diffRatio: ${diffRatio}%\n
    filePath: ${filePath}\n
    testkitName: ${testkitName}
  `,
  testkitFileMissingTests: (filePath: string): string =>
    `Teskit file is missing tests: ${filePath}`,
  testkitTestMissingDescription: (filePath: string, testType: string): string =>
    `Teskit test is missing description: ${filePath} - ${testType}`,
  testkitTestMissingURL: (
    filePath: string,
    testType: string,
    testDescription: string,
  ): string =>
    `Teskit test is missing URL: ${filePath} - ${testType} - ${testDescription}`,
  testkitTestInvalidURL: (
    filePath: string,
    testType: string,
    testDescription: string,
    testURL: string,
  ): string =>
    `Teskit test has invalid URL: ${filePath} - ${testType} - ${testDescription} - ${testURL}`,
  testkitAxeTestMissingSelector: (
    filePath: string,
    testDescription: string,
  ): string =>
    `Teskit axe test is missing selector: ${filePath} - ${testDescription}`,
};

const warnings = {
  notMatchingSnapshots: (
    notMatchedSnapshotsCount: number,
    totalSnapshots: number,
  ): string =>
    `Found ${notMatchedSnapshotsCount} not matched snapshots out of ${totalSnapshots}`,
};

const info = {
  skipSnapshot: (testkitName: string): string =>
    `Skipping snapshot ${testkitName}`,
  updateSnapshot: (testkitName: string): string =>
    `Updating snapshot ${testkitName}`,
  lunchingBrowser: 'Lunching browser',
  closingBrowser: 'Closing browser',
  timeTookTheProcess: (seconds: number): string =>
    `Time took the process: ${seconds}s`,
  serveStatics: (statics: string, port: number): string =>
    `Serving statics: ${statics} on port: ${port}`,
  closeStatics: (port: number): string =>
    `Closing statics server on port: ${port}`,
  testkitFileSkipped: (filePath: string): string =>
    `Teskit file skipped: ${filePath}`,
  removedUnusedSnapshot: (path: string): string =>
    `Removed unused snapshot: ${path}`,
};
const debug = {};
const success = {
  allSnapshotsPassed: (totalSnapshots: number): string =>
    `All ${totalSnapshots} snapshots passed`,
  axeTestsResultsWithNoErrors: (totalAxeTests: number): string =>
    `${totalAxeTests} axe tests passed`,
};

export const messages = {
  error,
  warnings,
  info,
  debug,
  success,
};
