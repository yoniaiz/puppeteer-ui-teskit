import {
  getAllTestkitsStep,
  getUnusedSnapshotsStep,
  handleAxeTestsResultsStep,
  handleNotMatchingScreenshotsStep,
  handleOutputStep,
  prepareTestsStep,
} from './steps/index.js';
import { runScreenshotsWorkers } from './steps/screenshotsWorker/runScreenshotsWorkers.js';

export const run = async (): Promise<void> => {
  const testkits = await getAllTestkitsStep();
  const {
    failedAxeTestsCount,
    axeTestsResults,
    screenshots,
    failedScreenshotsCount,
  } = await prepareTestsStep(testkits);

  const { axeTestsResultsWithErrorsCount, axeTestsResultsCount } =
    handleAxeTestsResultsStep(axeTestsResults, failedAxeTestsCount);

  const unusedSnapshots = await getUnusedSnapshotsStep(screenshots);

  const {
    failedScreenshotsCount: failedScreenshotsCountWorker,
    notMatchedScreenshots,
  } = await runScreenshotsWorkers(screenshots);

  const { notMatchedScreenshotsCount } = await handleNotMatchingScreenshotsStep(
    notMatchedScreenshots,
  );

  const totalFailedScreenshots =
    failedScreenshotsCount + failedScreenshotsCountWorker;

  handleOutputStep({
    axeTestsResultsWithErrorsCount,
    notMatchedScreenshotsCount,
    totalAxeTests: axeTestsResultsCount,
    totalFailedScreenshots,
    totalScreenshots: screenshots.length,
    unusedSnapshots,
  });
};
