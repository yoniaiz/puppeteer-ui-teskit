import { BrowserLuncher } from '../BrowserLuncher.js';

describe('BrowserLuncher', () => {
  let browserLuncher: BrowserLuncher;
  beforeEach(() => {
    browserLuncher = new BrowserLuncher();
  });

  it('should no be ready by default', () => {
    expect(browserLuncher.ready).toBe(false);
  });

  it('should be ready after lunching browser', async () => {
    await browserLuncher.lunchBrowser();
    expect(browserLuncher.ready).toBe(true);
  });

  it('should close browser', async () => {
    await browserLuncher.lunchBrowser();
    await browserLuncher.closeBrowser();
    expect(browserLuncher.ready).toBe(false);
  });

  it('should navigate to page', async () => {
    await browserLuncher.lunchBrowser();
    await browserLuncher.navigateToPage('https://google.com');
    expect(browserLuncher.currentUrl).toBe('https://google.com');
  });

  it('should take screenshot', async () => {
    await browserLuncher.lunchBrowser();
    await browserLuncher.navigateToPage('https://google.com');
    const buffer = await browserLuncher.takeScreenshot();
    expect(buffer).toEqual(Buffer.alloc(0));
  });

  it('should throw error if page is not defined on navigateToPage', async () => {
    await browserLuncher.lunchBrowser();
    await browserLuncher.closeBrowser();
    try {
      await browserLuncher.navigateToPage('https://google.com');
    } catch (e) {
      expect(e.message).toBe('Page is not defined, please lunch browser first');
    }
  });

  it('should throw error if page is not defined on takeScreenshot', async () => {
    await browserLuncher.lunchBrowser();
    await browserLuncher.closeBrowser();
    try {
      await browserLuncher.takeScreenshot();
    } catch (e) {
      expect(e.message).toBe('Page is not defined, please lunch browser first');
    }
  });

  it('should return driver', async () => {
    await browserLuncher.lunchBrowser();
    const driver = browserLuncher.publicDriver();
    expect(driver).toBeDefined();
  });
});
