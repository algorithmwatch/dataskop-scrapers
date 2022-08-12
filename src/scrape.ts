import _ from 'lodash';

import * as TikTokScraper from 'tiktok-scraper';

const fixUrl = (x: string) => {
  return 'https://www.tiktok.com/@user/video' + x.match(/\/\d*\/$/)[0];
};

const scrapeVideos = async (videoUrls: string[]) => {
  const results = [];
  for (let url of videoUrls) {
    try {
      if (url.startsWith('https://www.tiktokv.com/share')) url = fixUrl(url);
      const metaData = await TikTokScraper.getVideoMeta(url);
      results.push(metaData);
    } catch (error) {
      results.push({});
      console.log(url);
      console.error(error);
    }
  }
  return results;
};

const getVideoMetaFromDump = async (dump: any, limit = 10) => {
  const videoList = dump['Activity']['Video Browsing History'][
    'VideoList'
  ].slice(0, limit);
  const metaDataList = await scrapeVideos(videoList.map((x) => x['VideoLink']));
  return _.zip(videoList, metaDataList);
};

export { scrapeVideos, getVideoMetaFromDump };
