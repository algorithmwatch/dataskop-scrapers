/* eslint-disable @typescript-eslint/no-var-requires */
/*
$ npm run work
*/

require('dotenv').config();

const process = require('process');
const schaufel = require('@algorithmwatch/schaufel');

const args = process.argv.slice(2);

console.log(args[0]);

(async () => {
  await schaufel.startJob();
})();
