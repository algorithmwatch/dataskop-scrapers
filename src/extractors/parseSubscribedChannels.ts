import {
  ParserFieldParams,
  ParserFieldsSchemaSubscribedChannels,
  ParserResult,
  SubscribedChannel,
} from '../types';
import { parse } from '../parse';
import { extractNumberFromString } from '../utils';

function parseSubscribedChannels(html: string): ParserResult {
  const schema: ParserFieldsSchemaSubscribedChannels = {
    channels({ $ }: ParserFieldParams): SubscribedChannel[] {
      const result: SubscribedChannel[] = [];

      $('#contents #content-section').each((idx, el: cheerio.Element) => {
        const $el = $(el);

        const channelName = $el.find('#channel-title #text').text();
        const channelUrl = $el.find('a#main-link').attr('href');
        const videoCount = extractNumberFromString(
          $el.find('#video-count').text(),
        );
        const subscriberCount = $el.find('#subscribers').text();
        const description = $el.find('#description').text();
        const notificationsEnabledAriaLabel = $el
          .find(
            'a.ytd-subscription-notification-toggle-button-renderer button#button svg path',
          )
          .attr('d');

        const notificationsEnabled =
          notificationsEnabledAriaLabel ===
          'M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z';

        const resultItem: SubscribedChannel = {
          channelName,
          channelUrl,
          videoCount,
          subscriberCount,
          description,
          notificationsEnabled,
        } as SubscribedChannel;

        result.push(resultItem);
      });

      return result;
    },
  };

  return parse('user-subscribed-channels', html, schema);
}

const subscribedChannelsUrls = 'https://www.youtube.com/feed/channels';

export { subscribedChannelsUrls, parseSubscribedChannels };
