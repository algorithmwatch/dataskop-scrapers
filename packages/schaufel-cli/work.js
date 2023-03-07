/* eslint-disable @typescript-eslint/no-var-requires */
/*
$ npm run work
*/

require("dotenv").config();

const process = require("process");
const schaufel = require("@algorithmwatch/schaufel-worker");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let cont = true;
let waiting = false;

process.on("SIGTERM", function () {
  console.log("*** GOT SIGTERM ***");
  if (waiting) {
    process.exit(0);
  } else {
    cont = false;
  }
});

process.on("SIGINT", function () {
  console.log("*** GOT SIGINT ***");
  if (waiting) {
    process.exit(0);
  } else {
    cont = false;
  }
});

(async () => {
  while (true) {
    await schaufel.startJob();
    if (!cont) {
      console.log("About to exit `work`");
      process.exit(0);
    }

    // Don't spam the server and wait some seconds
    console.log("Waiting");
    waiting = true;
    await delay(30000);
    waiting = false;
  }
})();
