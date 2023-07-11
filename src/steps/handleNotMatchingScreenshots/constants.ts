export const logs = {
  startHandlingNotMatchingSnapshots: (notMatchedSnapshotsCount: number) =>
    `Found ${notMatchedSnapshotsCount} not matched snapshots`,
  skipSnapshot: (snapName: string) => `Skipping snapshot ${snapName}`,
  updateSnapshot: (snapName: string) => `Updating snapshot ${snapName}`,
};
