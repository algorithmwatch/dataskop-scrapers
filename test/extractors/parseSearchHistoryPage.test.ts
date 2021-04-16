import fs from 'fs';
import parseSearchHistoryPage from '../../src/extractors/parseSearchHistoryPage';
import { ParserResult } from '../../src/types';

describe('parseSearchHistoryPage result', () => {
  let playlistPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    const filePath = 'test/html/search_history_auth.html';
    playlistPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseSearchHistoryPage(playlistPageHtml);
    // console.warn('test', parsedResult.fields.queries)
  });

  test('has 20 entries', () => {
    expect(Array.isArray(parsedResult.fields.queries)).toBe(true);
    expect(parsedResult.fields.queries.length).toBe(20);
  });

  test('has entries with correct number of properties', () => {
    const queriesArr = parsedResult.fields.queries;
    expect(queriesArr.every((x: any) => Object.keys(x).length === 2)).toBe(
      true,
    );
  });

  test('has no field errors', () => {
    expect(Array.isArray(parsedResult.errors)).toBe(true);
    expect(parsedResult.errors.length).toBe(0);
  });

  test('specific entry has query specific string', () => {
    expect(parsedResult.fields.queries[16].query).toBe(
      'nazis morden weiter und der staat feine sahne',
    );
  });
});
