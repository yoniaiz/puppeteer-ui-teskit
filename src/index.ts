import { getAllTestkitsStep, prepareTestsStep } from './steps/index.js';

export const run = async (): Promise<void> => {
  const testkits = await getAllTestkitsStep();
  await prepareTestsStep(testkits);
};
