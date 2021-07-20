# harke

Parse YouTube's HTML with TypeScript.

## Dev setup

We are storing HTML test files with [git lfs](https://git-lfs.github.com/).
Please set it up.

1. Run `yarn` to install dependencies
2. Run `yarn dev` for development mode

Based on https://khalilstemmler.com/blogs/typescript/node-starter-project/

## Release a new Version

Choose a new version according to <https://semver.org/>.

```bash
yarn version --major
yarn version --minor
yarn version --patch
yarn version --prerelease
```

Push tags to GitHub.
GitHub then publishes the package as a GitHub Package.

```bash
git push --follow-tags
```

## Test files

- Video page: https://www.youtube.com/watch?v=SACB-u41x0M > video_page_no_auth.html
- Playlist page: https://www.youtube.com/playlist?list=PLdVY0007sCPWPKA3WBkqJZEcIAiMAvx58 > `playlist-page-2021-04-16.html`

## License

MIT
