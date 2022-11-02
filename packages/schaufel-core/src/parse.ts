/*
MIT License

Copyright (c) Andrew Nord (drawrowfly)


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import fs from 'fs';
import path from 'path';

/**
 * Extracts structured meta data from a videos html page.
 *
 * This function was extracted (and adapted) from https://github.com/drawrowfly/tiktok-scraper/
 * https://github.com/drawrowfly/tiktok-scraper/blob/e3e8f007c1603f1f922c6264632fae800bb689a8/src/core/TikTok.ts#L1192
 * @param html
 * @returns Parsed data
 */
const parseTikTokVideo = (
  html: string,
  brokenHtmlLocation: null | string,
  logFun = console.log,
): any => {
  try {
    if (html.includes('__NEXT_DATA__')) {
      const rawVideoMetadata = html
        .split(
          /<script id="__NEXT_DATA__" type="application\/json" nonce="[\w-]+" crossorigin="anonymous">/,
          2,
        )[1]
        .split(`</script>`, 1)[0];

      const videoProps = JSON.parse(rawVideoMetadata);
      const videoData = videoProps.props.pageProps.itemInfo.itemStruct;
      return videoData;
    }

    if (html.includes('SIGI_STATE')) {
      const rawVideoMetadata = html
        .split('<script id="SIGI_STATE" type="application/json">', 2)[1]
        .split('</script>', 1)[0];

      const videoProps = JSON.parse(rawVideoMetadata);
      if ('ItemModule' in videoProps) {
        const videoData = Object.values(videoProps.ItemModule)[0];
        return videoData;
      }

      // Last resort: Find sub object
      const getVideoData = (o) => {
        for (const [k, v] of Object.entries(o)) {
          if (k === 'videoData') {
            return v;
          }
          if (typeof v === 'object') {
            const found = getVideoData(v);
            if (found) return found;
          }
        }
        return null;
      };

      const vidData = getVideoData(videoProps);
      if (
        vidData &&
        'itemInfo' in vidData &&
        'itemStruct' in vidData.itemInfo
      ) {
        return vidData.itemInfo.itemStruct;
      }
    }

    throw new Error('Parsing error');
  } catch (error) {
    const title = html
      .split('</title>', 1)[0]
      .split('<title data-rh="true">', 2)[1];

    if (title && title.trim().startsWith('This video is unavailable.')) {
      throw new Error('Video is unavailable');
    }

    // Test if TT forces us to execute JS (we are getting throttled)
    if (html.includes('<body> Please wait... </body>')) {
      logFun('Parsing error: JS needs to get executed');
      throw new Error('Needs JS');
    }

    logFun(`Failed with: ${error}`);

    if (brokenHtmlLocation) {
      logFun('Storing broken html');
      if (!fs.existsSync(brokenHtmlLocation)) {
        fs.mkdirSync(brokenHtmlLocation);
      }

      fs.writeFileSync(
        path.join(brokenHtmlLocation, `${Date.now()}.html`),
        html,
      );
    }
    throw new Error('Parsing error');
  }
};

export { parseTikTokVideo };
