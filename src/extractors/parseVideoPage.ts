import {
  Channel,
  ParserFieldParams,
  ParserFieldsSchemaVideoPage,
  ParserResult,
  RecommendedVideo,
} from '../types';
import Parser, { HarkeParsingError } from '../parser';
import {
  getVideoIdFromUrl,
  convertISO8601ToMs,
  extractNumberFromString,
  convertPercentageStringToNumber,
} from '../parser/utils';

function parseVideoPage(html: string): ParserResult {
  const schema: ParserFieldsSchemaVideoPage = {
    id({ $ }: ParserFieldParams): string {
      const urlValue = $('link[rel=canonical]').attr('href');
      if (!urlValue) throw new HarkeParsingError();

      const videoId = getVideoIdFromUrl(urlValue);
      if (!videoId) throw new HarkeParsingError('invalid video id');

      return videoId;
    },

    title({ linkedData }: ParserFieldParams): string {
      if (!linkedData) throw new HarkeParsingError('invalid title');

      try {
        return linkedData.name;
      } catch {
        throw new HarkeParsingError('invalid title');
      }
    },

    description({ linkedData }: ParserFieldParams): string {
      if (!linkedData) throw new HarkeParsingError('invalid description');

      return linkedData.description || '';
    },

    duration({ linkedData }: ParserFieldParams): number {
      if (!linkedData) throw new HarkeParsingError('invalid duration');

      const value = convertISO8601ToMs(linkedData.duration);
      if (value === 0) throw new HarkeParsingError('invalid duration');

      return value;
    },

    channel({ $ }: ParserFieldParams): Channel {
      const channelLinkEl = $('#upload-info a[href^="/channel/"]').first();

      return {
        id: (() => {
          const channelUrl = channelLinkEl.attr('href');
          if (!channelUrl) throw new HarkeParsingError('invalid channel');
          const channelUrlChunks = channelUrl.split('/');

          return channelUrlChunks[channelUrlChunks.length - 1];
        })(),

        name: (() => {
          return channelLinkEl.text() || '';
        })(),

        url: (() => {
          return channelLinkEl.attr('href') || '';
        })(),
      };
    },

    uploadDate({ linkedData }: ParserFieldParams): Date {
      if (!linkedData) throw new HarkeParsingError('invalid upload date');

      try {
        const uploadDateValue = linkedData.uploadDate;
        const dateParts = uploadDateValue
          .split('-')
          .map((s: string) => Number(s));
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      } catch {
        throw new HarkeParsingError(JSON.stringify(linkedData));
      }
    },

    viewCount({ linkedData }: ParserFieldParams): number {
      if (!linkedData) throw new HarkeParsingError();

      const number = Number(linkedData.interactionCount);
      return number;
    },

    upvotes({ $ }: ParserFieldParams): number {
      const ariaLabelText = $('#sentiment #tooltip')
        .first()
        .text()
        .split(' / ')[0];

      if (ariaLabelText === null) throw new HarkeParsingError();

      const number = extractNumberFromString(ariaLabelText);
      if (number === null) throw new HarkeParsingError();

      return number;
    },

    downvotes({ $ }: ParserFieldParams): number {
      const ariaLabelText = $('#sentiment #tooltip')
        .first()
        .text()
        .split(' / ')[1];

      if (ariaLabelText === null) throw new HarkeParsingError();

      const number = extractNumberFromString(ariaLabelText);
      if (number === null) throw new HarkeParsingError();

      return number;
    },

    category({ linkedData }: ParserFieldParams): string {
      if (!linkedData) throw new HarkeParsingError();

      try {
        return linkedData.genre;
      } catch {
        throw new HarkeParsingError();
      }
    },

    isLive({ linkedData }: ParserFieldParams): boolean {
      if (!linkedData) throw new HarkeParsingError();

      if (!('publication' in linkedData)) return false;

      // not sure in what situations the array may contain multiple objects
      for (const p of linkedData.publication) {
        if ('isLiveBroadcast' in p)
          return p.isLiveBroadcast && !('endDate' in p);
      }
      throw new HarkeParsingError();
    },

    wasLive({ linkedData }: ParserFieldParams): boolean {
      if (!linkedData) throw new HarkeParsingError();

      if (!('publication' in linkedData)) return false;

      // not sure in what situations the array may contain multiple objects
      for (const p of linkedData.publication) {
        if ('isLiveBroadcast' in p) return p.isLiveBroadcast && 'endDate' in p;
      }
      throw new HarkeParsingError();
    },

    hashtags({ $ }: ParserFieldParams): string[] {
      const result: string[] = [];

      $('a[href^="/hashtag/"]').each((idx, el: cheerio.Element) => {
        const parentEl = el as cheerio.TagElement;
        const childNode = parentEl.firstChild;

        if (
          !childNode ||
          childNode.type !== 'text' ||
          !childNode.data ||
          result.includes(childNode.data)
        )
          return;

        result.push(childNode.data);
      });

      return result;
    },

    clarifyBox({ $ }: ParserFieldParams): string {
      return $('#clarify-box').text().trim();
    },

    recommendedVideos({ $ }: ParserFieldParams): RecommendedVideo[] {
      const result: RecommendedVideo[] = [];

      $('#related ytd-compact-video-renderer').each(
        (idx, el: cheerio.Element) => {
          const $el = $(el);
          const videoUrl = $el.find('.metadata > a').attr('href');
          const id = videoUrl ? getVideoIdFromUrl(videoUrl) : null;
          const title = $el.find('.metadata #video-title').text().trim();
          // const duration = convertHHMMSSDurationToMs(
          //   $el.find('.ytd-thumbnail-overlay-time-status-renderer').text()
          // )
          const channelName = $el
            .find('.metadata .ytd-channel-name #text')
            .text();
          const percWatchedValue = $el
            .find(
              '.ytd-thumbnail .ytd-thumbnail-overlay-resume-playback-renderer',
            )
            .css('width');
          const percWatched = percWatchedValue
            ? convertPercentageStringToNumber(percWatchedValue)
            : 0;

          if (!id || !title || !channelName) return;

          result.push({
            id,
            title,
            channelName,
            percWatched,
          });
        },
      );

      if (!result.length) throw new HarkeParsingError(JSON.stringify(result));

      return result;
    },
  };

  const parser = new Parser('video-page', html, schema);

  const result = parser.result;

  // some fields do not apply to live videos
  if (result.fields.isLive) {
    const filtered = result.errors.filter(
      (x) => !['duration'].includes(x.field),
    );
    result.errors = filtered;
  }
  return result;
}

export { parseVideoPage };
