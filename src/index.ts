import {
  getAllTestkitsStep,
  getUnusedSnapshotsStep,
  handleAxeTestsResultsStep,
  prepareTestsStep,
} from './steps/index.js';
import { runScreenshotsWorkers } from './steps/screenshotsWorker/runScreenshotsWorkers.js';

export const run = async (): Promise<void> => {
  const testkits = await getAllTestkitsStep();
  const { failedAxeTestsCount, axeTestsResults, screenshots } =
    await prepareTestsStep(testkits);

  const { axeTestsResultsWithErrorsCount } = handleAxeTestsResultsStep(
    axeTestsResults,
    failedAxeTestsCount,
  );

  const unusedSnapshots = await getUnusedSnapshotsStep(screenshots);

  const { failedScreenshotsCount, notMatchedScreenshots } =
    await runScreenshotsWorkers(screenshots);

  console.log('unusedSnapshots', unusedSnapshots);
  console.log('axeTestsResultsWithErrorsCount', axeTestsResultsWithErrorsCount);
  console.log('failedScreenshotsCount', failedScreenshotsCount);
  console.log('notMatchedScreenshots', notMatchedScreenshots);
};
