import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
import { getIdFromUrl, prependTiktokSuffix } from './scrape';

const getWatchedVideos = (
  dump: any,
  max: null | number = null,
  minWatchedSeconds: null | number = null,
) => {
  const videos = dump.Activity['Video Browsing History'].VideoList;

  if (minWatchedSeconds) {
    let lastDate: null | Dayjs = null;
    const resultingVideos = [];
    // Loop in reverse to get videos from the end
    for (let i = videos.length - 1; i >= 0; i -= 1) {
      const vid = videos[i];
      const vidDate = dayjs(vid.Date);
      if (
        lastDate === null ||
        vidDate.diff(lastDate, 'second') > minWatchedSeconds
      ) {
        resultingVideos.push(vid);

        // Exit if we have enough videos
        if (max && resultingVideos.length === max) return resultingVideos;
      }
      lastDate = vidDate;
    }
    return resultingVideos;
  }

  if (max) return videos.slice(-max);
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
  return _.uniq(lookupIds).slice(-max);
};

export { getMostRecentWatchVideos, getLookupId };
