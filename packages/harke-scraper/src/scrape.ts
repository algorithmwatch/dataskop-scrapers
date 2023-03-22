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
  return scrapeItems(
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
};
export { scrapeYouTubeVideos };
