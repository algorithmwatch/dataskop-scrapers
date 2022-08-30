import fs from 'fs';
import https from 'https';

/**
 * Simplify requests with node
 *
 * Don't use it for scraping because TT blocks http1, we need http2.
 */
const request = (
  url: string,
  method = 'get',
  headers: any,
  data = null,
): Promise<[string | JSON, number]> => {
  const urlObj = new URL(url);

  if (data !== null) {
    data = JSON.stringify(data);

    headers = {
      ...headers,
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    };
  }

  return new Promise((resolve, reject) => {
    const req = https
      .request(
        {
          method,
          hostname: urlObj.hostname,
          path: urlObj.pathname,
          headers,
          timeout: 60 * 1000,
        },
        (res) => {
          res.setEncoding('utf8');
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () =>
            resolve([
              res.headers['content-type'] == 'application/json'
                ? JSON.parse(body)
                : body,
              res.statusCode,
            ]),
          );
        },
      )
      .on('error', (e) => {
        console.error(e);
        reject(e);
      });

    req.on('timeout', () => {
      console.log('timeout');
      req.destroy();
      reject();
    });

    if (data !== null) req.write(data);
    req.end();
  });
};

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

export { request, delay, writeJSON, readJSON, b64encode };
