import puppeteer from 'puppeteer'
import { HarkeInvalidUrl } from '../errors'
import { isValidUrl } from '../util'

export default async function getHtmlFromUrl (url: string) {

  if (!isValidUrl(url)) throw HarkeInvalidUrl

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2',
  })
  const html = await page.content()
  await browser.close()

  return html
}