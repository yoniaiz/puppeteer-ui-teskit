import { CliOptions, program } from '../utils/createProgram';

const defaultOptions: CliOptions = {
  folder: '.',
  file: '',
  baseURL: '',
  statics: '',
  threshold: 0.01,
  headless: true,
  port: 3000,
};

export const mockProgramOptions = (options: Partial<CliOptions>) => {
  program.options = {
    ...defaultOptions,
    ...options,
  };
};

export const resetProgramOptions = () => {
  program.options = defaultOptions;
};
