# harke-parser

Parser for harke, a headless YouTube-Scraper

## Dev setup

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

## Test files

- Video page: https://www.youtube.com/watch?v=SACB-u41x0M > video_page_no_auth.html
- Playlist page: https://www.youtube.com/playlist?list=PLdVY0007sCPWPKA3WBkqJZEcIAiMAvx58 > playlist.html
- Subscribed channels: https://www.youtube.com/feed/channels > subscribed_channels_auth.html

## License

MIT
