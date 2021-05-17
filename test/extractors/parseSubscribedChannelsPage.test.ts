import fs from 'fs';
import { parseSubscribedChannels } from '../../src';
import { ParserResult, SubscribedChannel } from '../../src/types';

describe('parseSubscribedChannels result 2021-04-15', () => {
  let playlistPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    const filePath = 'test/html/user-subscribed-channels-2021-04-15.html';
    playlistPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseSubscribedChannels(playlistPageHtml);
    // console.warn('test', parsedResult.fields.channels)
  });

  test('has five channels subscribed', () => {
    expect(Array.isArray(parsedResult.fields.channels)).toBe(true);
    expect(parsedResult.fields.channels.length).toBe(5);
  });

  test('has notifications on for IGN channels', () => {
    const wantedChannel = parsedResult.fields.channels.find(
      (c: SubscribedChannel) => c.channelName === 'IGN',
    );
    expect(wantedChannel.notificationsEnabled).toBe(true);
  });

  test('has notifications off for other channels', () => {
    const othersChannels = parsedResult.fields.channels.filter(
      (c: SubscribedChannel) => c.channelName !== 'IGN',
    );
    expect(
      othersChannels.every(
        (c: SubscribedChannel) => c.notificationsEnabled === false,
      ),
    ).toBe(true);
  });

  test('has channels with correct number of properties', () => {
    const channelArray = parsedResult.fields.channels;
    expect(
      channelArray.every((x: any) => {
        if (Object.keys(x).length !== 6) return false;

        return true;
      }),
    ).toBe(true);
  });
});

describe('parseSubscribedChannels result 2021-04-20', () => {
  let playlistPageHtml: string;
  let parsedResult: ParserResult;

  beforeAll(() => {
    const filePath = 'test/html/user-subscribed-channels-2021-04-20.html';
    playlistPageHtml = fs.readFileSync(filePath).toString();
    parsedResult = parseSubscribedChannels(playlistPageHtml);
    console.warn('test', parsedResult);
  });

  test('has 2 channels subscribed', () => {
    expect(Array.isArray(parsedResult.fields.channels)).toBe(true);
    expect(parsedResult.fields.channels.length).toBe(2);
  });

  test('has channels with correct number of properties', () => {
    const channelArray = parsedResult.fields.channels;
    expect(
      channelArray.every((x: any) => {
        if (Object.keys(x).length !== 6) return false;

        return true;
      }),
    ).toBe(true);
  });
});
