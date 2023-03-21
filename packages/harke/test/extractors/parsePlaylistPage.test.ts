import * as fs from 'fs';
import { parsePlaylistPage } from '../../src';
import { ParserResult } from '../../src/types';

describe('parsePlaylistPage result 2021-04-16', () => {
  let playlistPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    const filePath = 'test/html/playlist-page-2021-04-16.html';
    playlistPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parsePlaylistPage(playlistPageHtml);
    // console.warn('test', parsedResult)
  });

  test('has id', () => {
    expect(parsedResult.fields.id).toMatch(/^[a-z0-9_-]+$/i);
  });

  test('has title', () => {
    expect(parsedResult.fields.title.length).toBeGreaterThan(1);
  });

  test('has empty or filled playlist description string', () => {
    const descriptionLength = parsedResult.fields.description.length;
    expect(descriptionLength).toBeGreaterThanOrEqual(0);
  });

  test('has viewCount greater than zero', () => {
    expect(parsedResult.fields.viewCount).toBeGreaterThan(0);
  });

  test('has videoCount zero or greater than zero', () => {
    expect(parsedResult.fields.videoCount).toBeGreaterThanOrEqual(0);
  });

  test('has updatedAtString', () => {
    expect(parsedResult.fields.updatedAtString.length).toBeGreaterThan(0);
  });

  test('has playlist videos', () => {
    const videosArray = parsedResult.fields.videos;
    expect(videosArray.length).toBe(108);
    expect(
      videosArray.every((x: any) => {
        if (typeof x.unavailable !== 'undefined') {
          if (Object.keys(x).length !== 2) return false;
        } else {
          if (Object.keys(x).length !== 5) return false;
        }

        return true;
      }),
    ).toBe(true);
  });
});

describe('parsePlaylistPage result liked video 2021-04-21', () => {
  let playlistPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    const filePath = 'test/html/playlist-page-liked-videos-2021-04-21.html';
    playlistPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parsePlaylistPage(playlistPageHtml);
    // console.warn('test', parsedResult);
  });

  test('no errors', () => {
    expect(parsedResult.errors.length).toBe(0);
  });
});

describe('parsePlaylistPage result liked video empty 2021-04-21', () => {
  let playlistPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    const filePath =
      'test/html/playlist-page-liked-videos-empty-2021-04-21.html';
    playlistPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parsePlaylistPage(playlistPageHtml);
    // console.warn('test', parsedResult);
  });

  test('no errors', () => {
    expect(parsedResult.errors.length).toBe(0);
  });
});
