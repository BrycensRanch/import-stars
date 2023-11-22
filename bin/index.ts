#!/usr/bin/env node
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import * as fs from 'fs';
import { InvalidArgumentError, Option, program } from 'commander';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';

import importUserStars, { CommandFlags } from '../lib/importService.js';
import * as inQuirerService from '../lib/inQuirerService.js';
import {
  isValidGitHubUser,
  isValidUserGitHubToken,
} from '../lib/userInputValidator.js';
import {
  isAllowed,
  spinnerError,
  stopSpinner,
  spinnerSuccess,
  updateSpinnerText,
} from '../lib/spinner.js';

interface OptionsFromCLI {
  targetUser?: string;
  gitHubToken?: string;
}

async function main() {
  const loadJSON = (path: string | URL) =>
    // @ts-ignore
    JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

  const pkg = loadJSON('../package.json');

  const { name, version, description } = pkg;

  program.name(name).description(description).version(version);
  program
    .command('star') // sub command
    .description(
      "Import or rather merge a GitHub user's stars to your own account"
    )
    .option('-c, --computer', 'Computer friendly output') // Redact our figlet and chalk header for computers
    .option('-b, --bypass', 'Bypass Validation')
    .option(
      '-d, --dryrun',
      "Dry run, doesn't actually star repos, just fetches them and outputs it"
    )
    .addOption(
      new Option(
        '-t, --target <user>',
        "Target GitHub user that be the 'source' of list of projects to star"
      )
    )
    .addOption(
      new Option(
        '-g, --ghToken <token>',
        'GITHUB_TOKEN (PAT) Passing this option is insecure because it can be seen on your shell history. Use with caution.'
      ).argParser((value) => {
        if (!(await isValidUserGitHubToken(value)))
          throw new InvalidArgumentError(
            'GitHub Token provided in flags is not valid.'
          );
        return value;
      })
    )
    // .addOption(
    //   new Option(
    //     '-m, --manual',
    //     "Manually select what repos you'd like to star from the user"
    //   )
    // )
    // .addOption(
    //   new Option(
    //     '--after <timestamp>',
    //     'Only show/select repoos that were starred after this timestamp'
    //   ).argParser((date) => {
    //     if (!Number.isNaN(new Date(date).getDate())) return new Date(date);
    //     throw new InvalidArgumentError('After timestamp is not a Date');
    //   })
    // )
    // .addOption(
    //   new Option(
    //     '--before <timestamp>',
    //     'Only show/select repos that are before this timestamp'
    //   )
    //     .conflicts(['during', 'after'])
    //     .argParser((date) => {
    //       if (!Number.isNaN(new Date(date).getDate())) return new Date(date);
    //       throw new InvalidArgumentError('Before timestamp is not a Date');
    //     })
    // )
    // // During array of dates?
    // .addOption(
    //   new Option(
    //     '--during <timestamp>',
    //     'Only show/select repos that were starred during this timeperiod.'
    //   ).argParser((date) => {
    //     if (!Number.isNaN(new Date(date).getDate())) return new Date(date);
    //     throw new InvalidArgumentError('During timestamp is not a Date');
    //   })
    // )
    .addOption(
      new Option(
        '-w, --wait-time <number>',
        'How long in milliseconds to wait between requests to GitHub. Added to prevent API Abuse'
      )
        .default(1000, '1 second')
        .makeOptionMandatory()
        .argParser((value) => {
          const parsedValue = parseInt(value, 10);
          if (Number.isNaN(parsedValue))
            throw new InvalidArgumentError('Wait time is not a number.');
          return parsedValue;
        })
    )
    // @ts-ignore
    // eslint-disable-next-line consistent-return
    .action(async (flags: CommandFlags) => {
      // const flags: CommandFlags = args[0]
      // Tells the spinner to not do anything when computer friendly output is requested
      // Although the functions are still called, they are all surrounded by if statements and wont pass thanks to this function being first and setting state
      // IMPORTANT: ENSURE THIS FUNCTION RUNS BEFORE ANY OTHER SPINNER FUNCTIONS OR BAD THINGS HAPPEN!!!
      isAllowed(flags.computer);
      // // console.log(...order.commanderOrder(args));
      let options: OptionsFromCLI = {
        targetUser: flags.target,
        gitHubToken: flags.ghToken,
      };
      if (!flags.computer)
        options = await inQuirerService.inQuirerOptions(
          options.targetUser,
          options.gitHubToken
        );
      try {
        //   // I promise I will get results! I will be the Wizard King!!
        // @ts-ignore
        console.log(
          await importUserStars(
            options.targetUser as string,
            options.gitHubToken as string,
            flags,
            program
          )
        );
      } catch (e) {
        if (flags.computer) {
          return program.error(`Failure`);
        }
        spinnerError();
        // @ts-ignore
        return program.error(e.message);
      }
    });
  // program
  //   .command('unstar')
  //   .description(
  //     'Remove stars from YOUR GitHub account that another user has starred'
  //   )
  //   .action(async (args) => {
  //     updateSpinnerText('Processing ');
  //     // do work
  //     await new Promise((resolve) => setTimeout(resolve, 1000)); // emulate work
  //     spinnerSuccess();
  //     // console.log(...(await inQuirerService.inQuirerOder(args)));
  //   });

  // console.log(process.argv);
  await program.parseAsync();
}
// console.log(); This was supposed to look nice but likely messes up computers globally
main();
