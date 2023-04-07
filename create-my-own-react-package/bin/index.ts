#!/usr/bin/env node

import { createWorkspace, CreateWorkspaceOptions } from 'create-nx-workspace';
import * as enquirer from 'enquirer';
import * as yargs from 'yargs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Options extends CreateWorkspaceOptions {}

export const commandsObject: yargs.Argv<Options> = yargs
  .wrap(yargs.terminalWidth())
  .parserConfiguration({
    'strip-dashed': true,
    'dot-notation': true,
  })
  .command(
    // this is the default and only command
    '$0 [name] [options]',
    'Create a new my-own-react workspace',
    (yargs) =>
      yargs
        .options('preset', {
          describe: 'Preset to use',
          type: 'string',
        })
        .option('name', {
          describe: 'What is the name of your workspace?',
          type: 'string',
        })
        .option('packageManager', {
          alias: 'pm',
          describe: 'Package manager to use',
          choices: ['npm', 'yarn', 'pnpm'],
          defaultDescription: 'npm',
          type: 'string',
        })
        .option('nxCloud', {
          describe: 'Enable distributed caching to make your CI faster?',
          type: 'boolean',
        }),
    async (argv: yargs.ArgumentsCamelCase<Options>) => {
      await main(argv).catch((error) => {
        throw error;
      });
    },
    [normalizeArgsMiddleware]
  ) as yargs.Argv<Options>;

async function normalizeArgsMiddleware(argv: yargs.Arguments<Options>) {
  if (!argv.name) {
    const results = await enquirer.prompt<{ name: string }>({
      type: 'input',
      name: 'name',
      message: 'What is the name of your workspace?',
    });
    argv.name = results.name;
  }
  if (!argv.packageManager) {
    const results = await enquirer.prompt<{ packageManager: string }>({
      name: 'packageManager',
      message: 'Which package manager to use',
      initial: 'npm' as any,
      type: 'autocomplete',
      choices: [
        { name: 'npm', message: 'NPM' },
        { name: 'yarn', message: 'Yarn' },
        { name: 'pnpm', message: 'PNPM' },
      ],
    });
    argv.packageManager = results.packageManager as any;
  }
  if (argv.nxCloud === undefined) {
    const results = await enquirer.prompt<{ nxCloud: 'Yes' | 'No' }>({
      name: 'NxCloud',
      message: 'Enable distributed caching to make your CI faster?',
      type: 'autocomplete',
      choices: [
        {
          name: 'Yes',
          hint: 'I want faster builds',
        },

        {
          name: 'No',
        },
      ],
      initial: 'Yes' as any,
    });
    argv.nxCloud = results.nxCloud === 'Yes';
  }
}

async function main(args: Options) {
  await createWorkspace(
    'my-own-react@file:/Users/emilyxiong/Code/tmp/my-own-react/dist',
    args
  );

  console.log(`Successfully created the workspace: ${args.name}.`);
}

commandsObject.argv;
