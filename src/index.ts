import {
  getAllTestkitsStep,
  handleAxeTestsResultsStep,
  prepareTestsStep,
} from './steps/index.js';

export const run = async (): Promise<void> => {
  const testkits = await getAllTestkitsStep();
  const { failedAxeTestsCount, axeTestsResults } = await prepareTestsStep(
    testkits,
  );

  const { axeTestsResultsWithErrorsCount } = handleAxeTestsResultsStep(
    axeTestsResults,
    failedAxeTestsCount,
  );

  console.log({ axeTestsResultsWithErrorsCount });
};
