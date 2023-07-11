import puppeteer, { Browser, Page, ScreenshotOptions } from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';
import { program } from '../../../utils/createProgram.js';
import { logger } from '../../../utils/logger.js';
import type { AxeTest, VisualTest, BrowserDriver } from '../../../types';
import { logs } from './constants.js';

export class BrowserLuncher {
  private browser: Browser | undefined;
  private page: Page | undefined;
  public currentUrl: string | undefined;

  constructor() {
    this.browser = undefined;
    this.page = undefined;
  }

  private validatePage() {
    if (!this.page) {
      throw new Error('Page is not defined, please lunch browser first');
    }
  }

  get ready() {
    return this.browser !== undefined;
  }

  async lunchBrowser() {
    if (this.browser === undefined) {
      this.browser = await puppeteer.launch({
        headless: program.options.headless ? 'new' : false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
        ],
      });
    }
    const page = await this.browser.newPage();

    this.page = page;
    logger.info(logs.lunchingBrowser);
  }

  async navigateToPage(url: string) {
    this.validatePage();
    try {
      await this.page.goto(url);

      this.currentUrl = url;
    } catch (e) {
      throw new Error(`Failed to navigate to page: ${url}`);
    }
  }

  async closeBrowser() {
    if (this.browser !== undefined) {
      await this.browser.close();
    }

    this.browser = undefined;
    this.page = undefined;
    this.currentUrl = undefined;

    logger.info(logs.closingBrowser);
  }

  async takeScreenshot({
    screenHeight,
    screenWidth,
    x,
    y,
  }: VisualTest['config'] = {}) {
    if (!this.page) {
      return;
    }

    if (screenHeight && screenWidth) {
      await this.page.setViewport({
        width: screenWidth,
        height: screenHeight,
      });
    }

    const options: ScreenshotOptions =
      x && y
        ? {
            clip: {
              x,
              y,
              width: screenWidth || 1080,
              height: screenHeight || 1024,
            },
          }
        : {
            fullPage: true,
          };

    const imageBuffer = await this.page.screenshot(options);

    return imageBuffer as Buffer;
  }

  publicDriver = (): BrowserDriver => {
    this.validatePage();

    return this.page as BrowserDriver;
  };

  runAxe = async (
    axeTestSelector: AxeTest['selector'],
    axeTestConfig: AxeTest['config'],
  ) => {
    if (!this.page) {
      throw new Error('Page is not defined, please lunch browser first');
    }

    const axe = new AxePuppeteer(this.page)
      .include(axeTestSelector)
      .disableRules(['landmark-one-main', 'region']);

    if (axeTestConfig) {
      if (axeTestConfig.disableRules) {
        axe.disableRules(axeTestConfig.disableRules);
      }

      if (axeTestConfig.exclude) {
        axeTestConfig.exclude.forEach((exclude) => {
          axe.exclude(exclude);
        });
      }
    }

    return axe.analyze();
  };
}
