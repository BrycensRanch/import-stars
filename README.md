# 🔮🌋GitHub Star Import💫🚀

> *"Truly the best repo ever made" - BrycensRanch*

Switched your GitHub account? Well, this CLI powered by Node.js has got you covered. Import starred repos from a another user's account using GitHub's extensive API and a PAT (Personal Access Token) (Classic, needs `repo` and `user` scopes)

## Usage

```bash
# Root command
Usage: import-stars [options] [command]

Import another GitHub user's stars

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  star [options]  Import or rather merge a GitHub user's stars to your own account
  help [command]  display help for command

# Star a user's repos
Usage: import-stars star [options]

Import or rather merge a GitHub user's stars to your own account

Options:
  -c, --computer            Computer friendly output
  -b, --bypass              Bypass Validation
  -d, --dryrun              Dry run, doesn't actually star repos, just fetches them and outputs it
  -t, --target <user>       Target GitHub user that be the 'source' of list of projects to star
  -g, --ghToken <token>     GITHUB_TOKEN (PAT) Passing this option is insecure because it can be seen on your shell history. Use with caution.
  -w, --wait-time <number>  How long in milliseconds to wait between requests to GitHub. Added to prevent API Abuse (default: 1 second)
  -h, --help                display help for command
```

## 🏗️ Coming Soon? 🚧

- Import lists as well by default
- Filtering GitHub repos that you want to star by date.
- Manual starring? (You manually select which repos you want to star)
- Unit Tests / E2E testing maybe? Idk.
- Unstarring in general
- Unstar repos another user has starred

## Versioning

We use SemVer along with [Semantic Release](https://github.com/semantic-release/semantic-release)

## Types

The types on this project are horrid. But hey, it works. Definitely a mistake to try and use TypeScript for this project. If you have any better TypeScript projects I could use to create a CLI, please [leave an issue](https://github.com/BrycensRanch/import-stars).

## Alternatives

There are some other alternatives now when I look up GitHub star transfer, but they don't run as fast as us with minimum code! Such as:

- <https://www.npmjs.com/package/github-star-transfer>

## Building this project

```bash
pnpm install
pnpm build
node dist/bin/index.js --help
```

## Contributing

Although this is a small project, I wanted to make sure the project still follows standards set by other developers, hence I am not trying to reinvent the wheel with this project. Hence why Husky and ESLint and Prettier is included in this repo.

Tools such as [Commitizen](https://github.com/commitizen/cz-cli) or [Commitlint](https://github.com/conventional-changelog/commitlint) are used to help contributors and enforce valid commits/ messages.
