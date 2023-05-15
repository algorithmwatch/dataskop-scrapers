/* eslint-disable @typescript-eslint/no-var-requires */
/*
$ npm run scrape-meta https://www.tiktok.com/@newmartina/video/7232019489674562842 https://www.tiktok.com/@victordemartrin/video/7228575676335443226
*/

const process = require("process");
const schaufel = require("@algorithmwatch/schaufel-worker");

const args = process.argv.slice(2);

const run = async (args) => {
  console.log(args);
  const result = await schaufel.getTiktokVideoMetaProxy(args);

  console.log(result);
};
run(args);
