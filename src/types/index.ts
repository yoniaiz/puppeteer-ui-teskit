import type { Page } from 'puppeteer';

export interface BrowserDriver {
  $: Page['$'];
  $$: Page['$$'];
  $eval: Page['$eval'];
  $$eval: Page['$$eval'];
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

type TestLifeCycleFunction = (page: BrowserDriver) => Promise<void>;

type TestBase = {
  description: string;
  beforeTest?: TestLifeCycleFunction;
  afterTest?: TestLifeCycleFunction;
  resetAfterTest?: boolean;
};

export type AxeTest = {
  type: 'axe';
  url?: string;
  selector: string;
  config?: {
    disableRules?: string[];
    exclude?: string[];
  };
} & TestBase;

export type VisualTest = {
  type: 'visual';
  url?: string;
  config?: {
    threshold?: number;
    screenWidth?: number;
    screenHeight?: number;
    x?: number;
    y?: number;
  };
} & TestBase;

export interface TestkitConfigFile {
  url?: string;
  name: string;
  skip?: boolean;
  tests: (AxeTest | VisualTest)[];
}

export interface ResolvedTestkitFile
  extends Omit<TestkitConfigFile, 'skip' | 'url'> {
  path: string;
}

export type Screenshot = {
  name: string;
  description: string;
  snapshotBuffer: Buffer;
  saveTo: string;
  threshold?: number;
};

export type AxeNode = {
  failureSummary: string;
  html: string;
  target: string[];
};

export type AxeViolation = {
  description: string;
  help: string;
  helpUrl: string;
  id: string;
  impact?: unknown;
  tags: unknown[];
  nodes: AxeNode[];
};

export type AxeTestResult = {
  name: string;
  description: string;
  path: string;
  url: string;
  violations: AxeViolation[];
};

export type FailedSnapshot = {
  filePath: string;
  snapName: string;
  diffImageBuffer: Buffer;
  oldSnapImageBuffer: Buffer;
  newSnapImageBuffer: Buffer;
  description?: string;
};

export interface ScreenshotSaveResult {
  status: 'failed' | 'passed' | 'notMatched';
  message?: string;
  data?: FailedSnapshot;
}
