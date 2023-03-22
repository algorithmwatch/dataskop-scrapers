import * as fs from 'fs';
import {
  extractWatchedVideosFromDump,
  scrapeVideosFromWatchedDump,
} from '../src';

describe('dump', () => {
  let parsedResult: any;
  let scrapedResult: any;

  beforeAll(async () => {
    const filePath = 'test/dumps/2023_02_06_jf_watch-history.json';
    const file = JSON.parse(String(fs.readFileSync(filePath)));
    parsedResult = extractWatchedVideosFromDump(file);
    scrapedResult = await scrapeVideosFromWatchedDump(file, 2);
    // console.warn('test', parsedResult);
    // console.warn('test', JSON.stringify(scrapedResult));
  });

  test('dump videos', () => {
    expect(parsedResult.length).toBeGreaterThan(5);
  });
});
