#!/usr/bin/env node
import meow from 'meow';
import runTiktok from './tiktok/commands';
import runYoutube from './youtube/commands';

const cliHelpText = `
  Usage
    $ npm run cli -- --youtube -l
    $ npm run cli -- --youtube -a
`;

const cli = meow(cliHelpText, {
  flags: {
    youtube: { type: 'boolean' },
    tiktok: { type: 'boolean' },
    headless: { type: 'boolean', default: false },
    login: { type: 'boolean', alias: 'l' },
    credentials: { type: 'string' },
    playlist: { type: 'boolean', alias: 'p' },
    likedVideos: { type: 'boolean', alias: 'i' },
    video: {
      type: 'string',
      alias: 'v',
    },
    searchVideos: {
      type: 'string',
      alias: 's',
    },
    watchHistory: {
      type: 'boolean',
      alias: 'w',
    },
    searchHistory: {
      type: 'boolean',
      alias: 'h',
    },
    subscribedChannels: {
      type: 'boolean',
      alias: 'c',
    },
    all: {
      type: 'boolean',
      alias: 'a',
    },
    outputLocation: {
      type: 'string',
      alias: 'o',
      default: 'html',
    },
    monitor: {
      type: 'boolean',
      alias: 'm',
    },
    feed: {
      type: 'boolean',
    },
    scroll: {
      type: 'number',
      default: 30,
    },
    dbLocation: {
      type: 'string',
      default: 'data/db.json',
    },
  },
});

(async function () {
  if (!cli.flags.tiktok && !cli.flags.youtube) {
    console.error(
      'Please explicity specify the platform using --tiktok or --youtube',
    );
  }

  console.log('storing htmls files in: ' + cli.flags.outputLocation);
  console.log('storing monitor data in: ' + cli.flags.dbLocation);

  if (cli.flags.youtube) {
    runYoutube(cli);
  }

  if (cli.flags.tiktok) {
    runTiktok(cli);
  }
})();
