import inquirer from 'inquirer';
import {
  isValidGitHubUser,
  isValidUserGitHubToken,
} from './userInputValidator.js';

const inQuirerOptions = async (targetUser?: string, gitHubToken?: string) => {
  console.log(targetUser, gitHubToken, process.cwd());
  // if (targetUser) questions = questions.filter(item => item.name !== "gitHubUsername")
  // if (gitHubToken) questions = questions.filter(item => item.name !== "token")
  // if (questions.length) {
  const questions = [
    {
      type: 'input',
      name: 'targetUser',
      message: "GitHub User that you'll be using as a source of repos to star",
      prefix: '💫 »',
      validate: (input: string) => isValidGitHubUser(input),
      default: 'BrycensRanch',
      when: !targetUser,
    },
    {
      type: 'password',
      name: 'gitHubToken',
      message:
        'GITHUB_TOKEN (Personal Access Token) can be generated here https://github.com/settings/tokens',
      prefix: '🔐 »',
      validate: (input: string) => isValidUserGitHubToken(input),
      when: !gitHubToken,
    },
  ];
  const answers = await inquirer.prompt(questions);
  // Hacky? Maybe. Is it the worst thing I've done with this repo? No.
  if (targetUser)
    Object.assign(answers, {
      targetUser,
    });
  if (gitHubToken)
    Object.assign(answers, {
      gitHubToken,
    });
  return answers;
  // }
  // else {
  //   return "Function will be passed onto someone else"
  // }
};

const commanderOrder = (options: { [x: string]: unknown }) => {
  return Object.keys(options).map(
    (key, index) => `\n${index + 1}:${key} => ${options[key]}`
  );
};

export { commanderOrder, inQuirerOptions };
