import { parse } from '../parse';
import {
  ParsedSearchResultsVideo,
  ParserFieldParams,
  SearchVideo,
} from '../types';
import { convertHHMMSSDurationToMs, extractNumberFromString } from '../utils';

function parseSearchResultsVideos(
  html: string,
  query: string,
): ParsedSearchResultsVideo {
  const schema = {
    videos({ $ }: ParserFieldParams): SearchVideo[] {
      const result: SearchVideo[] = [];

      $('#contents > ytd-video-renderer').each((_idx, el) => {
        const $el = $(el);
        const title = $el.find('#video-title').text().trim();
        const description = $el.find('#description-text').text().trim();
        const duration = convertHHMMSSDurationToMs(
          $el
            .find('span.ytd-thumbnail-overlay-time-status-renderer')
            .first()
            .text()
            .trim(),
        );
        const viewCount = extractNumberFromString(
          $el.find('#metadata #metadata-line span').first().text(),
        );
        const uploadedAtString = $el
          .find('#metadata #metadata-line span')
          .last()
          .text();

        const channelName = $el
          .find('.ytd-channel-name a')
          .first()
          .text()
          .trim();
        const channelUrl = $el.find('.ytd-channel-name a').first().attr('href');

        result.push({
          title,
          description,
          duration,
          viewCount,
          uploadedAtString,
          channelName,
          channelUrl,
        } as SearchVideo);
      });

      return result;
    },
  };

  // It's hard / impossible to extract the query from the rendered page.
  // So the query is added via param when calling this function.
  const videoResult = parse('search-results-videos', html, schema);
  videoResult.fields.query = query;
  return videoResult;
}

const baseSearchUrl = 'https://www.youtube.com/results?search_query=';

// select category 'video'
function buildSearchUrl(query: string, category = 'video'): string {
  let url = `https://www.youtube.com/results?search_query=${query}`;
  if (category === 'video') url += '&sp=EgIQAQ%253D%253D';
  return url;
}

export { parseSearchResultsVideos, baseSearchUrl, buildSearchUrl };
