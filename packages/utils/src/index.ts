import fs from 'fs';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const writeJSON = (path, data) => fs.writeFileSync(path, JSON.stringify(data));

const readJSON = (path) => {
  if (!fs.existsSync(path)) {
    writeJSON(path, {});
    return {};
  }
  return JSON.parse(String(fs.readFileSync(path)));
};

const b64encode = (str: string): string => Buffer.from(str).toString('base64');

const toBase64 = (rawData) => {
  return Buffer.from(rawData, 'binary').toString('base64');
};

const normalizeObject = (object: any): any => {
  if (Array.isArray(object))
    return object
      .sort()
      .map((obj) => (typeof obj === 'object' ? normalizeObject(obj) : obj));

  const sortedObj = {};

  if (object == null) return object;

  const keys = Object.keys(object).sort();

  for (const index in keys) {
    const key = keys[index];
    if (typeof object[key] === 'object') {
      sortedObj[key] = normalizeObject(object[key]);
    } else {
      sortedObj[key] = object[key];
    }
  }

  return sortedObj;
};

export { delay, writeJSON, readJSON, b64encode, toBase64, normalizeObject };
