# schaufel

TikTok utilities for DataSkop

## Dev setup

We store some artefacts with [git lfs](https://git-lfs.github.com/).
Please set it up.
Also familiarize yourself with [turborepo](https://turbo.build/repo).

## Release a new version

Choose a new version according to <https://semver.org/>.

First:

```bash
npm run version:minor
npm run version:patch
```

Second:

```bash
npm run push-version
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
