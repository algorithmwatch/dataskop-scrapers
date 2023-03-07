import { normalizeObject } from '../src/utils';

describe('Check parsing error', () => {
  test('Check parsing error', async () =>
    expect(
      JSON.stringify(normalizeObject({ b: { x: 1, u: 1 }, a: 'peter' })),
    ).toBe(
      JSON.stringify({
        a: 'peter',
        b: { u: 1, x: 1 },
      }),
    ));
});
