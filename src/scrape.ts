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

const scrapeTiktokVideos = async (
  videoUrls: string[],
  cache: any,
  options: any,
): Promise<any> => {
  console.log(videoUrls.slice(0, 10));
  console.log(options);

  const results = [];
  const newCache = {};

  for (const url of videoUrls) {
    try {
      if (url in cache) {
        results.push(cache[url]);
        continue;
      }
      if (url in newCache) {
        results.push(newCache[url]);
        continue;
      }
      if (options.verbose) {
        console.log(`Fetching ${url}`);
      }
      const html = (await getHtml(fixUrl(url))) as string;
      const metaData = parseTikTokVideo(html);
      const result = {
        meta: { results: metaData, scrapedAt: Date.now(), error: null },
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
      results.push({ meta: { results: null, scrapedAt: Date.now(), error } });

      if (options.verbose) {
        console.error(error);
      }
    }
  }
  return [results, newCache];
};

const getTiktokVideosFromDump = async (
  dump: any,
  limit = 10,
  cache = {},
  options = { delay: 1000, saveCache: false, verbose: false },
) => {
  const videoList: any[] = dump['Activity']['Video Browsing History'][
    'VideoList'
  ].slice(0, limit ? limit : 9999999999999999);
  const [metaDataList, newCacheItems] = await scrapeTiktokVideos(
    videoList.map((x) => x['VideoLink']),
    cache,
    options,
  );
  return [_.merge(videoList, metaDataList), newCacheItems];
};

const getTiktokVideosFromDumpDev = async (
  dump_location,
  delay = 1000,
  limit = 99999999,
) => {
  console.log(dump_location);
  const dump = readJSON(dump_location);
  const cache = readJSON(CACHE_DIR);

  const result = [
    await getTiktokVideosFromDump(dump, limit, cache, {
      saveCache: true,
      delay,
      verbose: true,
    }),
  ];

  // broken, fixme
  const videos = result[0];

  console.log(videos.length);

  dump['Activity']['Video Browsing History']['VideoList'] = videos;

  writeJSON(dump_location + '_enriched.json', dump);
};

export {
  scrapeTiktokVideos,
  getTiktokVideosFromDump,
  getTiktokVideosFromDumpDev,
};
