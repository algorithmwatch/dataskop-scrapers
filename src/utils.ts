import fs from 'fs';
import https from 'https';

/**
 * Get HTML from URL
 */
const getHtml = (url: string): Promise<string> => {
  const urlObj = new URL(url);
  return new Promise((resolve, reject) => {
    https
      .get(
        {
          hostname: urlObj.hostname,
          path: urlObj.pathname,
          headers: {
            'USER-AGENT':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Vivaldi/4.3',
          },
        },
        (res) => {
          res.setEncoding('utf8');
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => resolve(body));
        },
      )
      .on('error', reject);
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

export { getHtml, delay, writeJSON, readJSON };
