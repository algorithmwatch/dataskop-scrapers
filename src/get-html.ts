import puppeteer from 'puppeteer';
import { HarkeInvalidUrl } from './errors';
import { isValidUrl } from './util';

import {
  parseWatchHistoryPage,
  watchHistoryUrl,
  searchHistoryUrl,
  parseSearchHistoryPage,
  subscribedChannelsUrls,
  parseSubscribedChannelsPage,
} from '@algorithmwatch/harke-parser/build';

let browser = null;

const setupBrowser = async () => {
  if (browser !== null) return browser;
  // `userDataDir` to keep login via sessions

  browser = await puppeteer.launch({
    executablePath: '/Applications/Firefox.app/Contents/MacOS/firefox-bin',
    // executablePath:
    // '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    product: 'firefox',
    headless: false,
    userDataDir: './user_data',
  });

  return browser;
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

async function getHtml(url: string) {
  if (!isValidUrl(url)) throw HarkeInvalidUrl;

  const page = await newPage();

  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  await page.waitForTimeout(2000);
  const html = await page.content();

  return html;
}

async function loginYoutube() {
  const page = await newPage();
  await page.goto('https://www.youtube.com/account');
}

async function goToUrlandParse(url: string, parse) {
  const page = await newPage();
  // await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
  await page.goto(url, { timeout: 0 });
  await page.waitForTimeout(3000);
  const html = await page.content();
  console.log('wait');
  try {
    const result = parse(html);
    console.log(result);
    await page.close();
  } catch (error) {
    console.log(error);
  }
}

function validateWatchHistory() {
  console.log('watch history');
  return goToUrlandParse(watchHistoryUrl, parseWatchHistoryPage);
}

function validateSearchHistory() {
  console.log('search history');
  return goToUrlandParse(searchHistoryUrl, parseSearchHistoryPage);
}

function validateSubscribedChannels() {
  console.log('subscribed channels');
  return goToUrlandParse(subscribedChannelsUrls, parseSubscribedChannelsPage);
}

export {
  getHtml,
  loginYoutube,
  validateWatchHistory,
  validateSearchHistory,
  validateSubscribedChannels,
};
