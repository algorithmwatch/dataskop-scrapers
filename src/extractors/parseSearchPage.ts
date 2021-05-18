import { parse } from '../parse';
import {
  ParsedSearchResultsVideo,
  ParserFieldParams,
  SearchVideo,
} from '../types';
import { convertHHMMSSDurationToMs, extractNumberFromString } from '../utils';

function parseSearchResultsVideos(html: string): ParsedSearchResultsVideo {
  const schema = {
    query({ $ }: ParserFieldParams): string {
      return $('title').first().text().trim();
    },

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
        const uploadDateString = $el
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
          uploadDateString,
          channelName,
          channelUrl,
        } as SearchVideo);
      });

      return result;
    },
  };

  return parse('search-results-videos', html, schema);
}

const baseSearchUrl = 'https://www.youtube.com/results?search_query=';

// select category 'video'
function buildSearchUrl(query: string, category = 'video'): string {
  let url = `https://www.youtube.com/results?search_query=${query}`;
  if (category === 'video') url += '&sp=EgIQAQ%253D%253D';
  return url;
}

export { parseSearchResultsVideos, baseSearchUrl, buildSearchUrl };
