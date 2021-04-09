export interface Channel {
  id?: string
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

export interface PlaylistVideo {
  id: string
  title: string
  duration: number
  channelName: string
  channelUrl: string
}

export interface PlaylistVideoUnavailable {
  id: string
  unavailable: boolean
}

export interface WatchlistVideo {
  id: string
  title: string
  description: string
  duration: number
  channelName: string
  channelUrl: string
  watchedAt: string
  percWatched: number
}

export interface WatchlistVideoUnavailable {
  id: string
  unavailable: boolean
}

export interface SubscribedChannel {
  channelName: string
  channelUrl: string
  description: string
  videoCount: number
  subscriberCount: string
  notificationsEnabled: boolean
}

export type ParserResultSlug = 'video-page' | 'playlist-page' | 'user-subscribed-channels' | 'user-watch-history'

export interface ParserResult {
  slug: ParserResultSlug,
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

export interface ParserFieldsSchemaVideoPage {
  id (params: ParserFieldParams): string
  title (params: ParserFieldParams): string
  description (params: ParserFieldParams): string
  duration (params: ParserFieldParams): number
  channel (params: ParserFieldParams): Channel
  uploadDate (params: ParserFieldParams): Date
  viewCount (params: ParserFieldParams): number
  upvotes (params: ParserFieldParams): number
  category (params: ParserFieldParams): string
  downvotes (params: ParserFieldParams): number
  isLiveContent (params: ParserFieldParams): boolean
  hashtags (params: ParserFieldParams): string[]
  recommendedVideos (params: ParserFieldParams): RecommendedVideo[]
}

export interface ParserFieldsSchemaPaylist {
  id (params: ParserFieldParams): string
  title (params: ParserFieldParams): string
  description (params: ParserFieldParams): string
  viewCount (params: ParserFieldParams): number
  videoCount (params: ParserFieldParams): number
  updatedAtString (params: ParserFieldParams): string
  videos (params: ParserFieldParams): (PlaylistVideo|PlaylistVideoUnavailable)[]
}

export interface ParserFieldsSchemaSubscribedChannels {
  channels (params: ParserFieldParams): SubscribedChannel[]
}

export interface ParserFieldsSchemaWatchHistory {
  videos (params: ParserFieldParams): (WatchlistVideo|WatchlistVideoUnavailable)[]
}

export type ParserFieldsSchema = ParserFieldsSchemaVideoPage | ParserFieldsSchemaPaylist | ParserFieldsSchemaSubscribedChannels | ParserFieldsSchemaWatchHistory
