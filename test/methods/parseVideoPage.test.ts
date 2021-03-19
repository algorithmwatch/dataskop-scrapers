import fs from 'fs'
import parseVideoPage from '../../src/extractors/parseVideoPage'
import { ParserResult, Video } from '../../src/types'




describe('parseVideoPage result', () => {
  let videoPageHtml: string
  let parsedResult: ParserResult

  beforeAll(() => {
    videoPageHtml = fs.readFileSync('test/html/video_page_no_auth.html').toString()
  })

  // test('throws error when providing invalid input', () => {
  //   expect(() => parseVideoPage('asdasd')).toThrow(HarkeParsingError)
  // })

  test('has video id', () => {
    parsedResult = parseVideoPage(videoPageHtml)
    expect(parsedResult.fields.id).toMatch(/^[A-Za-z0-9_-]{11}$/)
  })

  test('has video title', () => {
    parsedResult = parseVideoPage(videoPageHtml)
    expect(parsedResult.fields.title.length).toBeGreaterThan(1)
  })

  test('has empty or filled video description string', () => {
    parsedResult = parseVideoPage(videoPageHtml)
    const descriptionLength = parsedResult.fields.description.length
    expect(descriptionLength >= 0).toBeTruthy()
  })

  test('has video duration greater than zero', () => {
    parsedResult = parseVideoPage(videoPageHtml)
    expect(parsedResult.fields.duration).toBeGreaterThan(0)
  })

  describe('Channel', () => {

    beforeAll(() => {
      parsedResult = parseVideoPage(videoPageHtml)
    })

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
    parsedResult = parseVideoPage(videoPageHtml)
    const youtubeLaunchDate = new Date(2005, 11, 15)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    expect(parsedResult.fields.uploadDate > youtubeLaunchDate).toBe(true)
    expect(parsedResult.fields.uploadDate < tomorrow).toBe(true)
  })


})