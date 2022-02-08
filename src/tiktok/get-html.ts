import _ from 'lodash';
import { scrollPageToBottom } from 'puppeteer-autoscroll-down';
import CaptchaSolver from 'tiktok-captcha-solver';
import { newPage, randomDelay } from '../browser';
import { isValidUrl, randomNormalNumber } from '../util';

async function newUrl(url: string, flags) {
  if (!isValidUrl(url)) throw 'Invalid url';

  const options = _.pick(flags, 'headless');
  const page = await newPage(options);

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });
  return page;
}

const forYouUrl = 'https://www.tiktok.com/foryou';

async function getForYouFeed(flags): Promise<void> {
  const page = await newUrl(forYouUrl, flags);

  const delay = randomNormalNumber(200);
  const stepsLimit = Math.round((flags.scroll * 1000) / delay);

  await scrollPageToBottom(page, {
    size: randomNormalNumber(100),
    delay,
    stepsLimit,
  });

  const html = await page.content();

  return html;
}

async function login(flags): Promise<void> {
  const loginUrl = 'https://www.tiktok.com/login/phone-or-email/email';
  const page = await newUrl(loginUrl, flags);

  const capSol = new CaptchaSolver(page);

  const [email, pw] = flags.credentials.split(':');

  await randomDelay(page);
  await page.focus(`input[name='email']`);
  await page.keyboard.type(email);

  await randomDelay(page);
  await page.focus(`input[name='password']`);
  await page.keyboard.type(pw);

  await randomDelay(page);
  await page.keyboard.press('Enter');
  await randomDelay(page);

  await capSol.solve();
}

export { login, getForYouFeed };
