import { CliOptions, program } from '../utils/createProgram';

const defaultOptions: CliOptions = {
  folder: process.cwd(),
  file: '',
  baseURL: '',
  statics: '',
  threshold: 0.01,
  headless: true,
  port: 3000,
};

export const mockProgramOptions = (
  options: Partial<CliOptions>,
  isCI = false,
) => {
  program.options = {
    ...defaultOptions,
    ...options,
  };

  program.isCI = isCI;
};

export const resetProgramOptions = () => {
  program.options = defaultOptions;
  program.isCI = false;
};
