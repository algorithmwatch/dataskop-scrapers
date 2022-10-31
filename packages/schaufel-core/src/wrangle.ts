import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
import { getIdFromUrl, prependTiktokSuffix } from './scrape';

/**
 * Returns the N most recent (or all) watched videos from a dump in descending order.
 * Optionally skips over shortly watched videos.
 */
const getWatchedVideos = (
  dump: any,
  max: null | number = null,
  minWatchedSeconds: null | number = null,
): any[] => {
  let videos = dump.Activity['Video Browsing History'].VideoList;

  if (minWatchedSeconds) {
    let lastDate: null | Dayjs = null;
    const resultingVideos = [];
    // Loop through the sorted videos.
    // We have to iterate over all videos even though we only want to last N
    // videos because we don't know over how many videos we will skip.
    for (const vid of _.sortBy(videos, 'Date')) {
      const vidDate = dayjs(vid.Date);
      if (
        lastDate === null ||
        vidDate.diff(lastDate, 'second') > minWatchedSeconds
      ) {
        resultingVideos.unshift(vid);
      }
      lastDate = vidDate;
    }
    videos = resultingVideos;
  }
  if (max) return videos.slice(0, max);
  return videos;
};

const getLookupId = (x: any) =>
  prependTiktokSuffix(getIdFromUrl(x.Link ?? x.VideoLink));

const getLookupIdsFromDump = (videoList: any[]) => {
  const videoUrls = videoList.map((x) => x.Link ?? x.VideoLink);
  const videoIds = _.uniq(videoUrls).map(getIdFromUrl).map(prependTiktokSuffix);
  return videoIds;
};

const getMostRecentWatchVideos = (
  dump: any,
  max: number,
  minWatchedSeconds: number | null,
): string[] => {
  // get last N * 2 videos before making them unique by id
  const videos = getWatchedVideos(dump, max * 2, minWatchedSeconds);
  const lookupIds = getLookupIdsFromDump(videos);
  return _.uniq(lookupIds).slice(0, max);
};

export { getMostRecentWatchVideos, getWatchedVideos, getLookupId };
