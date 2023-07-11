import type {
  AxeTest,
  AxeTestResult,
  ResolvedTestkitFile,
  Screenshot,
  VisualTest,
} from '../../types';
import { BrowserLuncher } from './BrowserLuncher/BrowserLuncher.js';
import { StaticsServer } from './StaticsServer/StaticsServer.js';
import { program } from '../../utils/createProgram.js';
import { handleVisualTest } from './handleVisualTest.js';
import { handleAxeTest } from './handleAxeTest.js';
import { logger } from '../../utils/logger.js';
import { logs } from './constants.js';

export async function prepareTests(testkits: ResolvedTestkitFile[]): Promise<{
  screenshots: Screenshot[];
  failedScreenshotsCount: number;
  failedAxeTestsCount: number;
  axeTestsResults: AxeTestResult[];
}> {
  if (!testkits.length) {
    return {
      screenshots: [],
      failedScreenshotsCount: 0,
      axeTestsResults: [],
      failedAxeTestsCount: 0,
    };
  }

  logger.start(logs.startPreparingTests(testkits.length));

  const browser = new BrowserLuncher();
  const server = new StaticsServer(
    program.options.port,
    program.options.statics,
  );

  const screenshots: Screenshot[] = [];
  const axeTestsResults: AxeTestResult[] = [];
  let failedScreenshotsCount = 0;
  let failedAxeTestsCount = 0;

  try {
    await server.serve();
    await browser.lunchBrowser();

    const teskitTests = {
      visual: async (
        testkit: ResolvedTestkitFile,
        testkitTest: AxeTest | VisualTest,
      ) => {
        const { screenshot, failed } = await handleVisualTest(
          browser,
          testkit,
          testkitTest as VisualTest,
        );
        if (failed) {
          failedScreenshotsCount++;
        } else {
          screenshots.push(screenshot);
        }
      },
      axe: async (
        testkit: ResolvedTestkitFile,
        testkitTest: AxeTest | VisualTest,
      ) => {
        const { axeTestResult, failed } = await handleAxeTest(
          browser,
          testkit,
          testkitTest as AxeTest,
        );
        if (failed) {
          failedAxeTestsCount++;
        } else {
          axeTestsResults.push(axeTestResult);
        }
      },
    } as const;

    for (const testkit of testkits) {
      let prevURL = '';
      let shouldReset = false;

      for (const testkitTest of testkit.tests) {
        if (shouldReset || prevURL !== testkitTest.url) {
          prevURL = testkitTest.url;
          shouldReset = testkitTest.resetAfterTest || false;

          await browser.navigateToPage(testkitTest.url);
        }

        await teskitTests[testkitTest.type](testkit, testkitTest);
      }
    }
  } finally {
    await browser.closeBrowser();
    await server.close();
  }
  return {
    screenshots,
    failedScreenshotsCount,
    axeTestsResults,
    failedAxeTestsCount,
  };
}
