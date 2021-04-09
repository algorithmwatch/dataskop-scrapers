import fs from 'fs'
import parseSubscribedChannelsPage from '../../src/extractors/parseSubscribedChannelsPage'
import { ParserResult, SubscribedChannel } from '../../src/types'


describe('parseSubscribedChannelsPage result', () => {
  let playlistPageHtml: string
  let parsedResult: ParserResult

  beforeAll(() => {
    const filePath = 'test/html/subscribed_channels_auth.html'
    playlistPageHtml = fs.readFileSync(filePath).toString()
    parsedResult = parseSubscribedChannelsPage(playlistPageHtml)
    // console.warn('test', parsedResult.fields.channels)
  })

  test('has five channels subscribed', () => {
    expect(Array.isArray(parsedResult.fields.channels)).toBe(true)
    expect(parsedResult.fields.channels.length).toBe(5)
  })

  test('has notifications on for IGN channels', () => {
    const wantedChannel = parsedResult.fields.channels
      .find((c: SubscribedChannel) => c.channelName === 'IGN')
    expect(wantedChannel.notificationsEnabled).toBe(true)
  })

  test('has notifications off for other channels', () => {
    const othersChannels = parsedResult.fields.channels
      .filter((c: SubscribedChannel) => c.channelName !== 'IGN')
    expect(othersChannels.every((c: SubscribedChannel) => c.notificationsEnabled === false)).toBe(true)
  })


})