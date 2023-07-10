import type { VisualTest, AxeTest, ResolvedTestkitFile } from '../../types';
import { logger } from '../../utils/logger.js';
import { BrowserLuncher } from './BrowserLuncher/BrowserLuncher.js';

export const wrapTestWithLifecycle = async <T extends VisualTest | AxeTest, R>({
  cb,
  snapTest,
  browserInstance,
  snapFile,
}: {
  cb: () => Promise<R>;
  snapTest: T;
  browserInstance: BrowserLuncher;
  snapFile: ResolvedTestkitFile;
}) => {
  const errorMessage = (e, testType: string) => `
  Failed to run ${testType} function for ${snapTest.url}\n
  name: ${snapFile.name}\n
  description: ${snapTest.description}\n
  path: ${snapFile.path}\n
  ${e}
`;
  if (snapTest.beforeTest) {
    try {
      await snapTest.beforeTest(browserInstance.publicDriver());
    } catch (e) {
      logger.error(errorMessage(e, 'beforeTest'));
      return { failed: true, data: null };
    }
  }

  const data = await cb();

  if (snapTest.afterTest) {
    try {
      await snapTest.afterTest(browserInstance.publicDriver());
    } catch (e) {
      logger.error(errorMessage(e, 'afterTest'));
      return { failed: true, data: null };
    }
  }

  return { failed: false, data };
};
