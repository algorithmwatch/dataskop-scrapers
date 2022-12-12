/* eslint-disable @typescript-eslint/no-var-requires */
/*
$ npm run dump-redact ~/Downloads/data/000.json
*/

const process = require("process");
const schaufel = require("@algorithmwatch/schaufel-core");

const [source, target] = process.argv.slice(2);

const s = schaufel.readJSON(source);
const t = schaufel.readJSON(target);

console.log(
  `Merging ${source}: ${Object.keys(s).length} objects and ${target}: ${
    Object.keys(t).length
  }`
);

const merged = { ...s, ...t };

Object.keys(merged).forEach((key) => {
  if (key.startsWith("tv")) merged[key] = schaufel.pruneResult(merged[key]);
});

console.log(`Result: ${Object.keys(merged).length} objects`);

schaufel.writeJSON(target, merged);
