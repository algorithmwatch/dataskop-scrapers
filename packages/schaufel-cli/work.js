/* eslint-disable @typescript-eslint/no-var-requires */
/*
$ npm run work
*/

require("dotenv").config();

const process = require("process");
const schaufel = require("@algorithmwatch/schaufel-core");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let cont = true;

process.on("SIGTERM", function () {
  console.log("*** GOT SIGTERM ***");
  cont = false;
  // process.exit(0);
});

process.on("SIGINT", function () {
  console.log("*** GOT SIGINT ***");
  cont = false;
  // process.exit(0);
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
    await delay(30000);
  }
})();
