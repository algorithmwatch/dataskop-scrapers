import fs from 'fs';
import { parseWatchHistoryPage } from '../../src';
import { ParserResult } from '../../src/types';

describe('parseWatchHistoryPage result', () => {
  let playlistPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    const filePath = 'test/html/user-watch-history-2021-04-15.html';
    playlistPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseWatchHistoryPage(playlistPageHtml);
    // console.warn('test', parsedResult.fields.videos)
  });

  test('has 200 watched videos', () => {
    expect(Array.isArray(parsedResult.fields.videos)).toBe(true);
    expect(parsedResult.fields.videos.length).toBe(200);
  });

  test('has videos with correct number of properties', () => {
    const videosArray = parsedResult.fields.videos;
    expect(
      videosArray.every((x: any) => {
        if (typeof x.unavailable !== 'undefined') {
          if (Object.keys(x).length !== 2) return false;
        } else {
          if (Object.keys(x).length !== 8) return false;
        }

        return true;
      }),
    ).toBe(true);
  });
});
