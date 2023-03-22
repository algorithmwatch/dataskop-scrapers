/* eslint-disable no-console */
import { getIdFromUrl } from '@algorithmwatch/schaufel-wrangle';
import { scrapeItems } from '@algorithmwatch/scraper';
import { readJSON, writeJSON } from '@algorithmwatch/utils';
import _ from 'lodash';
import os from 'os';
import path from 'path';
import { parseTikTokVideo } from './parse';

let SCHAUFEL_DIR = os.homedir();

if (process.env.SCHAUFEL_DIR) SCHAUFEL_DIR = process.env.SCHAUFEL_DIR;

const CACHE_LOCATION = path.join(SCHAUFEL_DIR, 'schaufel-cache.json');
const BROKEN_HTML_LOCATION = path.join(SCHAUFEL_DIR, 'schaufel-broken-html');

const idToTiktokUrl = (id: string): string =>
  `https://www.tiktok.com/@user/video/${id.slice(2)}/`;

const fixUrl = (url: string): string => {
  if (url.startsWith('https://www.tiktokv.com/share'))
    return `https://www.tiktok.com/@user/video/${getIdFromUrl(url)}/`;
  return url;
};

const pruneResult = (result): any => {
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
  fetchFun = undefined,
  fetchMaxTries = undefined,
): Promise<any> => {
  return scrapeItems(
    videoUrls,
    cache,
    options,
    { BROKEN_HTML_LOCATION, CACHE_LOCATION },
    logFun,
    fetchFun,
    fetchMaxTries,
    parseTikTokVideo,
    fixUrl,
  );
};

const getTiktokVideosFromDump = async (
  dump: any,
  limit: number | null = 10,
  cache = {},
  options: any = {
    delay: 1000,
    saveCache: false,
    verbose: false,
    storeBrokenHtml: true,
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
    storeBrokenHtml: true,
  });

  dump['Activity']['Video Browsing History']['VideoList'] = result[0];

  writeJSON(dump_location + '_enriched.json', dump);
};

const getTiktokVideoMeta = async (
  videos: string[],
  prune = true,
  useCache = true,
  storeBrokenHtml: boolean | string = true,
  delay = 0,
  logFun = console.log,
  fetchFun = undefined,
  fetchMaxTries = undefined,
): Promise<any> => {
  const cache = useCache ? readJSON(CACHE_LOCATION) : {};

  const results = await scrapeTiktokVideos(
    videos,
    cache,
    {
      delay,
      saveCache: false,
      verbose: true,
      storeBrokenHtml,
    },
    logFun,
    fetchFun,
    fetchMaxTries,
  );

  if (useCache) writeJSON(CACHE_LOCATION, results[1]);

  if (prune) return results[0].map(pruneResult);
  return results[0];
};

export {
  fixUrl,
  getIdFromUrl,
  getTiktokVideosFromDump,
  enrichTiktokDump,
  getTiktokVideoMeta,
  idToTiktokUrl,
  pruneResult,
};
