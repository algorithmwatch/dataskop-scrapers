# harke-puppeteer

## Dev setup

1. Run `yarn` to install dependencies
2. Run `yarn dev:main` for development mode

## Usage

### Login

```
yarn run cli -l
```

### all

```
yarn run cli -a
```

### Watch History

```
yarn run cli -w
```

### Search History

```
yarn run cli -h
```

### Get HTML from Video

```
yarn run cli -v https://www.youtube.com/watch?v=IWlGDbMEtxM
```

### Search results

```
yarn run cli -s antifa
```

## Using harke

```bash
cd harke
yarn build
cd ../harke-puppeteer
yarn add ../harke
```

## Log in to Google (complicated)

We have to use some obfuscation to make the Google login work.
We are using: <https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth>

### Firefox

Alternativly, we could use puppeteer with Firefox.
To setup, specify this in `.launch`:

```
  product: 'firefox',
```

```bash
yarn remove puppeteer
PUPPETEER_PRODUCT=firefox yarn add puppeteer
```

Unfortunatly, using it with Firefox was buggy. (But Google was not blocking the login)

## Monitoring

- install npm, yarn
- install all missing deps for puppeeter
- `./deploy.sh`
- then:

```bash
cd ../harke-puppeteer
yarn add ../harke
```

`deploy.sh`

```bash
#!/usr/bin/env bash
set -e
set -x

rsync --recursive --verbose --exclude .git --exclude node_modules --exclude html --exclude data --exclude user_data . server:~/code/harke-puppeteer
rsync --recursive --verbose ../harke/build server:~/code/harke
rsync --recursive --verbose ../harke/*.json server:~/code/harke
```

`run.sh`

```bash
#!/bin/bash
set -e
set -x

sleep $((RANDOM % 120))
date=$(date '+%Y-%m-%d')
db_location="/root/yt-playlists-data/db${date}.json"
echo $date
cd /root/code/harke-puppeteer
yarn run cli -m --dbLocation $db_location
```

## License

MIT
