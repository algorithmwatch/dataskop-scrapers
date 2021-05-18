import fs from 'fs';
import { parseSearchResultsVideos } from '../../src';
import { ParserResult } from '../../src/types';

describe('search-page 2021-05-17', () => {
  let searchPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    // testing
    const filePath = 'test/html/search-results-videos-2021-05-17.html';
    searchPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseSearchResultsVideos(searchPageHtml);
    // console.warn('test', parsedResult);
  });

  test('no error', () => {
    expect(parsedResult.errors.length).toBe(0);
  });

  test('has meaningful values', () => {
    expect(parsedResult.fields.videos.length).toBeGreaterThan(10);

    for (const v of parsedResult.fields.videos) {
      expect(v.title.length).toBeGreaterThan(5);
      expect(v.duration).toBeGreaterThan(1000);
      expect(v.uploadDateString.length).toBeGreaterThan(5);
      expect(v.viewCount).toBeGreaterThanOrEqual(0);
      expect(v.channelName.length).toBeGreaterThan(2);
      expect(v.channelUrl.length).toBeGreaterThan(5);
    }
  });
});
