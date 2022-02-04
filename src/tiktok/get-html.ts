import CaptchaSolver from 'tiktok-captcha-solver';
import { newPage } from '../browser';

// async function getHtml(url: string, closePage = false) {
//   if (!isValidUrl(url)) throw 'Invalid url';

//   const page = await newPage();

//   await page.goto(url, {
//     waitUntil: 'networkidle2',
//   });

//   return html;
// }

async function login(credentials, pupOptions) {
  const loginUrl = 'https://www.tiktok.com/login/phone-or-email/email';
  const page = await newPage(pupOptions);

  const capSol = new CaptchaSolver(page);

  await page.goto(loginUrl, {
    waitUntil: 'networkidle2',
  });

  const [email, pw] = credentials.split(':');

  await page.waitForTimeout(1000 + 1000 * Math.random());
  await page.focus(`input[name='email']`);
  await page.keyboard.type(email);

  await page.waitForTimeout(1000 + 1000 * Math.random());
  await page.focus(`input[name='password']`);
  await page.keyboard.type(pw);

  await page.waitForTimeout(1000 + 1000 * Math.random());
  await page.keyboard.press('Enter');

  await page.waitForTimeout(1000 + 1000 * Math.random());

  await capSol.solve();
}

export { login };

// async function goToUrlandParse(url: string, parse, outputLocation = null) {
//   const html = await getHtml(url, true);

//   console.log('wait');
//   try {
//     const result = parse(html);
//     console.log(result);

//     if (outputLocation !== null) {
//       const now = new Date().toISOString().substring(0, 10);
//       fs.mkdirSync(outputLocation, { recursive: true });
//       fs.writeFileSync(`${outputLocation}/${result.slug}-${now}.html`, html);
//     }
//     return result;
//   } catch (error) {
//     console.log(error);
//   }
// }

// function getWatchHistory(outputLocation = null) {
//   console.log('watch history');
//   return goToUrlandParse(watchHistoryUrl, parseWatchHistory, outputLocation);
// }

// function getSearchHistory(outputLocation = null) {
//   console.log('search history');
//   return goToUrlandParse(searchHistoryUrl, parseSearchHistory, outputLocation);
// }

// function getSubscribedChannels(outputLocation = null) {
//   console.log('subscribed channels');
//   return goToUrlandParse(
//     subscribedChannelsUrl,
//     parseSubscribedChannels,
//     outputLocation,
//   );
// }

// function getPlaylist(id, outputLocation = null) {
//   const url = `https://www.youtube.com/playlist?list=${id}`;
//   return goToUrlandParse(url, parsePlaylistPage, outputLocation);
// }

// function getLikedVideo(outputLocation = null) {
//   const LIST_ID_LIKED_VIDEOS = 'LL';
//   console.log('liked videos');
//   return getPlaylist(LIST_ID_LIKED_VIDEOS, outputLocation);
// }

// function getVideoPage(url, outputLocation = null) {
//   console.log('fetch video');
//   return goToUrlandParse(url, parseVideoPage, outputLocation);
// }

// function getSearchVideoPage(query, outputLocation = null) {
//   console.log('search videos for ' + query);
//   const url = buildSearchUrl(query, 'videos');
//   console.log(url);
//   return goToUrlandParse(
//     url,
//     (x) => parseSearchResultsVideos(x, query),
//     outputLocation,
//   );
// }

// export {
//   getHtml,
//   loginYoutube,
//   getWatchHistory,
//   getSearchHistory,
//   getSubscribedChannels,
//   getLikedVideo,
//   getPlaylist,
//   getSearchVideoPage,
//   getVideoPage,
//   closeBrowser,
// };
