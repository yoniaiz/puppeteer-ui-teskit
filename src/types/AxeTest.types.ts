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
