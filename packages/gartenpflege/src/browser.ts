import { LaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { randomNormalNumber } from './util';

// add stealth plugin and use defaults (all evasion techniques)
puppeteer.use(StealthPlugin());

let browser = null;

const setupBrowser = async (options) => {
  if (browser !== null) return browser;

  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    userDataDir: './user_data', // `userDataDir` to keep login via sessions
    ...options,
  } as LaunchOptions);

  return browser;
};

const closeBrowser = async () => {
  if (browser != null) {
    await browser.close();
    browser = null;
  }
};

const newPage = async (options = {}) => {
  const b = await setupBrowser(options);
  const page = await b.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  return page;
};

const randomDelay = (page) => page.waitForTimeout(randomNormalNumber(2000));

export { closeBrowser, newPage, randomDelay };
