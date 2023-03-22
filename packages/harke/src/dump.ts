import { pickArray } from '@algorithmwatch/utils';
import _ from 'lodash';
import { scrapeYouTubeVideos } from './scrape';

// Extract videos from watch history
const extractWatchedVideosFromDump = (videoList) => {
  return _.map(
    videoList,
    _.partialRight(_.pick, ['title', 'titleUrl', 'time']),
  );
};

const scrapeVideosFromWatchedDump = (videolist, max) => {
  const items = extractWatchedVideosFromDump(videolist);
  const urls = pickArray(items.slice(0, max), ['titleUrl']).map(
    (x) => x.titleUrl,
  );

  return scrapeYouTubeVideos(urls, {
    delay: 0,
    saveCache: false,
    verbose: true,
    storeBrokenHtml: false,
  });
};

export { extractWatchedVideosFromDump, scrapeVideosFromWatchedDump };
