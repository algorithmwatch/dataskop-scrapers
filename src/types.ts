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

export interface Comment {
  id: string
  url: string
  text: string
  publishedAt: Date
  upvotes: number
  repliesCount: number
  authorName: string
  authorUrl: string
  isPinned: boolean
}

export interface CommentSection {
  isClosed: boolean
  totalCommentsCount?: number
  comments?: Comment[]
}

export interface Video {
  id: string
  title: string
  description: string
  duration: number
  channel: Channel
  uploadDate: Date
  viewCount: number
  upvotes: number
  category: string
  downvotes: number
  isLiveContent: boolean
  hashtags: string[]
  // recommendedVideos: RecommendedVideo[]
  // commentSection: CommentSection
}

export interface ParserFieldsSchema {
  [key: string]: Function
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

export interface ParserFieldParams {
  $: cheerio.Root
  linkedData: JsonLinkedData
}