import { messages } from '../../constants/messages.js';
import { TestkitConfigFile, ResolvedTestkitFile, AxeTest } from '../../types';
import { program } from '../../utils/createProgram.js';
import { logger } from '../../utils/logger.js';
import { urlUtils } from '../../utils/url.utils.js';
import { logs } from './constants.js';

function notValidTestkit(
  testkit: TestkitConfigFile,
  filePath: string,
  baseURL?: string,
) {
  const inMainURL = !!testkit.url;

  if (!testkit) {
    logger.error(logs.testkitFileIsEmpty(filePath));
    return true;
  }

  if (
    inMainURL &&
    !urlUtils.isValidUrl(baseURL ? `${baseURL}/${testkit.url}` : testkit.url)
  ) {
    logger.error(logs.testkitFileInvalidURL(filePath, testkit.url));
    return true;
  }

  if (!testkit.name) {
    logger.error(logs.testkitFileMissingName(filePath));
  }

  const { tests } = testkit;

  if (!tests || !tests.length) {
    logger.error(messages.error.testkitFileMissingTests(filePath));
    return true;
  }

  const axeTests = tests.filter((test) => test.type === 'axe') as AxeTest[];

  for (const _test of tests) {
    if (!_test.description) {
      logger.error(
        messages.error.testkitTestMissingDescription(filePath, _test.type),
      );
      return true;
    }

    if (!inMainURL && !_test.url) {
      logger.error(
        messages.error.testkitTestMissingURL(
          filePath,
          _test.type,
          _test.description,
        ),
      );
      return true;
    }

    if (
      _test.url &&
      !urlUtils.isValidUrl(baseURL ? `${baseURL}/${_test.url}` : _test.url)
    ) {
      logger.error(
        messages.error.testkitTestInvalidURL(
          filePath,
          _test.type,
          _test.description,
          _test.url,
        ),
      );
      return true;
    }
  }

  for (const axeTest of axeTests) {
    if (!axeTest.selector) {
      logger.error(
        messages.error.testkitAxeTestMissingSelector(
          filePath,
          axeTest.description,
        ),
      );
      return true;
    }
  }

  return false;
}

export async function resolveTestkitFile(
  testkit: TestkitConfigFile,
  filePath: string,
) {
  if (testkit?.skip) {
    logger.info(messages.info.testkitFileSkipped(filePath));
    return null;
  }

  if (notValidTestkit(testkit, filePath)) {
    return null;
  }

  const { url, name, tests } = testkit;

  const testkitURL = url
    ? urlUtils.isAbsoluteURL(url)
      ? url
      : `${program.options.baseURL}/${url}`
    : '';

  const testsWithUrl = tests.map((test) => {
    if (test.url) {
      return {
        ...test,
        url: urlUtils.isAbsoluteURL(test.url)
          ? test.url
          : `${program.options.baseURL}/${test.url}`,
      };
    }
    return {
      ...test,
      url: testkitURL,
    };
  });

  const resolvedSnapFile: ResolvedTestkitFile = {
    name,
    path: filePath,
    tests: testsWithUrl,
  };

  return resolvedSnapFile;
}
