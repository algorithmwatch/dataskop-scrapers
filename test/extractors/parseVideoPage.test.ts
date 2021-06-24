import fs from 'fs';
import { parseVideoPage } from '../../src';
import { ParserResult } from '../../src/types';

describe('parseVideoPage result', () => {
  let videoPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    // testing
    const filePath = 'test/html/video_page_no_auth.html';
    videoPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseVideoPage(videoPageHtml);
    // console.warn('test', parsedResult)
  });

  // test('throws error when providing invalid input', () => {
  //   expect(() => parseVideoPage('asdasd')).toThrow(HarkeParsingError)
  // })

  test('has no errors', () => {
    expect(parsedResult.errors.length).toBe(0);
  });

  test('has video id', () => {
    expect(parsedResult.fields.id).toMatch(/^[a-z0-9_-]{11}$/i);
  });

  test('has video title', () => {
    expect(parsedResult.fields.title.length).toBeGreaterThan(1);
  });

  test('has empty or filled video description string', () => {
    const descriptionLength = parsedResult.fields.description.length;
    expect(descriptionLength >= 0).toBeTruthy();
  });

  test('has video duration greater than zero', () => {
    expect(parsedResult.fields.duration).toBeGreaterThan(0);
  });

  describe('Channel', () => {
    test('has id', () => {
      expect(parsedResult.fields.channel.id).toMatch(/^[A-Za-z0-9_-]{10,}$/);
    });

    test('has name', () => {
      expect(parsedResult.fields.channel.name.length).toBeGreaterThan(1);
    });

    test('has URL', () => {
      expect(parsedResult.fields.channel.url).toMatch(/^\/channel\/.+/);
    });

    test('has thumbnail URL', () => {
      expect(parsedResult.fields.channel.thumbnail.length).toBeGreaterThan(10);
    });
  });

  test('has upload date after Youtube launch date and before now', () => {
    const youtubeLaunchDate = new Date(2005, 11, 15);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(parsedResult.fields.uploadDate > youtubeLaunchDate).toBe(true);
    expect(parsedResult.fields.uploadDate < tomorrow).toBe(true);
  });

  test('has upvotes equal or greater than zero', () => {
    expect(parsedResult.fields.upvotes).toBeGreaterThanOrEqual(0);
  });

  test('has downvotes equal or greater than zero', () => {
    expect(parsedResult.fields.downvotes).toBeGreaterThanOrEqual(0);
  });

  test('has category', () => {
    expect(parsedResult.fields.category.length).toBeGreaterThan(1);
  });

  test('has isLiveContent boolean', () => {
    expect(parsedResult.fields.isLive).toBe(false);
  });

  test('has hashtags', () => {
    const hashtagsArray = parsedResult.fields.hashtags;
    expect(hashtagsArray).toContain('#TheOffice');
    expect(hashtagsArray).toContain('#USA');
    expect(hashtagsArray).toContain('#PeacockTV');
  });

  test('viewcount', () => {
    expect(parsedResult.fields.viewCount).toBeGreaterThan(100);
  });
});

describe('parseVideoPage live 2021-05-14', () => {
  let videoPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    // testing
    const filePath = 'test/html/video-page-live-2021-05-13.html';
    videoPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseVideoPage(videoPageHtml);
    // console.warn('test', parsedResult);
  });

  test('isLiveContent', () => {
    expect(parsedResult.fields.isLive).toBe(true);
    expect(parsedResult.fields.wasLive).toBe(false);
  });

  test('has no errors', () => {
    expect(parsedResult.errors.length).toBe(0);
  });

  test('viewcount', () => {
    expect(parsedResult.fields.viewCount).toBeGreaterThan(100);
  });
});

describe('parseVideoPage was live 2021-05-14', () => {
  let videoPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    // testing
    const filePath = 'test/html/video-page-was-live-2021-05-14.html';
    videoPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseVideoPage(videoPageHtml);
    // console.warn('test', parsedResult);
  });

  test('was live', () => {
    expect(parsedResult.fields.isLive).toBe(false);
    expect(parsedResult.fields.wasLive).toBe(true);
  });

  test('has no errors', () => {
    expect(parsedResult.errors.length).toBe(0);
  });

  test('clarify box absent', () => {
    expect(parsedResult.fields.clarifyBox).toBe('');
  });
});

describe('parseVideoPage was live 2021-05-14', () => {
  let videoPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    // testing
    const filePath = 'test/html/video-page-corona-2021-05-14.html';
    videoPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseVideoPage(videoPageHtml);
    // console.warn('test', parsedResult);
  });

  test('clarify box present', () => {
    expect(parsedResult.fields.clarifyBox.length).toBeGreaterThan(10);
    expect(parsedResult.fields.clarifyBox.includes('COVID')).toBe(true);
  });
});

describe('parseVideoPage 2021-05-18', () => {
  let videoPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    // testing
    const filePath = 'test/html/video-page-2021-05-18.html';
    videoPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseVideoPage(videoPageHtml);
    // console.warn('test', parsedResult);
  });

  test('recommended video tags', () => {
    expect(parsedResult.fields.recommendedVideosTags.length).toBeGreaterThan(4);
    // expect(parsedResult.fields.clarifyBox.includes('COVID')).toBe(true);
  });
});

describe('parseVideoPage 2021-06-14', () => {
  let videoPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    // testing
    const filePath = 'test/html/video-page-2021-06-14.html';
    videoPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseVideoPage(videoPageHtml);
    // console.warn('test', parsedResult);
  });

  test('sentiment null', () => {
    expect(parsedResult.fields.upvotes).toBe(null);
    expect(parsedResult.fields.downvotes).toBe(null);
  });

  test('recommended videos uploaded string', () => {
    for (const x of parsedResult.fields.recommendedVideos) {
      expect(x.uploadedAtString.length).toBeGreaterThan(5);
    }
  });
});
