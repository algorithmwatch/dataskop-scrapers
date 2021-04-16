import {
  ParserFieldParams,
  ParserFieldsSchemaWatchHistory,
  ParserResult,
  WatchlistVideo,
  WatchlistVideoUnavailable,
} from '../types'
import { URLSearchParams } from 'url'
import Parser, { HarkeParsingError } from '../parser'
import {
  convertHHMMSSDurationToMs,
  convertPercentageStringToNumber,
} from '../parser/utils'


export default function parseWatchHistoryPage (html: string): ParserResult {

  const schema: ParserFieldsSchemaWatchHistory = {

    videos ({ $ }: ParserFieldParams): (WatchlistVideo|WatchlistVideoUnavailable)[] {
      const result: (WatchlistVideo|WatchlistVideoUnavailable)[] = []

      // parsing date-video chunks
      $('#contents .ytd-section-list-renderer').each((idx, chunkEl: cheerio.Element) => {
        const $chunkEl = $(chunkEl)
        const watchedAt = $chunkEl.find('#title').text()


        $chunkEl.find('ytd-video-renderer').each((idx, el: cheerio.Element) => {
          const $el = $(el)
          const href = $el.find('a#thumbnail').attr('href')
          if (href == null) return

          const params = new URLSearchParams(href.replace('/watch?', ''))
          const id = params.get('v');
          let title = $el.find('#video-title').text()
          const description = $el.find('#description-text').text() || ''
          const duration = convertHHMMSSDurationToMs(
            $el.find('.ytd-thumbnail-overlay-time-status-renderer:not([hidden])').text()
          )
          let channelName = $el.find('.ytd-channel-name a').text()
          const channelUrl = $el.find('.ytd-channel-name a').attr('href')
          const thumbnailUrl = $el.find('a#thumbnail img').attr('src')
          const percWatchedValue = $el.find('.ytd-thumbnail .ytd-thumbnail-overlay-resume-playback-renderer').css('width')
          const percWatched = percWatchedValue ? convertPercentageStringToNumber(percWatchedValue) : 0

          // trim strings
          title = title && title.trim()
          channelName = channelName && channelName.trim()

          // push video
          // check if video is deletec and has default thumbnail
          if (
            id &&
            !duration &&
            !channelName &&
            !channelUrl &&
            title.startsWith('[') &&
            thumbnailUrl === 'https://i.ytimg.com/img/no_thumbnail.jpg'
          ) {
            result.push({ id, unavailable: true })
          } if (
            !id ||
            !title ||
            !duration ||
            !channelName ||
            !channelUrl ||
            !percWatched
          ) {
            return
          } else {
            result.push({
              id,
              title,
              description,
              duration,
              channelName,
              channelUrl,
              watchedAt,
              percWatched
            })
          }

        })
      })

      if (!result.length) throw new HarkeParsingError()

      return result
    },

  }

  const parser = new Parser(
    'user-watch-history',
    html,
    schema
  )

  return parser.result
}