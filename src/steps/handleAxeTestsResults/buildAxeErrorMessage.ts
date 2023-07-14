import { AxeNode, AxeTestResult, AxeViolation } from '../../types';

export const buildAxeErrorMessage = (
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
