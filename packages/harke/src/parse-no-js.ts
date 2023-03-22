import cheerio from 'cheerio';
import { convertISO8601ToMs, extractNumberFromString } from './utils';

const makeGetMeta = ($root) => {
  const getMetaContent = (meta) => {
    const result =
      $root(`div#watch7-content meta[itemprop="${meta}"]`)
        .first()
        .attr('content') ||
      $root(`div#watch7-content span[itemprop="${meta}"] link[itemprop="name"]`)
        .first()
        .attr('content');
    return result;
  };
  return getMetaContent;
};

const parseVideoNoJs = (html: string): any => {
  const $root = cheerio.load(html);
  const getMeta = makeGetMeta($root);

  if (getMeta('unlisted') == null) return null;

  const unlisted = getMeta('unlisted') === 'True';
  const viewCount = extractNumberFromString(getMeta('interactionCount') || '0');
  const category = getMeta('genre');
  const publishedAt = getMeta('datePublished');
  const duration = convertISO8601ToMs(getMeta('duration'));
  const author = getMeta('author');
  const title = getMeta('name');

  const result = {
    unlisted,
    viewCount,
    category,
    publishedAt,
    title,
    duration,
    author,
  };

  const reKeywords = /<meta name="keywords" content="([^"]*)">/;
  const matchKeywords = html.match(reKeywords);
  if (matchKeywords && matchKeywords.length >= 2)
    result['keywords'] = matchKeywords[1];

  // Alternative way to get duration with regex
  // const reDuration = /"approxDurationMs":"(\d+)"/;
  // const matchedDuration = html.match(reDuration);
  // if (matchedDuration && matchedDuration.length >= 2)
  //   result['duration'] = parseInt(matchedDuration[1]);

  return result;
};

export { parseVideoNoJs };
