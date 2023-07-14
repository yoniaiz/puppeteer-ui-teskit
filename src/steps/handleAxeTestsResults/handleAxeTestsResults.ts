import type { AxeTestResult } from '../../types';
import { logger } from '../../utils/logger.js';
import { buildAxeErrorMessage } from './buildAxeErrorMessage.js';
import { logs } from './constants.js';

export const handleAxeTestsResults = (
  axeTestsResults: AxeTestResult[] = [],
  failedAxeTestsCount = 0,
) => {
  logger.start(logs.startHandlingAxeTestsResults);

  if (axeTestsResults.length === 0) {
    return {
      axeTestsResultsWithErrorsCount: failedAxeTestsCount,
      axeTestsResultsCount: 0,
    };
  }

  const axeTestsResultsWithErrors = axeTestsResults.filter(
    (axeTestResult) => axeTestResult.violations.length > 0,
  );

  if (axeTestsResultsWithErrors.length === 0 && !failedAxeTestsCount) {
    return {
      axeTestsResultsWithErrorsCount: 0,
      axeTestsResultsCount: axeTestsResults.length,
    };
  }

  const axeTestsResultsWithErrorsCount =
    axeTestsResultsWithErrors.length + failedAxeTestsCount;
  const axeTestsResultsCount = axeTestsResults.length;

  for (const axeTestResult of axeTestsResultsWithErrors) {
    axeTestResult.violations.forEach((violation) =>
      violation.nodes.map((node) =>
        logger.error(buildAxeErrorMessage(axeTestResult, violation, node)),
      ),
    );
  }

  return {
    axeTestsResultsWithErrorsCount,
    axeTestsResultsCount,
  };
};
