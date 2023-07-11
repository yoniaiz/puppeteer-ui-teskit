import type { AxeNode, AxeTestResult, AxeViolation } from '../../types';
import { logger } from '../../utils/logger.js';
import { logs } from './constants';

const buildAxeErrorMessage = (
  axeTestResult: AxeTestResult,
  violation: AxeViolation,
  node: AxeNode,
) => {
  const selector = node.target.join(', ');
  return `
    Expected the HTML found at $('${selector}') in ${axeTestResult.url} at ${axeTestResult.name} - ${axeTestResult.description} to have no violations:\n
    ${node.html}\n
    Received:\n
    ${violation.help} (${violation.id})\n
    Failure summary:\n
    ${node.failureSummary}
    You can find more information on this issue here: \n
    ${violation.helpUrl}
    `;
};

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
