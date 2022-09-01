/* eslint-disable @typescript-eslint/no-var-requires */
/*
$ npm run dump-scrape ~/Downloads/data/000.json 1000 10
*/

const process = require("process");
const schaufel = require("@algorithmwatch/schaufel-core");

const args = process.argv.slice(2);

console.log(args[0]);
const result = schaufel.enrichTiktokDump(
  args[0],
  parseInt(args[1]),
  parseInt(args[2])
);
