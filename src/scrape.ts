/* eslint-disable no-console */
import _ from 'lodash';
import os from 'os';
import { parseTikTokVideo } from './parse';
import { delay, getHtml, readJSON, writeJSON } from './utils';

const CACHE_DIR = os.homedir() + '/.dataskop-cache.json';

const fixUrl = (url: string) => {
  if (url.startsWith('https://www.tiktokv.com/share'))
    return 'https://www.tiktok.com/@user/video' + url.match(/\/\d*\/$/)[0];
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
          console.log('cache hit');
        }

        results.push(cache[url]);
        continue;
      }

      if (url in newCache) {
        if (options.verbose) {
          console.log('new cache hit');
        }

        results.push(newCache[url]);
        continue;
      }
      if (options.verbose) {
        console.log(`Fetching ${url}`);
      }
      const html = (await getHtml(fixUrl(url))) as string;
      const metaData = parseTikTokVideo(html);
      const result = {
        result: metaData,
        scrapedAt: Date.now(),
        error: null,
      };
      results.push(result);
      newCache[url] = result;

      if (options.verbose) {
        console.log('Success');
      }

      if (options.saveCache) {
        writeJSON(CACHE_DIR, _.merge(cache, newCache));
      }

      await delay(options.delay);
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
    delay: 1000,
    saveCache: false,
    verbose: true,
  });

  writeJSON(CACHE_DIR, results[1]);

  if (prune) return results[0].map(pruneResult);
  return results[0];
};

export {
  scrapeTiktokVideos,
  getTiktokVideosFromDump,
  enrichTiktokDump,
  getTiktokVideoMeta,
};
