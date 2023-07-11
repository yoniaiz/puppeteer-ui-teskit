export type Screenshot = {
  name: string;
  description: string;
  snapshotBuffer: Buffer;
  saveTo: string;
  threshold?: number;
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
