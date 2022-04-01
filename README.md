# `gartenpflege`

Headless scraper using [Puppeteer](https://github.com/puppeteer/puppeteer) and TypeScript parsers to extract information from some big platforms.

- for YouTube, we use our parser [harke](https://github.com/algorithmwatch/harke)
- for TikTok, we use our parser [schaufel](https://github.com/algorithmwatch/schaufel)

It's mainly used for testing the parsers as well as monitoring, e.g. YouTube News playlists (on a server without using YouTube's API).
We use `gartenpflege` to save HTML to write tests for our parsers.
So we use `gartenpflege` to help writing parsers.
But we also use our parsers (when they are working) to extract data with `gartenpflege`.
Our parsers only take a HTML string as input.
Thus, we need to get the HTML from somewhere.

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

## Usage: YouTube

The YouTube part is legacy and should be improved (if anybody is working on YouTube again).

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
PUPPETEER_PRODUCT=firefox npm i puppeteer
```

Unfortunatly, using it with Firefox was buggy. (But Google was not blocking the login)

## License

MIT
