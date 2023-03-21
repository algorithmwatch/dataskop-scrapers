import { HarkeParsingError, parse } from '../parse';
import {
  ParsedSearchHistory,
  ParserFieldParams,
  SearchHistoryEntry,
} from '../types';

function parseSearchHistory(html: string): ParsedSearchHistory {
  const isDateHeader = ($el: cheerio.Cheerio) => $el.hasClass('KpksOc');
  const getDateHeader = ($el: cheerio.Cheerio): false | Date =>
    $el.data('timestamp') ? new Date(Number($el.data('timestamp'))) : false;
  const isSearchQuery = ($el: cheerio.Cheerio) =>
    ($el.hasClass('xDtZAf') &&
      $el.find('.l8sGWb').attr('href')?.includes('?search_query=')) ||
    false;
  const getSearchQuery = ($el: cheerio.Cheerio): false | string =>
    $el.find('.l8sGWb').text();

  const schema = {
    // date header selector: .KpksOc
    // history entry selector: .xDtZAf
    // history entry link selector: .l8sGWb --> href attribute must contain ?search_query=
    queries({ $ }: ParserFieldParams): SearchHistoryEntry[] {
      // parse flat history list
      const result: SearchHistoryEntry[] = [];
      let currentDate: Date;
      $('.KpksOc, .xDtZAf').each((_idx, el: cheerio.Element) => {
        const $el = $(el);

        if (isDateHeader($el)) {
          const date = getDateHeader($el);
          if (date) {
            currentDate = date;
            return;
          }
          throw new HarkeParsingError(`invalid date ${date}`);
        }

        if (isSearchQuery($el)) {
          const queryText = getSearchQuery($el);

          if (queryText) {
            result.push({
              query: queryText,
              searchedAt: currentDate,
            });
          } else {
            throw new HarkeParsingError(`invalid query text ${queryText}`);
          }
        }
      });

      // the result may have a length of 0 if the user didn't search for anything

      return result;
    },
  };

  return parse('user-search-history', html, schema);
}

const searchHistoryUrl =
  'https://myactivity.google.com/activitycontrols/youtube';

export { searchHistoryUrl, parseSearchHistory };
