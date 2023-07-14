export const logs = {
  unusedSnapshotsFound: (
    unusedSnapshotsLength: number,
    totalScreenshots: number,
  ) => `Unused snapshots: ${unusedSnapshotsLength}/${totalScreenshots}`,

  allScreenshotsPassed: (totalScreenshots: number) =>
    `All screenshots tests passed: ${totalScreenshots}/${totalScreenshots}`,
  allAxeTestsPassed: (totalAxeTests: number) =>
    `All axe tests passed: ${totalAxeTests}/${totalAxeTests}`,

  failedScreenshots: (
    totalFailedScreenshots: number,
    totalScreenshots: number,
  ) => `Failed screenshots: ${totalFailedScreenshots}/${totalScreenshots}`,

  notMatchedScreenshots: (
    notMatchedScreenshotsCount: number,
    totalScreenshots: number,
  ) =>
    `Not matched screenshots: ${notMatchedScreenshotsCount}/${totalScreenshots}`,

  axeTestsResultsWithErrors: (
    axeTestsResultsWithErrorsCount: number,
    totalAxeTests: number,
  ) =>
    `Axe tests with errors: ${axeTestsResultsWithErrorsCount}/${totalAxeTests}`,

  totalFailedTests: (
    totalFailedScreenshots: number,
    notMatchedScreenshotsCount: number,
    axeTestsResultsWithErrorsCount: number,
    totalTests: number,
  ) =>
    `Total failed tests: ${
      totalFailedScreenshots +
      notMatchedScreenshotsCount +
      axeTestsResultsWithErrorsCount
    }/${totalTests}`,
};

export const OUTPUT_CI_ERROR_MESSAGE =
  'Failed tests found. See logs above for details.';
