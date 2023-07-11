import { TestkitConfigFile } from './Testkit.types';

export interface ResolvedTestkitFile
  extends Omit<TestkitConfigFile, 'skip' | 'url'> {
  path: string;
}
