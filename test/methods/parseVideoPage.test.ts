import fs from 'fs'
import parseVideoPage from '../../src/extractors/parseVideoPage'
import { Video } from '../../src/types'




describe('parseVideoPage result', () => {
  let videoPageHtml: string
  let parsedResult: Video

  beforeAll(() => {
    videoPageHtml = fs.readFileSync('test/html/video_page_no_auth.html').toString()
    parsedResult = parseVideoPage(videoPageHtml)
  })

  test('has video id', () => {
    expect(parsedResult.id).toMatch(/^[A-Za-z0-9_-]{11}$/)
  })

  test('has video title', () => {
    expect(parsedResult.title.length).toBeGreaterThan(1)
  })

  test('has empty or filled video description string', () => {
    const descriptionLength = parsedResult.description.length
    expect(descriptionLength >= 0).toBeTruthy()
  })

  test('has video duration greater than zero', () => {
    expect(parsedResult.duration).toBeGreaterThan(0)
  })

  describe('Channel', () => {

    test('has id', () => {
      expect(parsedResult.channel.id).toMatch(/^[A-Za-z0-9_-]{10,}$/)
    })

    test('has name', () => {
      expect(parsedResult.channel.name.length).toBeGreaterThan(1)
    })

    test('has URL', () => {
      expect(parsedResult.channel.url).toMatch(/^\/channel\/.+/)
    })
  })

  test('has upload date after Youtube launch date and before now', () => {
    const youtubeLaunchDate = new Date(2005, 11, 15)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    expect(parsedResult.uploadDate > youtubeLaunchDate).toBe(true)
    expect(parsedResult.uploadDate < tomorrow).toBe(true)
  })


})