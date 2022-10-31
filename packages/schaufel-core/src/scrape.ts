/* eslint-disable no-console */
import { getIdFromUrl } from '@algorithmwatch/schaufel-wrangle/src/index';
import _ from 'lodash';
import os from 'os';
import path from 'path';
import { get } from './mullvad';
import { parseTikTokVideo } from './parse';
import { delay, readJSON, writeJSON } from './utils';

let SCHAUFEL_DIR = os.homedir();

if (process.env.SCHAUFEL_DIR) SCHAUFEL_DIR = process.env.SCHAUFEL_DIR;

const CACHE_LOCATION = path.join(SCHAUFEL_DIR, 'schaufel-cache.json');
const BROKEN_HTML_LOCATION = path.join(SCHAUFEL_DIR, 'schaufel-broken-html');

const idToTiktokUrl = (id: string) =>
  `https://www.tiktok.com/@user/video/${id.slice(2)}/`;

const fixUrl = (url: string) => {
  if (url.startsWith('https://www.tiktokv.com/share'))
    return `https://www.tiktok.com/@user/video/${getIdFromUrl(url)}/`;
  return url;
};

const pruneResult = (result) => {
  return _.pick(result, [
    'result.id',
    'result.desc',
    'result.createTime',
    'result.author',
    'result.nickname',
    'result.authorId',
    'result.video.duration',
    'result.stats',
    'result.music.id',
    'result.music.title',
    'result.music.authorName',
    'result.music.original',
    'result.diversificationLabels',
    'scrapedAt',
    'error',
  ]);
};

const scrapeTiktokVideos = async (
  videoUrls: string[],
  cache: any,
  options: any,
  logFun = console.log,
): Promise<any> => {
  if (options.verbose) {
    logFun(`Starting to fetch ${videoUrls.length} videos.`);
    logFun(options);
  }

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
          const [html, status] = await get(fixUrl(url), options.proxy, logFun);
          if (options.verbose) {
            logFun(`Fetching done`);
          }

          if (status !== 200)
            throw new Error(`Fetching failed with status code: ${status}`);

          const metaData = parseTikTokVideo(
            html as string,
            options.logBrokenHtml ? BROKEN_HTML_LOCATION : null,
            logFun,
          );
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
            writeJSON(CACHE_LOCATION, _.merge(cache, newCache));
          }

          if (options.delay > 0) await delay(options.delay);
          break;
        } catch (err) {
          if (err.message == 'Parsing error' && parseTry < 3) {
            parseTry += 1;
            if (options.verbose) {
              logFun('Retrying parsing');
            }
            await delay(1000 + 500 * parseTry);
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

const getTiktokVideosFromDump = async (
  dump: any,
  limit: number | null = 10,
  cache = {},
  options = {
    delay: 1000,
    saveCache: false,
    verbose: false,
    proxy: true,
    logBrokenHtml: true,
  },
): Promise<any> => {
  let videoList: any[] =
    dump['Activity']['Video Browsing History']['VideoList'];

  if (limit != null) {
    videoList = videoList.slice(0, limit);
  }

  const [metaDataList, newCache] = await scrapeTiktokVideos(
    videoList.map((x) => x.VideoLink ?? x.Link),
    cache,
    options,
  );

  return [
    _.merge(
      videoList,
      metaDataList.map((x) => ({ meta: x })),
    ),
    newCache,
  ];
};

const enrichTiktokDump = async (
  dump_location: string,
  delay = 1000,
  limit = null,
): Promise<any> => {
  console.log(dump_location);
  const dump = readJSON(dump_location);
  const cache = readJSON(CACHE_LOCATION);

  const result = await getTiktokVideosFromDump(dump, limit, cache, {
    saveCache: true,
    delay,
    verbose: true,
    proxy: true,
    logBrokenHtml: true,
  });

  dump['Activity']['Video Browsing History']['VideoList'] = result[0];

  writeJSON(dump_location + '_enriched.json', dump);
};

const getTiktokVideoMeta = async (
  videos: string[],
  prune = true,
  proxy = true,
  useCache = true,
  logBrokenHtml = true,
  delay = 0,
  logFun = console.log,
): Promise<any> => {
  const cache = useCache ? readJSON(CACHE_LOCATION) : {};

  const results = await scrapeTiktokVideos(
    videos,
    cache,
    {
      delay,
      saveCache: false,
      verbose: true,
      proxy,
      logBrokenHtml,
    },
    logFun,
  );

  if (useCache) writeJSON(CACHE_LOCATION, results[1]);

  if (prune) return results[0].map(pruneResult);
  return results[0];
};

export {
  fixUrl,
  getIdFromUrl,
  scrapeTiktokVideos,
  getTiktokVideosFromDump,
  enrichTiktokDump,
  getTiktokVideoMeta,
  idToTiktokUrl,
};
