import fs from 'fs'
import parseVideoPage from '../../src/extractors/parseVideoPage'
import { ParserResult, Video } from '../../src/types'


describe('parseVideoPage result', () => {
  let videoPageHtml: string
  let parsedResult: ParserResult

  beforeAll(() => {
    // testing
    const filePath = 'test/html/video_page_no_auth.html'
    videoPageHtml = fs.readFileSync(filePath).toString()
    parsedResult = parseVideoPage(videoPageHtml)
  })

  // test('throws error when providing invalid input', () => {
  //   expect(() => parseVideoPage('asdasd')).toThrow(HarkeParsingError)
  // })

  test('has video id', () => {
    expect(parsedResult.fields.id).toMatch(/^[A-Za-z0-9_-]{11}$/)
  })

  test('has video title', () => {
    expect(parsedResult.fields.title.length).toBeGreaterThan(1)
  })

  test('has empty or filled video description string', () => {
    const descriptionLength = parsedResult.fields.description.length
    expect(descriptionLength >= 0).toBeTruthy()
  })

  test('has video duration greater than zero', () => {
    expect(parsedResult.fields.duration).toBeGreaterThan(0)
  })

  describe('Channel', () => {

    test('has id', () => {
      expect(parsedResult.fields.channel.id).toMatch(/^[A-Za-z0-9_-]{10,}$/)
    })

    test('has name', () => {
      expect(parsedResult.fields.channel.name.length).toBeGreaterThan(1)
    })

    test('has URL', () => {
      expect(parsedResult.fields.channel.url).toMatch(/^\/channel\/.+/)
    })
  })

  test('has upload date after Youtube launch date and before now', () => {
    const youtubeLaunchDate = new Date(2005, 11, 15)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    expect(parsedResult.fields.uploadDate > youtubeLaunchDate).toBe(true)
    expect(parsedResult.fields.uploadDate < tomorrow).toBe(true)
  })

  test('has upvotes equal or greater than zero', () => {
    expect(parsedResult.fields.upVotes).toBeGreaterThanOrEqual(0)
  })

  test('has downvotes equal or greater than zero', () => {
    expect(parsedResult.fields.downVotes).toBeGreaterThanOrEqual(0)
  })

  test('has category', () => {
    expect(parsedResult.fields.category.length).toBeGreaterThan(1)
  })

  test('has isLiveContent boolean', () => {
    expect(parsedResult.fields.isLiveContent).toBe(false)
  })

  test('has hashtags', () => {
    const hashtagsArray = parsedResult.fields.hashtags
    expect(hashtagsArray).toContain('#TheOffice')
    expect(hashtagsArray).toContain('#USA')
    expect(hashtagsArray).toContain('#PeacockTV')
  })
  test('has recommended videos', () => {
    const videosArray = parsedResult.fields.recommendedVideos
    expect(videosArray.every((x: Object) => Object.keys(x).length === 4)).toBe(true)
  })

})