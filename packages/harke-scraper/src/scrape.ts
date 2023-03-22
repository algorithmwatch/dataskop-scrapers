import { parseVideoNoJs } from '@algorithmwatch/harke-parser';
import { scrapeItems } from '@algorithmwatch/scraper';

const parseFun = (html, storeBrokenHtml, logFun) => {
  try {
    return parseVideoNoJs(html);
  } catch (error) {
    logFun(`Failed with: ${error}`);

    throw new Error('Parsing error');
  }
};

const scrapeYouTubeVideos = async (
  videoUrls: string[],
  options: any,
  logFun = console.log,
): Promise<any> => {
  const items = await scrapeItems(
    videoUrls,
    {},
    options,
    {},
    logFun,
    undefined,
    undefined,
    parseFun,
    undefined,
  );
  // The cache is in items[1]
  return items[0];
};
export { scrapeYouTubeVideos };
