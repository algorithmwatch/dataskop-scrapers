import puppeteer from 'puppeteer';
import { HarkeInvalidUrl } from '../errors';
import { isValidUrl } from '../util';

export default async function getHtmlFromUrl(url: string) {
  if (!isValidUrl(url)) throw HarkeInvalidUrl;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });
  // wait until video title element is rendered
  await page.waitForSelector('h1.title.ytd-video-primary-info-renderer');
  // await page.waitForTimeout(5000)
  const html = await page.content();
  await browser.close();

  return html;
}
