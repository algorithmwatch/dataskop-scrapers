import { delay, writeJSON } from '@algorithmwatch/utils';
import _ from 'lodash';
import { get } from './get';

const scrapeItems = async (
  videoUrls: string[],
  cache: any,
  options: any,
  constants: any,
  logFun = console.log,
  fetchFun = undefined,
  fetchMaxTries = undefined,
  parseFun = undefined,
  fixUrlFun = (x) => x,
): Promise<any> => {
  if (options.verbose) {
    logFun(`Starting to fetch ${videoUrls.length} videos.`);
    logFun(options);
  }

  // Use defaul location or use a provided path
  let storeBrokenHtml = null;
  if (options.storeBrokenHtml === true)
    storeBrokenHtml = constants.BROKEN_HTML_LOCATION;
  else if (typeof options.storeBrokenHtml === 'string')
    storeBrokenHtml = options.storeBrokenHtml;

  logFun(`broken html folder: ${storeBrokenHtml}`);

  const results = [];
  const newCache = {};

  for (const url of videoUrls) {
    try {
      if (url in cache) {
        if (options.verbose) {
          logFun('Cache hit');
        }

        results.push(cache[url]);
        continue;
      }

      if (url in newCache) {
        if (options.verbose) {
          logFun('New cache hit');
        }

        results.push(newCache[url]);
        continue;
      }
      if (options.verbose) {
        logFun(`Fetching ${url}`);
      }
      let parseTry = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          const html = await get(
            fixUrlFun(url),
            logFun,
            fetchFun,
            fetchMaxTries,
          );
          if (options.verbose) {
            logFun(`Fetching done`);
          }

          const metaData = parseFun(html, storeBrokenHtml, logFun);
          const result = {
            result: metaData,
            scrapedAt: Date.now(),
            error: null,
          };
          results.push(result);
          newCache[url] = result;

          if (options.verbose) {
            logFun('Parsing finished successfully');
          }

          if (options.saveCache) {
            writeJSON(constants.CACHE_LOCATION, _.merge(cache, newCache));
          }

          if (options.delay > 0) await delay(options.delay);
          break;
        } catch (err) {
          // Don't retry fetching errors (e.g. 403/404). Only retry specifing parsing errors.
          if (
            (err.message == 'Parsing error' || err.message == 'Needs JS') &&
            parseTry < 3
          ) {
            parseTry += 1;
            if (options.verbose) {
              logFun('Retrying parsing:', err.message);
            }
            await delay(
              1000 + (err.message == 'Needs JS' ? 1000 : 500) * parseTry,
            );
            continue;
          } else throw err;
        }
      }
    } catch (error) {
      results.push({
        result: null,
        scrapedAt: Date.now(),
        error: error.message,
      });

      if (options.verbose) {
        logFun(`Failed to scrape with: ${error.message}`);
      }
    }
  }
  return [results, _.merge(cache, newCache)];
};

export { scrapeItems };
