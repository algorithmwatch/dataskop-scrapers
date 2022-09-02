# schaufel

TikTok utilities for Dataskop

## Dev setup

We are storing HTML test files with [git lfs](https://git-lfs.github.com/).
Please set it up.

```
npm i
```

## Release a new Version

Choose a new version according to <https://semver.org/>.

```bash
npm version major
npm version minor
npm version patch
npm version prerelease
```

Push tags to GitHub.
GitHub then publishes the package as a GitHub Package.

```bash
git push --follow-tags
```

## Deploy scraper

```bash
# `deploy.sh`
#!/usr/bin/env bash

rsync -avz --exclude node_modules --exclude .git --exclude docker/volume --exclude docker/gluetun-volume . awlab1:~/code/schaufel
ssh awlab1 "cd code/schaufel && NPM_GITHUB_AUTH=the_token docker-compose up --detach --build"
```

## License

MIT
