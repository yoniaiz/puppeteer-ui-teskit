import prompts from 'prompts';

export type FailedSnapshotAction = 'update' | 'open' | 'skip';

export const promptHandleImage = async (snapName: string) => {
  const choices: { title: string; value: FailedSnapshotAction }[] = [
    { title: 'Update snapshot', value: 'update' },
    { title: 'Open diff image', value: 'open' },
    { title: 'Skip', value: 'skip' },
  ];

  const { action } = await prompts.prompt({
    type: 'select',
    name: 'action',
    message: `Snapshot ${snapName} failed, what do you want to do?`,
    choices,
    initial: 0,
  });

  return action as FailedSnapshotAction;
};
