import * as cheerio from 'cheerio'
import { Channel, Video } from "../types";
import { getVideoIdFromUrl, convertISO8601ToMs } from '../util'


export default function parseVideoPage (
  html: string,
  includeComments: boolean = false
): Video {

  const $ = cheerio.load(html)

  const parser = {

    id: (): string => {
      const urlValue = $('link[rel=canonical]').attr('href')
      if (!urlValue) return ''

      return getVideoIdFromUrl(urlValue) || ''
    },

    title: (): string => {
      return $('meta[name=title]').attr('content') || ''
    },

    description: (): string => {
      return $('#description').html() || ''
    },

    duration: (): number => {
      const durationValue = $('meta[itemprop=duration]').attr('content') || ''
      return durationValue ? convertISO8601ToMs(durationValue) : 0
    },

    channel: (): Channel => {
      const channelLinkEl = $('#upload-info a[href^="/channel/"]')

      return {

        id: (() => {
          const channelUrl = channelLinkEl.attr('href')
          if (!channelUrl) return ''
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

    uploadDate: (): Date => {
      const uploadDateValue = $('meta[itemprop=uploadDate]').attr('content')

      if (!uploadDateValue) {
        throw new Error('uploadDate selector is broken')
      }

      const dateParts = uploadDateValue.split('-').map(s => Number(s))
      return new Date(dateParts[0], dateParts[1] - 1, dateParts[2])

    },

    viewCount: (): number => {
      const viewCountValue = $('.ytd-video-view-count-renderer').first().text()
      if (!viewCountValue) return 0

      return Number(viewCountValue)
    },
  }

  return {
    id: parser.id(),
    title: parser.title(),
    description: parser.description(),
    duration: parser.duration(),
    channel: parser.channel(),
    uploadDate: parser.uploadDate(),
    viewCount: parser.viewCount(),
    // upvotes
    // downvotes
    // isLiveContent
    // hashtags
    // recommendedVideos
    // commentSection
  }
}