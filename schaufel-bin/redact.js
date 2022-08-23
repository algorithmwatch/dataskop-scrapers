/*
$ npm run redact ~/Downloads/data/000.json
*/

const fs = require('fs');
const process = require('process');
const schaufel = require('@algorithmwatch/schaufel');

for (const p of process.argv.slice(2)) {
  console.log(p);
  let rawdata = fs.readFileSync(p);
  let inputData = JSON.parse(rawdata);
  const result = schaufel.redactTiktokDump(inputData);
  fs.writeFileSync(
    p.replace('.json', '_redacted.json'),
    JSON.stringify(result),
  );
}
