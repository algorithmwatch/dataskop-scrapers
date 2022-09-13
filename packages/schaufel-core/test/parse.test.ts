import fs from 'fs';
import { parseTikTokVideo } from '../src/parse';

describe('Parse HTML', () => {
  test('Parse unavailabe HTML', () => {
    const html = fs.readFileSync('./test/html/1663090640636.html', 'utf8');
    expect(() =>
      parseTikTokVideo(html, null).toThrow(Error('Video is unavailable')),
    );
  });
});
