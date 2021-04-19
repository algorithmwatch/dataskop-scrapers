# harke

## Dev setup

1. Run `yarn` to install dependencies
2. Run `yarn dev:main` for development mode

## Usage

### Login

```
yarn run cli -l
```

### Watch History

```
yarn run cli -w
```

## Using harke-parser

```bash
cd harke-parser
yarn build
cd ../harke
yarn add ../harke-parser
```

## Log in to Google (complicated)

The default Chromium version was not working.
(Even with setting custom user agents).

Also using my local Chrome instance was not working.

```js
  executablePath:
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  userDataDir:
    '/Users/user/Library/Application Support/Google/Chrome/Default',
  ignoreDefaultArgs: true,
```

Using puppeteer with Firefox.
To setup:

```bash
yarn remove puppeteer
PUPPETEER_PRODUCT=firefox yarn add puppeteer
```
