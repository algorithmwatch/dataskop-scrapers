/* eslint-disable @typescript-eslint/no-var-requires */
/*
$ npm run dump-add-video ~/Downloads/data/000.json
*/

require('dotenv').config();

const process = require('process');
const schaufel = require('@algorithmwatch/schaufel');
const fs = require('fs');

const args = process.argv.slice(2);

console.log(args[0]);
let rawdata = fs.readFileSync(args[0]);
let inputData = JSON.parse(rawdata);
const result = schaufel.addVideoDumpJob(inputData);
