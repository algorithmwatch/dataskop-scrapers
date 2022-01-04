# harke-puppeteer

Headless scraper for YouTube using Puppeteer based on our YouTube parser [harke](https://github.com/algorithmwatch/harke).
It's mainly used for testing the parsers as well as monitoring some playlists on a server (without API).

## Installation

```bash
git clone https://github.com/algorithmwatch/harke.git
cd harke
yarn install
yarn build
cd ..
git clone https://github.com/algorithmwatch/harke-puppeteer.git
cd harke-puppeteer
yarn install
yarn add ../harke
```

## Usage

### Login

```
yarn run cli -l
```

### Rnn all parsers to check if they are working

```
yarn run cli -a
```

### Watch history

```
yarn run cli -w
```

### Search history

```
yarn run cli -h
```

### Single video

```
yarn run cli -v https://www.youtube.com/watch?v=IWlGDbMEtxM
```

### Search results

```
yarn run cli -s antifa
```

### Monitoring

To monitor YouTube's news playlists.

- install npm, yarn, and all missing deps for puppeeter on your server
- `./deploy.sh` (see script below)
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

Crontab:

```bash
*/7 * * * * /root/run.sh
```

## Documentation

### Log in to Google (complicated)

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

## License

MIT
