export interface Channel {
  id: string
  name: string
  url: string
  description?: string
  thumbnail?: string
  videoCount?: number
}

export interface RecommendedVideo {
  id: string
  title: string
  channelName: string
  percWatched: number
}

export interface ParserResult {
  slug: string,
  fields: {
    [key: string]: any
  }
  errors: string[]
}

export type JsonLinkedData = {
  [key: string]: any
} | undefined

export type ParserFieldParams = {
  $: cheerio.Root
  linkedData: JsonLinkedData
}

export type ParserFieldsSchema = ParserFieldsSchemaVideoPage | ParserFieldsSchemaPaylist

export interface ParserFieldsSchemaVideoPage {
  id: (params: ParserFieldParams) => string
  title: (params: ParserFieldParams) => string
  description: (params: ParserFieldParams) => string
  duration: (params: ParserFieldParams) => number
  channel: (params: ParserFieldParams) => Channel
  uploadDate: (params: ParserFieldParams) => Date
  viewCount: (params: ParserFieldParams) => number
  upvotes: (params: ParserFieldParams) => number
  category: (params: ParserFieldParams) => string
  downvotes: (params: ParserFieldParams) => number
  isLiveContent: (params: ParserFieldParams) => boolean
  hashtags: (params: ParserFieldParams) => string[]
  recommendedVideos: (params: ParserFieldParams) => RecommendedVideo[]
}

export interface ParserFieldsSchemaPaylist {
  id: (params: ParserFieldParams) => string

}