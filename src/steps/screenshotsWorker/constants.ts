export const logs = {
  startScreenshotsWorkers: (screenshotsCount: number) =>
    `Comparing ${screenshotsCount} screenshots`,
  finishedScreenshotsWorkers: 'Finished comparing screenshots',
  cantSaveScreenshotInCI: (screenshotPath: string) =>
    `Can't save screenshot in CI: ${screenshotPath}`,
};
