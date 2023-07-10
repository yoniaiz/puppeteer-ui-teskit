export const logs = {
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
