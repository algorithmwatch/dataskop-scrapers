import data from './data/filter8000-22-07-2022.json';

import _ from 'lodash';
import { getMostRecentWatchVideos, getWatchedVideos } from '../src/wrangle';

describe('filter8000 dump from 22-07-2022', () => {
  test('increasing seconds reduced the number of results', () => {
    const res1 = getMostRecentWatchVideos(data, 999999999, 1);
    const res2 = getMostRecentWatchVideos(data, 999999999, 2);
    const res3 = getMostRecentWatchVideos(data, 999999999, 3);
    const res4 = getMostRecentWatchVideos(data, 999999999, 4);
    const res5 = getMostRecentWatchVideos(data, 999999999, 5);
    const res6 = getMostRecentWatchVideos(data, 999999999, 6);

    console.log(
      res1.length,
      res2.length,
      res3.length,
      res4.length,
      res5.length,
      res6.length,
    );

    expect(res1.length > res2.length).toBeTruthy();
    expect(res2.length > res3.length).toBeTruthy();
    expect(res3.length > res4.length).toBeTruthy();
    expect(res4.length > res5.length).toBeTruthy();
    expect(res5.length > res6.length).toBeTruthy();
  });

  test('limit works', () => {
    expect(getMostRecentWatchVideos(data, 100, 2).length).toBe(100);

    expect(getMostRecentWatchVideos(data, 100, 2)).toEqual(
      getMostRecentWatchVideos(data, 100, 2),
    );

    expect(getMostRecentWatchVideos(data, 100, 2)).not.toEqual(
      getMostRecentWatchVideos(data, 100, 1),
    );
  });

  test('correct order', () => {
    const r1 = getWatchedVideos(data, 10, 2);
    const r1Sorted = _.sortBy(r1, '-Date');

    expect(r1).toEqual(r1Sorted);
    expect(r1[0].Date).toBe('2022-07-22 23:08:10');
    expect(r1[1].Date).toBe('2022-07-22 23:06:13');
    expect(r1[4].Date).toBe('2022-07-22 23:05:43');

    // ensure a videos is correctly skipped
    const r2 = getWatchedVideos(data, 10, 5);
    expect(r2[3].Date).toBe('2022-07-22 23:05:43');
  });
});
