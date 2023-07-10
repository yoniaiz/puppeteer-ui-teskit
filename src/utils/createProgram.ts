import { Command } from 'commander';
import ci from 'ci-info';

export interface CliOptions {
  update?: boolean;
  remove?: boolean;
  headless?: boolean;
  port?: number;
  statics: string;
  folder?: string;
  file?: string;
  baseURL?: string;
  threshold?: number;
}

const createProgram = (): {
  options: CliOptions;
  isCI: boolean;
} => {
  const program = new Command();

  program
    .option('-u, --update', 'update snapshots')
    .option('-r, --remove', 'remove unused snapshots')
    .option('--headless <boolean>', 'run in browser', true)
    .option(
      '-p, --port <number>',
      'port to run server on',
      (val) => parseInt(val, 10),
      3000,
    )
    .requiredOption('--statics <string>', 'path to static files to serve')
    .option('--folder <string>', 'folder contains ui-testkit config files', '.')
    .option('--file <string>', 'file regex to run')
    .option('--baseURL <string>', 'base url to run against')
    .option(
      '--threshold <number>',
      'threshold to pass test',
      (val) => parseInt(val, 10),
      0.01,
    )
    .parse(process.argv);

  const options = program.opts() as CliOptions;

  return {
    options: {
      update: options.update || false,
      remove: options.remove || false,
      headless: options.headless || true,
      port: options.port || 3000,
      statics: options.statics,
      folder: options.folder || '.',
      file: options.file,
      baseURL: options.baseURL,
      threshold: options.threshold || 0.01,
    },
    isCI: ci.isCI,
  };
};

export const program = createProgram();
