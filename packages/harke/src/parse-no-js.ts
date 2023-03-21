import * as cheerio from 'cheerio';
import { extractNumberFromString } from './utils';

const parseVideoNoJs = (html: string) => {
  const $root = cheerio.load(html);

  if (
    $root('div#watch7-content meta[itemprop="unlisted"]')
      .first()
      .attr('content') == null
  )
    return null;

  const unlisted =
    $root('div#watch7-content meta[itemprop="unlisted"]')
      .first()
      .attr('content') === 'True';

  const viewCountEl = $root(
    'div#watch7-content meta[itemprop="interactionCount"]',
  ).first();
  const viewCount = extractNumberFromString(viewCountEl.attr('content') || '0');

  const categoryEl = $root('div#watch7-content meta[itemprop="genre"]').first();
  const category = categoryEl.attr('content');

  const publishedAtEl = $root(
    'div#watch7-content meta[itemprop="datePublished"]',
  ).first();
  const publishedAt = publishedAtEl.attr('content');

  return { unlisted, viewCount, category, publishedAt };
};

export { parseVideoNoJs };
