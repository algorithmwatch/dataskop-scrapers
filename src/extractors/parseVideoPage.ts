import { Channel, ParserResult, Video } from "../types";
import Parser, { HarkeParsingError } from '../Parser'
import { getVideoIdFromUrl, convertISO8601ToMs, parseNumberFromString } from '../util'


export default function parseVideoPage (
  html: string,
  includeComments: boolean = false
): ParserResult {

  const schema = {

    id ($: cheerio.Root): string {
      const urlValue = $('link[rel=canonical]').attr('href')
      if (!urlValue) throw new HarkeParsingError()
      const videoId = getVideoIdFromUrl(urlValue)
      if (!videoId) throw new HarkeParsingError()

      return videoId
    },

    title ($: cheerio.Root): string {
      const title = $('meta[name=title]').attr('content')
      if (!title) throw new HarkeParsingError()

      return title
    },

    description ($: cheerio.Root): string {
      return $('#description').html() || ''
    },

    duration ($: cheerio.Root): number {
      const durationValue = $('meta[itemprop=duration]').attr('content') || ''
      if (!durationValue) throw new HarkeParsingError()
      const durationNumber = convertISO8601ToMs(durationValue)
      if (durationNumber <= 0) throw new HarkeParsingError()

      return durationNumber
    },

    channel ($: cheerio.Root): Channel {
      const channelLinkEl = $('#upload-info a[href^="/channel/"]')

      return {

        id: (() => {
          const channelUrl = channelLinkEl.attr('href')
          if (!channelUrl) throw new HarkeParsingError()
          const channelUrlChunks = channelUrl.split('/')

          return channelUrlChunks[channelUrlChunks.length - 1]
        })(),

        name: (() => {
          return channelLinkEl.text() || ''
        })(),

        url: (() => {
          return channelLinkEl.attr('href') || ''
        })(),

      }
    },

    uploadDate ($: cheerio.Root): Date {
      const uploadDateValue = $('meta[itemprop=uploadDate]').attr('content')

      if (!uploadDateValue) throw new HarkeParsingError()

      const dateParts = uploadDateValue.split('-').map(s => Number(s))
      return new Date(dateParts[0], dateParts[1] - 1, dateParts[2])

    },

    viewCount ($: cheerio.Root): number {
      const viewCountValue = $('.ytd-video-view-count-renderer').first().text()
      if (!viewCountValue) throw new HarkeParsingError()

      const number = parseNumberFromString(viewCountValue)
      if (!number) throw new HarkeParsingError()

      return number
    },

  }

  const parser = new Parser(
    'video-page',
    html,
    schema
  )


  // return {
  //   id: parser.id(),
  //   title: parser.title(),
  //   description: parser.description(),
  //   duration: parser.duration(),
  //   channel: parser.channel(),
  //   uploadDate: parser.uploadDate(),
  //   viewCount: parser.viewCount(),
  //   // upvotes
  //   // downvotes
  //   // isLiveContent
  //   // hashtags
  //   // recommendedVideos
  //   // commentSection
  // }

  return parser.result
}