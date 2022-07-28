import _ from 'lodash';

import { redactTiktokDump } from '../src/redaction';
import data from './data/filter8000-22-07-2022.json';

describe('filter8000 dump from 22-07-2022', () => {
  let redactedData: any;

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
      (_.flatten(
        Object.values(
          redactedData['Direct Messages']['Chat History']['ChatHistory'],
        ),
      ) as any[])
        .map(
          (x) =>
            _.isInteger(x.Content) ||
            x.Content.startsWith('https://www.tiktok'),
        )
        .includes(false),
    ).toBe(false);
  });
});
