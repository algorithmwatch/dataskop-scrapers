#!/usr/bin/env node
import meow from 'meow';
import { getHtml } from './get-html';

const cliHelpText = `
  Usage
    $ harke <YouTube-URL> -o outputdir
`;

const cli = meow(cliHelpText, {
  flags: {
    playlist: { type: 'boolean', alias: 'p' },
    video: {
      type: 'boolean',
      alias: 'vi',
    },
  },
});

const get = () => {
  const html = await getHtml(cli.input[1]);
};

// import fs from 'fs';
// import meow from 'meow';
// import puppeteer from 'puppeteer';

// const cli = meow(
//   `
// 	Usage
// 	  $ fetch
// 	Options
//     --all, -a Fetch all options
// 	  --playlists, -p Fetch playlists
// 	Examples
// 	  $ fetch -a
// `,
//   {
//     flags: {
//       all: { type: 'boolean', alias: 'a' },
//       playlists: {
//         type: 'boolean',
//         alias: 'p',
//       },
//     },
//   }
// );

// let page = null;

// const setupBrowser = async () => {
//   if (page !== null) return page;
//   const browser = await puppeteer.launch({
//     headless: false,
//   });
//   const newPage = await browser.newPage();
//   return newPage;
// };

// const scrapePlaylists = async () => {
//   // play list of special lists
//   const LIST_ID_POPULAR = 'PLrEnWoR732-BHrPp_Pm8_VleD68f9s14-';
//   const LIST_ID_NATIONAL_NEWS_TOP_STORIES =
//     'PLNjtpXOAJhQJYbpJxMnoLKCUPanyEfv_j';
//   const LIST_ID_TEST = 'PLAo4aa6NKcpjx0SVA3JzZHw2wJ3hQ4vmO';

//   page = await setupBrowser();

//   await page.goto(`https://www.youtube.com/playlist?list=${LIST_ID_POPULAR}`, {
//     waitUntil: 'networkidle0',
//   });
//   const html1 = await page.content();
//   fs.writeFileSync('test/html/playlist_popular.html', html1);

//   await page.goto(
//     `https://www.youtube.com/playlist?list=${LIST_ID_NATIONAL_NEWS_TOP_STORIES}`,
//     {
//       waitUntil: 'networkidle0',
//     }
//   );
//   const html2 = await page.content();
//   fs.writeFileSync('test/html/playlist_top_news.html', html2);

//   await page.goto(`https://www.youtube.com/playlist?list=${LIST_ID_TEST}`, {
//     waitUntil: 'networkidle0',
//   });
//   const html3 = await page.content();
//   fs.writeFileSync('test/html/playlist_test.html', html3);
// };

// if (cli.flags.all || cli.flags.playlists) {
//   scrapePlaylists();
// }
