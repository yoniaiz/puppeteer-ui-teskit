import { program } from '../../utils/createProgram.js';
import { logger } from '../../utils/logger.js';
import { logs } from './constants.js';

interface OutputParams {
  notMatchedScreenshotsCount: number;
  axeTestsResultsWithErrorsCount: number;
  totalAxeTests: number;
  totalFailedScreenshots: number;
  totalScreenshots: number;
  unusedSnapshots: string[];
}

export const handleOutput = ({
  axeTestsResultsWithErrorsCount,
  notMatchedScreenshotsCount,
  totalAxeTests,
  totalFailedScreenshots,
  totalScreenshots,
  unusedSnapshots,
}: OutputParams) => {
  if (unusedSnapshots.length) {
    logger.warn(
      logs.unusedSnapshotsFound(unusedSnapshots.length, totalScreenshots),
    );

    unusedSnapshots.forEach((unusedSnapshot) => {
      logger.warn(`unused - ${unusedSnapshot}`);
    });
  }

  if (
    !axeTestsResultsWithErrorsCount &&
    !notMatchedScreenshotsCount &&
    !totalFailedScreenshots
  ) {
    if (totalAxeTests) {
      logger.success(logs.allAxeTestsPassed(totalAxeTests));
    }
    if (totalScreenshots) {
      logger.success(logs.allScreenshotsPassed(totalScreenshots));
    }
    return;
  }

  if (totalFailedScreenshots) {
    logger.error(
      logs.failedScreenshots(totalFailedScreenshots, totalScreenshots),
    );
  }

  if (notMatchedScreenshotsCount) {
    logger.error(
      logs.notMatchedScreenshots(notMatchedScreenshotsCount, totalScreenshots),
    );
  }

  if (axeTestsResultsWithErrorsCount) {
    logger.error(
      logs.axeTestsResultsWithErrors(
        axeTestsResultsWithErrorsCount,
        totalAxeTests,
      ),
    );
  }

  logger.error(
    logs.totalFailedTests(
      totalFailedScreenshots,
      notMatchedScreenshotsCount,
      axeTestsResultsWithErrorsCount,
      totalScreenshots + totalAxeTests,
    ),
  );

  if (program.isCI) {
    throw new Error('Failed tests found. See logs above for details.');
  }
};
