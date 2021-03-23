import { Channel, JsonLinkedData, ParserFieldParams, ParserResult, Video } from "../types";
import Parser, { HarkeParsingError } from '../Parser'
import {
  getVideoIdFromUrl,
  convertISO8601ToMs,
  extractNumberFromString
} from '../util'


type $ = cheerio.Root


export default function parseVideoPage (
  html: string,
  includeComments: boolean = false
): ParserResult {

  const schema = {


    id ({ $ }: ParserFieldParams): string {
      const urlValue = $('link[rel=canonical]').attr('href')
      if (!urlValue) throw new HarkeParsingError()

      const videoId = getVideoIdFromUrl(urlValue)
      if (!videoId) throw new HarkeParsingError()

      return videoId
    },


    title ({ linkedData }: ParserFieldParams): string {
      if (!linkedData) throw new HarkeParsingError()

      try {
        return linkedData.name
      } catch {
        throw new HarkeParsingError()
      }
    },


    description ({ linkedData }: ParserFieldParams): string {
      if (!linkedData) throw new HarkeParsingError()

      return linkedData.description || ''
    },


    duration ({ linkedData }: ParserFieldParams): number {
      if (!linkedData) throw new HarkeParsingError()

      const value = convertISO8601ToMs(linkedData.duration)
      if (value === 0) throw new HarkeParsingError()

      return value
    },


    channel ({ $ }: ParserFieldParams): Channel {
      const channelLinkEl = $('#upload-info a[href^="/channel/"]').first()

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


    uploadDate ({ linkedData }: ParserFieldParams): Date {
      if (!linkedData) throw new HarkeParsingError()

      try {
        const uploadDateValue = linkedData.uploadDate
        const dateParts = uploadDateValue.split('-').map((s: string) => Number(s))
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
      } catch {
        throw new HarkeParsingError()
      }
    },


    viewCount ({ linkedData }: ParserFieldParams): number {
      if (!linkedData) throw new HarkeParsingError()

      const number = Number(linkedData.interactionCount)
      if (!number) throw new HarkeParsingError()

      return number
    },


    upVotes ({ $ }: ParserFieldParams): number {
      const ariaLabelText = $('#top-level-buttons > ytd-toggle-button-renderer').first().find('yt-formatted-string#text').attr('aria-label')
      if (!ariaLabelText) throw new HarkeParsingError()

      const number = extractNumberFromString(ariaLabelText)
      if (!number) throw new HarkeParsingError()

      return number
    },


    downVotes ({ $ }: ParserFieldParams): number {
      const ariaLabelText = $('#top-level-buttons > ytd-toggle-button-renderer:nth-child(2)').find('yt-formatted-string#text').attr('aria-label')
      if (!ariaLabelText) throw new HarkeParsingError()

      const number = extractNumberFromString(ariaLabelText)
      if (!number) throw new HarkeParsingError()

      return number
    },


    category ({ linkedData }: ParserFieldParams): string {
      if (!linkedData) throw new HarkeParsingError()

      try {
        return linkedData.genre
      } catch {
        throw new HarkeParsingError()
      }
    },


    isLiveContent ({ linkedData }: ParserFieldParams): boolean {
      if (!linkedData) throw new HarkeParsingError()

      try {
        return linkedData.publication.isLiveBroadcast === true
      } catch {
        return false
      }
    },


    hashtags ({ $ }: ParserFieldParams): string[] {
      const result: string[] = []

      $('a[href^="/hashtag/"]').each((idx, el: cheerio.Element) => {
        const parentEl = el as cheerio.TagElement
        const childNode = parentEl.firstChild

        if (
          !childNode ||
          childNode.type !== 'text' ||
          !childNode.data ||
          result.includes(childNode.data)
        ) return

        result.push(childNode.data)
      })

      return result
    },

    // recommendedVideos ({ $ }: ParserFieldParams): RecommendedVideo[] {

    // }

  }

  const parser = new Parser(
    'video-page',
    html,
    schema
  )

  return parser.result
}