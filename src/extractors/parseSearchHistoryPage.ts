import {
  ParserFieldParams,
  ParserFieldsSchemaSearchHistory,
  ParserResult,
  SearchHistoryEntry,
} from '../types';
import Parser, { HarkeParsingError } from '../parser';

function parseSearchHistoryPage(html: string): ParserResult {
  const isDateHeader = ($el: cheerio.Cheerio) => $el.hasClass('KpksOc');
  const getDateHeader = ($el: cheerio.Cheerio): false | Date =>
    $el.data('timestamp') ? new Date(Number($el.data('timestamp'))) : false;
  const isSearchQuery = ($el: cheerio.Cheerio) =>
    ($el.hasClass('xDtZAf') &&
      $el.find('.l8sGWb').attr('href')?.includes('?search_query=')) ||
    false;
  const getSearchQuery = ($el: cheerio.Cheerio): false | string =>
    $el.find('.l8sGWb').text();

  const schema: ParserFieldsSchemaSearchHistory = {
    // date header selector: .KpksOc
    // history entry selector: .xDtZAf
    // history entry link selector: .l8sGWb --> href attribute must contain ?search_query=
    queries({ $ }: ParserFieldParams): SearchHistoryEntry[] {
      // parse flat history list
      const result: SearchHistoryEntry[] = [];
      let currentDate: Date;
      $('.KpksOc, .xDtZAf').each((idx, el: cheerio.Element) => {
        const $el = $(el);

        if (isDateHeader($el)) {
          const date = getDateHeader($el);
          if (date) {
            currentDate = date;
            return;
          }
          throw new HarkeParsingError();
        }

        if (isSearchQuery($el)) {
          const queryText = getSearchQuery($el);

          if (queryText) {
            result.push({
              query: queryText,
              searchedAt: currentDate,
            });
          } else {
            throw new HarkeParsingError();
          }
        }
      });

      if (!result.length) throw new HarkeParsingError();

      return result;
    },
  };

  const parser = new Parser('user-search-history', html, schema);

  return parser.result;
}

const searchHistoryUrl =
  'https://myactivity.google.com/activitycontrols/youtube';

export { searchHistoryUrl, parseSearchHistoryPage };
