import _ from 'lodash';
import { parseTikTokVideo } from './parse';
import { delay, getHtml } from './utils';

const fixUrl = (x: string) => {
  return 'https://www.tiktok.com/@user/video' + x.match(/\/\d*\/$/)[0];
};

const scrapeTiktokVideos = async (videoUrls: string[], delayMs: number) => {
  const results = [];
  for (let url of videoUrls) {
    try {
      if (url.startsWith('https://www.tiktokv.com/share')) url = fixUrl(url);

      const html = (await getHtml(url)) as string;
      const metaData = parseTikTokVideo(html);
      results.push({
        meta: { results: metaData, scrapedAt: Date.now(), error: null },
      });
      await delay(delayMs);
    } catch (error) {
      results.push({ meta: { results: null, scrapedAt: Date.now(), error } });
    }
  }
  return results;
};

const getTiktokVideosFromDump = async (dump: any, limit = 10, delay = 1000) => {
  const videoList: any[] = dump['Activity']['Video Browsing History'][
    'VideoList'
  ].slice(0, limit);
  const metaDataList = await scrapeTiktokVideos(
    videoList.map((x) => x['VideoLink']),
    delay,
  );
  return _.merge(videoList, metaDataList);
};

export { scrapeTiktokVideos, getTiktokVideosFromDump };
