export const logs = {
  startPreparingTests: (testkitsLength: number) =>
    `Preparing tests for ${testkitsLength} testkits`,
  takingScreenshot: (
    name: string,
    description: string,
    urlToNavigate: string,
  ): string => `Taking screenshot: ${name} - ${description} - ${urlToNavigate}`,
  runningAxe: (
    name: string,
    description: string,
    urlToNavigate: string,
  ): string => `Running axe-core: ${name} - ${description} - ${urlToNavigate}`,
};
