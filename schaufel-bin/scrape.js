/*
$ npm run scrape ~/Downloads/data/000.json 1000 10
*/

const fs = require('fs');
const process = require('process');
const schaufel = require('@algorithmwatch/schaufel');

const args = process.argv.slice(2);

console.log(args[0]);
const result = schaufel.getTiktokVideosFromDumpDev(
  args[0],
  parseInt(args[1]),
  parseInt(args[2]),
);
