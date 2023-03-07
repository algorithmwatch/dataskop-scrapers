import { get } from '../src/get';

jest.setTimeout(10000);

describe('get test', () => {
  test('get jf.com', async () => {
    const r = await get('https://johannesfilter.com');
    expect(r[1]).toBe(200);
  });
});
