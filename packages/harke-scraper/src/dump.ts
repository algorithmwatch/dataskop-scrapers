import _ from 'lodash';
import { scrapeYouTubeVideos } from './scrape';

// Extract videos from watch history
const extractWatchedVideosFromDump = (videoList, onlyUrls = true) => {
  const items = _.map(
    videoList,
    _.partialRight(_.pick, ['title', 'titleUrl', 'time']),
  );
  if (onlyUrls) {
    return items.map((x: any) => x.titleUrl);
  } else {
    return items;
  }
};

const scrapeVideosFromWatchedDump = (videolist, max) => {
  const urls = extractWatchedVideosFromDump(videolist).slice(0, max);

  return scrapeYouTubeVideos(urls, {
    delay: 0,
    saveCache: false,
    verbose: true,
    storeBrokenHtml: false,
  });
};

export { extractWatchedVideosFromDump, scrapeVideosFromWatchedDump };
