import { getVideoMetaFromDump } from '../src/scrape';

import data from './data/filter8000-22-07-2022.json';

jest.setTimeout(90000);

describe('filter8000 dump from 22-07-2022', () => {
  test('download videos', async () => {
    const videos = await getVideoMetaFromDump(data, 2);
    console.log(JSON.stringify(videos, null, 2));
  });
});
