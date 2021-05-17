export interface Channel {
  id?: string;
  name: string;
  url: string;
  description?: string;
  thumbnail?: string;
  videoCount?: number;
}

export interface RecommendedVideo {
  id: string;
  title: string;
  channelName: string;
  percWatched: number;
}

export interface PlaylistVideo {
  id: string;
  title: string;
  duration: number;
  channelName: string;
  channelUrl: string;
}

export interface PlaylistVideoUnavailable {
  id: string;
  unavailable: boolean;
}

export interface WatchlistVideo {
  id: string;
  title: string;
  description: string;
  duration: number;
  channelName: string;
  channelUrl: string;
  watchedAt: string;
  percWatched: number;
}

export interface WatchlistVideoUnavailable {
  id: string;
  unavailable: boolean;
}

export interface SearchHistoryEntry {
  query: string;
  searchedAt: Date;
}

export interface SubscribedChannel {
  channelName: string;
  channelUrl: string;
  description: string;
  videoCount: number;
  subscriberCount: string;
  notificationsEnabled: boolean;
}

export type ParserResultSlug =
  | 'video-page'
  | 'playlist-page'
  | 'user-subscribed-channels'
  | 'user-watch-history'
  | 'user-search-history';

export interface ParserResult {
  slug: ParserResultSlug;
  fields: {
    [key: string]: any;
  };
  errors: Array<{ field: string; message: string }>;
}

export type JsonLinkedData =
  | {
      [key: string]: any;
    }
  | undefined;

export type ParserFieldParams = {
  $: cheerio.Root;
  linkedData: JsonLinkedData;
};
interface VideoPage {
  id: string;
  title: string;
  description: string;
  duration: number;
  channel: Channel;
  uploadDate: Date;
  viewCount: number;
  upvotes: number;
  category: string;
  downvotes: number;
  isLive: boolean;
  wasLive: boolean;
  hashtags: string[];
  clarifyBox: string;
  recommendedVideos: RecommendedVideo[];
}

interface PlaylistPage {
  id: string;
  title: string;
  description: string;
  viewCount: number;
  videoCount: number;
  updatedAtString: string;
  videos: (PlaylistVideo | PlaylistVideoUnavailable)[];
}

interface WatchHistory {
  videos: (WatchlistVideo | WatchlistVideoUnavailable)[];
}
interface SubscribedChannels {
  channels: SubscribedChannel[];
}

export interface SearchHistory {
  queries: SearchHistoryEntry[];
}

export interface ParsedVideoPage extends ParserResult {
  fields: Partial<VideoPage>;
}

export interface ParsedPlaylistPage extends ParserResult {
  fields: Partial<PlaylistPage>;
}
export interface ParsedSubscribedChannels extends ParserResult {
  fields: Partial<SubscribedChannels>;
}
export interface ParsedWatchHistory extends ParserResult {
  fields: Partial<WatchHistory>;
}

export interface ParsedSearchHistory extends ParserResult {
  fields: Partial<SearchHistory>;
}
