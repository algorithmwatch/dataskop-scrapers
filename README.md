# `dataskop-scrapers`

Scrapers, parsers, data wrangling and utilities for TikTok and YouTube.

## Dev setup

We store large files with [git lfs](https://git-lfs.github.com/).
We manage our monorepo with [turborepo](https://turbo.build/repo).
We publish new releases with [changeset](https://github.com/changesets/changesets)

## Release a new version

## TikTok scraper: schaufel

TikTok utilities for DataSkop

### Deployment of the TikTok scraper

We have a specific setup to run the scraper on the server.

### Requirements

- a [Mullvad](https://mullvad.net/) subscriptions (you need to change the code if you choose another VPN provider)
- a 'Logs Data Platform' instance in Gravelines (GRA) on [OVH](https://ovh.com)
- `NPM_GITHUB_AUTH` token to read private packages on GitHub

#### Create the dot env file `docker/.env`

```bash
# schaufel / DataSkop
PLATFORM_URL=https://dataskop-platform-url.net
SERIOUS_PROTECTION=basic-auth-pw
API_KEY=drf-api-key

# gluetun
VPN_SERVICE_PROVIDER=mullvad
VPN_TYPE=wireguard
WIREGUARD_PRIVATE_KEY=private-key
WIREGUARD_ADDRESSES=ip-address
SERVER_CITIES=a-city
DOT=off

# Send Logs to OVH
_X-OVH-TOKEN=ovh-logs-data-stream-token
```

#### Deploy script

```bash
# `deploy.sh`
#!/usr/bin/env bash

rsync -avz --exclude node_modules --exclude .git --exclude docker/volume --exclude docker/gluetun-volume  --exclude test . sshlocation:~/code/schaufel
ssh awlab1 "cd code/schaufel && NPM_GITHUB_AUTH=the_token docker-compose up --detach --build"
```

### Commands

#### Merge test lookups (playwright) to dev lookups

```bash
cd packages/schaufel-cli
npm run merge-lookups ~/Library/Application\ Support/Electron/databases/lookup.json ~/Library/Application\ Support/dataskop-electron/databases/lookup.json
```

#### Scrape TikTok videos

Conntect to any Mullvad server and then do the following:

```bash
cd packages/schaufel-cli
npm run scrape-meta https://www.tiktok.com/@newmartina/video/7232019489674562842 https://www.tiktok.com/@victordemartrin/video/7228575676335443226
```

## License

MIT
