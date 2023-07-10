import tsc from 'typescript';
import { getTempFolder } from './getTempFolder';

export const compileTsSnapFiles = (filesPaths: string[]) => {
  const program = tsc.createProgram({
    rootNames: filesPaths,
    options: {
      module: tsc.ModuleKind.ESNext,
      outDir: getTempFolder(),
    },
  });

  program.emit();
};
