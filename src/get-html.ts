import puppeteer from 'puppeteer';
import { HarkeInvalidUrl } from './errors';
import { isValidUrl } from './util';

let page = null;

const setupBrowser = async () => {
  if (page !== null) return page;
  const browser = await puppeteer.launch({
    headless: false,
  });
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  page = await browser.newPage();
  return page;
};

async function getHtml(url: string) {
  if (!isValidUrl(url)) throw HarkeInvalidUrl;

  const page = await setupBrowser();

  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  await page.waitForTimeout(5000);
  const html = await page.content();

  return html;
}

export { getHtml };
