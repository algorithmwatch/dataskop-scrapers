/* eslint-disable no-console */
import _ from 'lodash';
import os from 'os';
import { get } from './mullvad';
import { parseTikTokVideo } from './parse';
import { delay, readJSON, writeJSON } from './utils';

let CACHE_DIR = os.homedir() + '/.schaufel-cache.json';

if (process.env.CACHE_DIR)
  CACHE_DIR = process.env.CACHE_DIR + '/schaufel-cache.json';

const prependTiktokSuffix = (id: string | number): string => `tv${id}`;

const idToTiktokUrl = (id: string) =>
  `https://www.tiktok.com/@user/video/${id.slice(2)}/`;

const getIdFromUrl = (url: string): string => url.match(/\/(\d*)\/$/)[1];

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
): Promise<any> => {
  if (options.verbose) {
    console.log(`Starting to fetch ${videoUrls.length} videos.`);
    console.log(options);
  }

  const results = [];
  const newCache = {};

  for (const url of videoUrls) {
    try {
      if (url in cache) {
        if (options.verbose) {
          console.log('Cache hit');
        }

        results.push(cache[url]);
        continue;
      }

      if (url in newCache) {
        if (options.verbose) {
          console.log('New cache hit');
        }

        results.push(newCache[url]);
        continue;
      }
      if (options.verbose) {
        console.log(`Fetching ${url}`);
      }
      let parseTry = 0;
      try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const [html, status] = await get(fixUrl(url), {});
          if (options.verbose) {
            console.log(`Fetching done`);
          }

          if (status !== 200)
            throw new Error(
              `Fetching failed with status code ${status} for ${url}`,
            );

          const metaData = parseTikTokVideo(html as string);
          const result = {
            result: metaData,
            scrapedAt: Date.now(),
            error: null,
          };
          results.push(result);
          newCache[url] = result;

          if (options.verbose) {
            console.log('Parsing finished successfully');
          }

          if (options.saveCache) {
            writeJSON(CACHE_DIR, _.merge(cache, newCache));
          }

          await delay(options.delay);
          break;
        }
      } catch (err) {
        parseTry += 1;
        if (parseTry < 5) {
          await delay(1000 + 500 * parseTry);
          continue;
        } else throw err;
      }
    } catch (error) {
      results.push({ result: null, scrapedAt: Date.now(), error });

      if (options.verbose) {
        console.error(error);
      }
    }
  }
  return [results, _.merge(cache, newCache)];
};

const getTiktokVideosFromDump = async (
  dump: any,
  limit: number | null = 10,
  cache = {},
  options = { delay: 1000, saveCache: false, verbose: false },
): Promise<any> => {
  let videoList: any[] =
    dump['Activity']['Video Browsing History']['VideoList'];

  if (limit != null) {
    videoList = videoList.slice(0, limit);
  }

  const [metaDataList, newCache] = await scrapeTiktokVideos(
    videoList.map((x) => x['VideoLink']),
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
  const cache = readJSON(CACHE_DIR);

  const result = await getTiktokVideosFromDump(dump, limit, cache, {
    saveCache: true,
    delay,
    verbose: true,
  });

  dump['Activity']['Video Browsing History']['VideoList'] = result[0];

  writeJSON(dump_location + '_enriched.json', dump);
};

const getTiktokVideoMeta = async (
  videos: string[],
  prune = true,
): Promise<any> => {
  const cache = readJSON(CACHE_DIR);

  const results = await scrapeTiktokVideos(videos, cache, {
    delay: 0,
    saveCache: false,
    verbose: true,
  });

  writeJSON(CACHE_DIR, results[1]);

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
  prependTiktokSuffix,
  idToTiktokUrl,
};
