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

## License

MIT
