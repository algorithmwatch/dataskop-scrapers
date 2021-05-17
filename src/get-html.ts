/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
import fs from 'fs';
import { LaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import { HarkeInvalidUrl } from './errors';
import { isValidUrl } from './util';

import {
  parseWatchHistoryPage,
  watchHistoryUrl,
  searchHistoryUrl,
  parseSearchHistoryPage,
  subscribedChannelsUrls,
  parseSubscribedChannelsPage,
  parseVideoPage,
  parsePlaylistPage,
} from '@algorithmwatch/harke-parser/build';

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

let browser = null;

const setupBrowser = async () => {
  if (browser !== null) return browser;

  browser = await puppeteer.launch({
    headless: false,
    userDataDir: './user_data', // `userDataDir` to keep login via sessions
  } as LaunchOptions);

  return browser;
};

const closeBrowser = async () => {
  await browser.close();
  browser = null;
};

const newPage = async () => {
  const b = await setupBrowser();
  const page = await b.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  return page;
};

async function getHtml(url: string, closePage = false) {
  if (!isValidUrl(url)) throw HarkeInvalidUrl;

  const page = await newPage();

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.waitForTimeout(3000);
  const html = await page.content();

  if (closePage) await page.close();

  return html;
}

async function loginYoutube() {
  const page = await newPage();
  await page.goto('https://www.youtube.com/account');
}

async function goToUrlandParse(url: string, parse, outputLocation = null) {
  const html = await getHtml(url, true);

  console.log('wait');
  try {
    const result = parse(html);
    console.log(result);

    if (outputLocation !== null) {
      const now = new Date().toISOString().substring(0, 10);
      fs.mkdirSync(outputLocation, { recursive: true });
      fs.writeFileSync(`${outputLocation}/${result.slug}-${now}.html`, html);
    }
  } catch (error) {
    console.log(error);
  }
}

function getWatchHistory(outputLocation = null) {
  console.log('watch history');
  return goToUrlandParse(
    watchHistoryUrl,
    parseWatchHistoryPage,
    outputLocation,
  );
}

function getSearchHistory(outputLocation = null) {
  console.log('search history');
  return goToUrlandParse(
    searchHistoryUrl,
    parseSearchHistoryPage,
    outputLocation,
  );
}

function getSubscribedChannels(outputLocation = null) {
  console.log('subscribed channels');
  return goToUrlandParse(
    subscribedChannelsUrls,
    parseSubscribedChannelsPage,
    outputLocation,
  );
}

function getLikedVideo(outputLocation = null) {
  const LIST_ID_LIKED_VIDEOS = 'LL';
  const url = `https://www.youtube.com/playlist?list=${LIST_ID_LIKED_VIDEOS}`;

  console.log('liked videos');
  return goToUrlandParse(url, parsePlaylistPage, outputLocation);
}

function validateVideoPage(url, outputLocation = null) {
  console.log('fetch video');
  return goToUrlandParse(url, parseVideoPage, outputLocation);
}

export {
  getHtml,
  loginYoutube,
  getWatchHistory,
  getSearchHistory,
  getSubscribedChannels,
  getLikedVideo,
  validateVideoPage,
  closeBrowser,
};
