#!/usr/bin/env node
import meow from 'meow';
import getHtmlFromUrl from './methods/getHtmlFromUrl';

const cliHelpText = `
  Usage
    $ raw <YouTube-URL>
`;
const cli = meow(cliHelpText, {
  flags: {
    // outdir: {
    //   type: 'string',
    //   alias: 'o',
    //   default: './'
    // },
  },
});

if (cli.input[0] === 'raw' && cli.input.length === 2) {
  (async () => {
    const html = await getHtmlFromUrl(cli.input[1]);
    console.log(html);
  })();
}
