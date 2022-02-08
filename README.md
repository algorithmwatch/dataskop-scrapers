# `gartenpflege`

Headless scraper using Puppeteer

- for YouTube: based on our YouTube parser [harke](https://github.com/algorithmwatch/harke)
- for TikTok: based on our TikTok parser [schaufel](https://github.com/algorithmwatch/schaufel)

It's mainly used for testing the parsers as well as monitoring some playlists on a server (without API).

## Installation

```bash
git clone https://github.com/algorithmwatch/gartenpflege.git
cd gartenpflege
npm install
```

## Usage: TikTok

### Login

```
npm run cli --  --tiktok --login --credentials "xx@xx.xx:xx"
```

email:password

### Scrape

```
npm run cli --  --tiktok --feed --scroll 30
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
