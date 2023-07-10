import { getAllTestkits } from './steps/getAllTestkits/getAllTestkits.js';

export const run = async (): Promise<void> => {
  await getAllTestkits();
};
