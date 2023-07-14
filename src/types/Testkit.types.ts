import type { Page } from 'puppeteer';

export interface BrowserDriver {
  /** Selects a single element. */
  $: Page['$'];
  /** Selects multiple elements. */
  $$: Page['$$'];
  $eval: Page['$eval'];
  $$eval: Page['$$eval'];
  /** clicks on the element. */
  click: Page['click'];
  evaluate: Page['evaluate'];
  evaluateHandle: Page['evaluateHandle'];
  focus: Page['focus'];
  hover: Page['hover'];
  select: Page['select'];
  setCookie: Page['setCookie'];
  setExtraHTTPHeaders: Page['setExtraHTTPHeaders'];
  setJavaScriptEnabled: Page['setJavaScriptEnabled'];
  tap: Page['tap'];
  waitForFunction: Page['waitForFunction'];
  waitForNavigation: Page['waitForNavigation'];
  waitForRequest: Page['waitForRequest'];
  waitForResponse: Page['waitForResponse'];
  waitForSelector: Page['waitForSelector'];
  setCacheEnabled: Page['setCacheEnabled'];
  setGeolocation: Page['setGeolocation'];
  setUserAgent: Page['setUserAgent'];
  touchscreen: Page['touchscreen'];
}

/** The callback function that receives puppeteer page object. */
type TestLifeCycleFunction = (page: BrowserDriver) => Promise<void>;

type TestBase = {
  /** The description of the test. */
  description: string;
  /** Callback function that receives puppeteer page object. and runs before the test. */
  beforeTest?: TestLifeCycleFunction;
  /** Callback function that receives puppeteer page object. and runs after the test. */
  afterTest?: TestLifeCycleFunction;
  /** Whether to reset the page after the test. */
  resetAfterTest?: boolean;
};

/** Axe test configuration */
export type AxeTest = {
  /** The type of test. axe */
  type: 'axe';
  /** The URL of the page to test. */
  url?: string;
  /** The selector of the element to run axe-core on. */
  selector: string;
  /** configuration of the axe-core */
  config?: {
    /** The rules to disable. */
    disableRules?: string[];
    /** The elements to exclude. */
    exclude?: string[];
  };
} & TestBase;

/** Visual regression test configuration */
export type VisualTest = {
  /** The type of test. visual */
  type: 'visual';
  /** The URL of the page to test. */
  url?: string;
  /** configuration of the screenshot  */
  config?: {
    /** threshold of screenshot comparison */
    threshold?: number;
    /** The width of the screenshot. */
    screenWidth?: number;
    /** The height of the screenshot. */
    screenHeight?: number;
    /** The x coordinate of the screenshot. */
    x?: number;
    /** The y coordinate of the screenshot. */
    y?: number;
  };
} & TestBase;

export interface TestkitConfigFile {
  /** The URL of the page to test. */
  url?: string;
  /** The name of the test. */
  name: string;
  /** Whether to skip the test. */
  skip?: boolean;
  /** The tests to run. */
  tests: (AxeTest | VisualTest)[];
}
