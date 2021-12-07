import fs from 'fs';
import { parseVideoNoJs } from '../src';

describe('video no js', () => {
  let playlistPageHtml: string;
  let parsedResult: any;

  beforeAll(() => {
    const filePath = 'test/html-no-js/video-2021-06-30.html';
    playlistPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseVideoNoJs(playlistPageHtml);
    // console.warn('test', parsedResult.fields.videos)
  });

  test('public video useful values', () => {
    expect(parsedResult.unlisted).toBe(false);
    expect(parsedResult.viewCount).toBeGreaterThan(10);
    expect(parsedResult.category.length).toBeGreaterThan(10);
    expect(parsedResult.publishedAt.length).toBeGreaterThan(8);
  });
});

describe('video no js - unlisted', () => {
  let playlistPageHtml: string;
  let parsedResult: any;

  beforeAll(() => {
    const filePath = 'test/html-no-js/video-unlisted-2021-06-30.html';
    playlistPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseVideoNoJs(playlistPageHtml);
    // console.warn('test', parsedResult.fields.videos)
  });

  test('unlisted video useful values', () => {
    expect(parsedResult.unlisted).toBe(true);
    expect(parsedResult.viewCount).toBeGreaterThan(10);
    expect(parsedResult.category.length).toBeGreaterThan(10);
    expect(parsedResult.publishedAt.length).toBeGreaterThan(8);
  });
});

describe('video no js - unlisted', () => {
  let playlistPageHtml: string;
  let parsedResult: any;

  beforeAll(() => {
    const filePath = 'test/html-no-js/video-private-2021-06-30.html';
    playlistPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseVideoNoJs(playlistPageHtml);
    // console.warn('test', parsedResult.fields.videos)
  });

  test('private video useful values', () => {
    expect(parsedResult).toBe(null);
  });
});
