import { scrapeAuthorAvatar } from '../src/avatar';

describe('Avatar', () => {
  test('Avatar scraping', async () => {
    const img = await scrapeAuthorAvatar('filter8000');

    expect(img.length).toBeGreaterThan(100);
  });
});
