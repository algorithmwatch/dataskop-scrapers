/**
 * Check if provided string is a valid url
 * Sourced from: https://stackoverflow.com/a/3809435/5732518
 * @param url the URL string
 */
const urlPattern = /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;

export function isValidUrl(url: string): boolean {
  url = url.trim();
  return urlPattern.test(url);
}

/*
https://stackoverflow.com/a/49434653/4028896
*/
function randomBM(min, max, skew = 0.25) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randomBM(min, max, skew);
  // resample between 0 and 1 if out of range
  else {
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return num;
}

export function randomNormalNumber(N: number): number {
  return randomBM(Math.round(N * 0.9), Math.round(N * 1.1));
}
