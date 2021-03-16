import { Video } from "../types";

export default function parseVideoPage (
  html: string,
  includeComments: boolean = false
): Video | null {

  const parseVideoId = () => {
    return 'test'
  }

  const result: Video = {
    id: parseVideoId()
    // title
    // description
    // duration
    // channel
    // uploadDate
    // viewCount
    // upvotes
    // downvotes
    // isLiveContent
    // hashtags
    // recommendedVideos
    // commentSection
  }

  return result
}