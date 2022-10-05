import {
  fixUrl,
  getTiktokVideoMeta,
  getTiktokVideosFromDump,
} from '../src/scrape';

import data from './data/filter8000-22-07-2022.json';

jest.setTimeout(30000);

describe('filter8000 dump from 22-07-2022', () => {
  test('check for fix url', () => {
    expect(
      fixUrl('https://www.tiktokv.com/share/video/7108640878507445509/'),
    ).toBe('https://www.tiktok.com/@user/video/7108640878507445509/');
  });

  test('enrich dump', () => {
    expect(async () => {
      const videos = await getTiktokVideosFromDump(
        data,
        10,
        {},
        {
          verbose: true,
          delay: 1000,
          saveCache: false,
          proxy: true,
          logBrokenHtml: true,
        },
      );
      // console.log(JSON.stringify(videos, null, 2));
      return videos.length;
    }).toBeTruthy();
  });

  test('get video meta', async () => {
    const videos = data['Activity']['Video Browsing History']['VideoList'].map(
      (x) => x.VideoLink,
    );
    const meta = await getTiktokVideoMeta(videos.slice(0, 2));
  });
});

describe('Check parsing error', () => {
  test('Check parsing error', async () =>
    expect(
      (await getTiktokVideoMeta(['https://johannesfilter.com']))[0].error,
    ).toBe('Parsing error'));
});
