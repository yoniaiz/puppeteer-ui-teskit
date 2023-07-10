export const closeBrowser = jest.fn();
export const publicDriver = jest.fn();
export const takeScreenshot = jest.fn(() => {
  return Buffer.from('');
});
export const navigateToPage = jest.fn();
export const lunchBrowser = jest.fn();
export const runAxe = jest.fn(() => ({
  violations: [],
}));

export const BrowserLuncher = jest.fn().mockImplementation(() => {
  return {
    closeBrowser,
    publicDriver,
    takeScreenshot,
    navigateToPage,
    lunchBrowser,
    runAxe,
  };
});
