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
      if (!videoId) throw new HarkeParsingError();

      return videoId;
    },

    title({ linkedData }: ParserFieldParams): string {
      if (!linkedData) throw new HarkeParsingError();

      try {
        return linkedData.name;
      } catch {
        throw new HarkeParsingError();
      }
    },

    description({ linkedData }: ParserFieldParams): string {
      if (!linkedData) throw new HarkeParsingError();

      return linkedData.description || '';
    },

    duration({ linkedData }: ParserFieldParams): number {
      if (!linkedData) throw new HarkeParsingError();

      const value = convertISO8601ToMs(linkedData.duration);
      if (value === 0) throw new HarkeParsingError();

      return value;
    },

    channel({ $ }: ParserFieldParams): Channel {
      const channelLinkEl = $('#upload-info a[href^="/channel/"]').first();

      return {
        id: (() => {
          const channelUrl = channelLinkEl.attr('href');
          if (!channelUrl) throw new HarkeParsingError();
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
      if (!linkedData) throw new HarkeParsingError();

      try {
        const uploadDateValue = linkedData.uploadDate;
        const dateParts = uploadDateValue
          .split('-')
          .map((s: string) => Number(s));
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      } catch {
        throw new HarkeParsingError();
      }
    },

    viewCount({ linkedData }: ParserFieldParams): number {
      if (!linkedData) throw new HarkeParsingError();

      const number = Number(linkedData.interactionCount);
      if (!number) throw new HarkeParsingError();

      return number;
    },

    upvotes({ $ }: ParserFieldParams): number {
      const ariaLabelText = $('#top-level-buttons > ytd-toggle-button-renderer')
        .first()
        .find('yt-formatted-string#text')
        .attr('aria-label');
      if (!ariaLabelText) throw new HarkeParsingError();

      const number = extractNumberFromString(ariaLabelText);
      if (!number) throw new HarkeParsingError();

      return number;
    },

    downvotes({ $ }: ParserFieldParams): number {
      const ariaLabelText = $(
        '#top-level-buttons > ytd-toggle-button-renderer:nth-child(2)',
      )
        .find('yt-formatted-string#text')
        .attr('aria-label');
      if (!ariaLabelText) throw new HarkeParsingError();

      const number = extractNumberFromString(ariaLabelText);
      if (!number) throw new HarkeParsingError();

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

    isLiveContent({ linkedData }: ParserFieldParams): boolean {
      if (!linkedData) throw new HarkeParsingError();

      try {
        return linkedData.publication.isLiveBroadcast === true;
      } catch {
        return false;
      }
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

      if (!result.length) throw new HarkeParsingError();

      return result;
    },
  };

  const parser = new Parser('video-page', html, schema);

  return parser.result;
}

export { parseVideoPage };
