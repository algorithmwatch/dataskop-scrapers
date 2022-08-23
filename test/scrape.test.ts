import { getTiktokVideoMeta, getTiktokVideosFromDump } from '../src/scrape';

import data from './data/filter8000-22-07-2022.json';

jest.setTimeout(90000);

describe('filter8000 dump from 22-07-2022', () => {
  test('enrich dump', async () => {
    const videos = await getTiktokVideosFromDump(data, 2);
    console.log(JSON.stringify(videos, null, 2));
  });
});

describe('pruned metadata from filter8000 dump from 22-07-2022', () => {
  test('get video meta', async () => {
    const videos = data['Activity']['Video Browsing History']['VideoList'].map(
      (x) => x['VideoLink'],
    );
    const meta = await getTiktokVideoMeta(videos.slice(0, 2));
  });
});
