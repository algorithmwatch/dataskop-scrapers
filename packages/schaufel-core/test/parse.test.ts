import fs from 'fs';
import { parseTikTokVideo } from '../src/parse';

describe('Parse HTML', () => {
  test('Parse unavailabe HTML', () => {
    for (const file of fs
      .readdirSync('./test/html-unavailable')
      .filter((x) => x.endsWith('.html'))) {
      console.log(file);
      const html = fs.readFileSync(`./test/html-unavailable/${file}`, 'utf8');

      expect(() => parseTikTokVideo(html, null)).toThrow(
        Error('Video is unavailable'),
      );
    }
  });

  test('Parse available HTML', () => {
    for (const file of fs
      .readdirSync('./test/html-success')
      .filter((x) => x.endsWith('.html'))) {
      console.log(file);
      const html = fs.readFileSync(`./test/html-success/${file}`, 'utf8');

      const parsed = parseTikTokVideo(html, null);
      // console.log(parsed);
      expect(parsed).toBeTruthy();
    }
  });
});
