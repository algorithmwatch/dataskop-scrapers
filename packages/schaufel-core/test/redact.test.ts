import _ from 'lodash';

import { redactTiktokDump } from '../src/redact';
import data from './data/filter8000-22-07-2022.json';

describe('filter8000 dump from 22-07-2022', () => {
  let redactedData: any;
  const origData = _.cloneDeep(data);

  beforeAll(() => {
    redactedData = redactTiktokDump(data);
    console.log(JSON.stringify(redactedData['Direct Messages'], null, 2));
    console.log(JSON.stringify(redactedData['Comment'], null, 2));
  });

  test('information gets removed', () => {
    expect(redactedData['Tiktok Shopping']).toBeGreaterThan(0);

    expect(
      redactedData['Comment']['Comments']['CommentsList']
        .map(
          (x) =>
            _.isInteger(x.Comment) ||
            x.Comment.startsWith('https://www.tiktok'),
        )
        .includes(false),
    ).toBe(false);

    expect(
      (
        _.flatten(
          Object.values(
            redactedData['Direct Messages']['Chat History']['ChatHistory'],
          ),
        ) as any[]
      )
        .map(
          (x) =>
            _.isInteger(x.Content) ||
            x.Content.startsWith('https://www.tiktok'),
        )
        .includes(false),
    ).toBe(false);

    console.log(redactedData['Video']);

    expect(
      redactedData['Video']['Videos']['VideoList'][0]['Date'].length,
    ).toBeGreaterThan(5);
    expect(
      redactedData['Video']['Videos']['VideoList'][0]['Likes'].length,
    ).toBe(1);
    expect(
      redactedData['Video']['Videos']['VideoList'][0]['VideoLink'],
    ).toBeFalsy();

    console.log(
      redactedData['Tiktok Live']['Watch Live History']['WatchLiveMap'][
        '7125079105867516677'
      ],
    );

    expect(
      redactedData['Tiktok Live']['Watch Live History']['WatchLiveMap'][
        '7125079105867516677'
      ]['Questions'][0]['QuestionContent'],
    ).toBeGreaterThan(5);

    expect(
      redactedData['Tiktok Live']['Watch Live History']['WatchLiveMap'][
        '7123306309696490246'
      ]['Comments'][0]['CommentContent'],
    ).toBeGreaterThan(5);

    expect(
      redactedData['Tiktok Live']['Watch Live History']['WatchLiveMap'][
        '7110325055493933829'
      ],
    ).toBe(
      origData['Tiktok Live']['Watch Live History']['WatchLiveMap'][
        '7110325055493933829'
      ],
    );

    expect(redactedData['Tiktok Live']['Go Live Settings']).toBeGreaterThan(5);
    expect(redactedData['Tiktok Live']['Go Live History']).toBeGreaterThan(1);

    console.log(redactedData['Profile']);

    expect(
      redactedData['Profile']['Profile Information']['ProfileMap']['userName'],
    ).toBe('filter8000');

    expect(
      Object.values(
        redactedData['Profile']['Profile Information']['ProfileMap'],
      ).every((x) => _.isNumber(x) || x === 'filter8000'),
    ).toBeTruthy();

    console.log(redactedData['Activity']['Purchase History']);

    expect(
      redactedData['Activity']['Purchase History']['BuyGifts']['BuyGifts'],
    ).toStrictEqual(
      origData['Activity']['Purchase History']['BuyGifts']['BuyGifts'],
    );

    expect(
      redactedData['Activity']['Purchase History']['SendGifts']['SendGifts'],
    ).not.toStrictEqual(
      origData['Activity']['Purchase History']['SendGifts']['SendGifts'],
    );

    expect(redactedData['Activity']['Follower List']).not.toStrictEqual(
      origData['Activity']['Follower List'],
    );

    expect(redactedData['Activity']['Login History']).not.toStrictEqual(
      origData['Activity']['Login History'],
    );
  });
});
