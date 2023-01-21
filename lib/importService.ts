/* eslint-disable consistent-return */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import * as fs from 'fs';
import figlet from 'figlet';
import chalk from 'chalk';
import got, { OptionsOfTextResponseBody, Response } from 'got';
import { Command } from 'commander';
// import {
//   format,
//   formatDistance,
//   formatRelative,
//   subDays,
//   compareAsc,
// } from 'date-fns';
import {
  isAllowed,
  spinnerSuccess,
  updateSpinnerText,
} from '../lib/spinner.js';
import * as helpers from './utils.js';
import { GitHubRes } from '../lib/types.js';

export interface CommandFlags {
  bypass?: boolean;
  computer?: boolean;
  dryrun?: boolean;
  waitTime: number;
  target?: string;
  ghToken?: string;
  manual?: boolean;
  before?: Date;
  after?: Date;
  during?: Date;
}
const loadJSON = (path: string | URL) =>
  // @ts-ignore
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const importUserStars = async (
  targetUser: string,
  gitHubToken: string,
  flags: CommandFlags,
  _program: Command
) => {
  const pkg = loadJSON('../package.json');

  const { version } = pkg;
  const staticConsoleLog = console.log;
  const staticConsoleTable = console.table;
  if (flags.computer) {
    console.log = () => ``;
    console.table = () => ``;
  }
  console.log(chalk.redBright(figlet.textSync('GitHub Star Importer 3000')));
  console.log(
    chalk.greenBright(
      'Created by BrycensRanch, created to "import" GitHub Stars from other user accounts'
    )
  );
  console.log(chalk.blueBright(`Version ${version}`));
  updateSpinnerText('Processing');
  const gotStars = got.extend({
    hooks: {
      beforeRequest: [
        (options) => {
          console.log(`Requesting ${options.method} ${options.url}`);
        },
      ],
      afterResponse: [
        (response, retryWithMergedOptions) => {
          console.log(
            `Finished request to ${response.method} ${response.request.requestUrl} got status code ${response.statusCode}`
          );
          return response;
        },
      ],
      beforeRetry: [
        (error) => {
          console.log(`[INFO] ${error.message}, retrying request`);
        },
      ],
    },
  });

  // Querying a large dataset significantly increases memory usage.
  // Put at 1000 to prevent GitHub's API from abuse
  let counter = 0;
  const results: GitHubRes.RootObject[] = await gotStars.paginate.all(
    `https://api.github.com/users/${targetUser}/starred?per_page=100`,
    {
      pagination: {
        backoff: flags.waitTime,
        requestLimit: 100,
        transform: (res: Response) => {
          let obj = {};
          if (res.request.options.responseType === 'json') {
            // @ts-ignore
            obj = res.body;
          }
          obj = JSON.parse(res.body as string);
          return helpers.default.camelizeNestedKeys(obj);
        },
        filter: (data) => {
          const { item, currentItems, allItems } = data;
          console.log(currentItems.length, allItems.length);
          counter++;
          // @ts-ignore
          updateSpinnerText(`On item ${counter}`);
          return true;
        },
      },

      // Backoff = Milliseconds to wait before the next request is triggered.
      // I'm trying my hardest to not get users banned from GitHub lmfao
      // Bad internet fix?
      retry: {
        limit: 2,
        methods: ['GET'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504, 521, 522, 524],
        errorCodes: [
          'ETIMEDOUT',
          'ECONNRESET',
          'EADDRINUSE',
          'ECONNREFUSED',
          'EPIPE',
          'ENOTFOUND',
          'ENETUNREACH',
          'EAI_AGAIN',
        ],
      },
      headers: {
        Authorization: `Bearer ${gitHubToken}`,
        Accept: `application/vnd.github.v3.star+json`, // Weird GitHub thing that adds the starred_at atribute to a repo's object
      },
    }
  );
  let authenticatedUser;
  const gitHubAuthenticatedUserResponse = await gotStars.get(
    'https://api.github.com/user',
    {
      throwHttpErrors: false,
      headers: {
        Authorization: `Bearer ${gitHubToken}`,
      },
    }
  );

  switch (gitHubAuthenticatedUserResponse.statusCode) {
    case 304:
    case 200:
      const hotBod = JSON.parse(
        gitHubAuthenticatedUserResponse.body
      ) as GitHubRes.AuthenticatedUser;
      console.log(hotBod);
      authenticatedUser = hotBod.login;
      break;
    case 403:
      throw new Error(
        `PAT does not have user scopes, got 403 from GitHub API when requesting user information`
      );
    default:
      throw new Error(
        `Unknown status code, got ${gitHubAuthenticatedUserResponse.statusCode} and a response body of ${gitHubAuthenticatedUserResponse.body}`
      );
    // code block
  }
  // Querying a large dataset significantly increases memory usage.
  // Put at 1000 to prevent GitHub's API from abuse
  let authenticatedCounter = 0;
  const authenticatedUserStarredRepos: GitHubRes.RootObject[] =
    await gotStars.paginate.all(
      `https://api.github.com/users/${authenticatedUser}/starred?per_page=100`,
      {
        pagination: {
          backoff: flags.waitTime,
          requestLimit: 100,
          transform: (res: Response) => {
            let obj = {};
            if (res.request.options.responseType === 'json') {
              // @ts-ignore
              obj = res.body;
            }
            obj = JSON.parse(res.body as string);
            return helpers.default.camelizeNestedKeys(obj);
          },
          filter: (data) => {
            const { item, currentItems, allItems } = data;
            console.log(currentItems.length, allItems.length);
            authenticatedCounter++;
            // @ts-ignore
            updateSpinnerText(`On item ${authenticatedCounter}`);
            return true;
          },
        },

        // Backoff = Milliseconds to wait before the next request is triggered.
        // I'm trying my hardest to not get users banned from GitHub lmfao
        // Bad internet fix?
        retry: {
          limit: 2,
          methods: ['GET'],
          statusCodes: [408, 413, 429, 500, 502, 503, 504, 521, 522, 524],
          errorCodes: [
            'ETIMEDOUT',
            'ECONNRESET',
            'EADDRINUSE',
            'ECONNREFUSED',
            'EPIPE',
            'ENOTFOUND',
            'ENETUNREACH',
            'EAI_AGAIN',
          ],
        },
        headers: {
          Authorization: `Bearer ${gitHubToken}`,
          Accept: `application/vnd.github.v3.star+json`, // Weird GitHub thing that adds the starred_at atribute to a repo's object
        },
      }
    );
  // TODO: Abstract this function to another file.
  // @ts-ignore
  const reposAboutToBeStarred = results
    .filter((repo) => {
      const realRepoStarDate = new Date(repo.starredAt);
      if (flags.during) {
        if (realRepoStarDate.toDateString() === flags.during.toDateString())
          return true;
        return false;
      }
      if (flags.after) {
        if (!helpers.default.compareTime(flags.after, realRepoStarDate))
          return true;
        return false;
      }
      if (flags.before) {
        if (helpers.default.compareTime(flags.before, realRepoStarDate))
          return true;
        return false;
      }
      if (authenticatedUserStarredRepos.includes(repo)) {
        console.log(
          `[INFO] Repo ${repo.repo.fullName} (${repo.repo.url}) already starred?`
        );
      }
      return true;
    })
    .map((repo) => repo.repo.fullName);

  if (flags.dryrun === false || flags.dryrun === undefined) {
    const ps = [];
    for (let i = 0; i < reposAboutToBeStarred.length; i++) {
      const request: OptionsOfTextResponseBody = {
        url: `https://api.github.com/user/starred/${reposAboutToBeStarred[i]}`,
        method: 'PUT',
        retry: {
          backoffLimit: 2,
          limit: 2,
          methods: ['PUT'],
          statusCodes: [408, 413, 429, 500, 502, 503, 504, 521, 522, 524],
          errorCodes: [
            'ETIMEDOUT',
            'ECONNRESET',
            'EADDRINUSE',
            'ECONNREFUSED',
            'EPIPE',
            'ENOTFOUND',
            'ENETUNREACH',
            'EAI_AGAIN',
          ],
        },
        headers: {
          Authorization: `Bearer ${gitHubToken}`,
        },
        timeout: {
          request: 10000,
        },
        throwHttpErrors: false,
      };
      ps.push(gotStars(request));
      // eslint-disable-next-line no-await-in-loop
      await sleep(100);
    }
    // After loop
    // We don't even need to check what GitHub did. it just works!
    await Promise.all(ps);
  } else {
    spinnerSuccess();
    console.log(chalk.redBright('Dry Run Mode Active - Outputting Data'));
    const reposWithDateStarred = results
      // eslint-disable-next-line array-callback-return
      .filter((repo) => {
        const realRepoStarDate = new Date(repo.starredAt);

        if (flags.during) {
          if (realRepoStarDate.toDateString() === flags.during.toDateString())
            return true;
          return false;
        }
        if (flags.after) {
          if (!helpers.default.compareTime(realRepoStarDate, flags.after))
            return true;
          return false;
        }
        if (flags.before) {
          if (helpers.default.compareTime(flags.before, realRepoStarDate))
            return true;
          return false;
        }
      })
      .map((repo) => {
        return {
          fullName: repo.repo.fullName,
          starredAt: repo.starredAt,
        };
      });
    console.table(reposWithDateStarred);
  }
  if (flags.dryrun) {
    console.log = staticConsoleLog;
    console.table = staticConsoleTable;
  }
  const message = !flags.computer ? `Starred ${counter} repos` : `Success`;
  spinnerSuccess(message);
  return message;
  // const answers = await inquirer.prompt(questions);
  // return Object.keys(answers).map(
  //   (key, index) => `\n${index + 1}:${key} => ${answers[key]}`
  // );
};

export default importUserStars;
