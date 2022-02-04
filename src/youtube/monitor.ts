import { constants } from '@algorithmwatch/harke';
import { JSONFile, Low } from 'lowdb';
import { getPlaylist } from './get-html';

type ScrapeResult = {
  result: any;
  scrapedAt: Date;
  label: string;
};

type Data = {
  results: ScrapeResult[];
};

const monitorDeNews = async (dbLocation: string): Promise<void> => {
  const adapter = new JSONFile<Data>(dbLocation);
  const db = new Low<Data>(adapter);

  for (const pl of constants.newsPlaylists.de) {
    const result = await getPlaylist(pl.id);

    await db.read();
    db.data ||= { results: [] };
    const { results } = db.data;
    results.push({
      result,
      scrapedAt: new Date(),
      label: pl.label + ' / ' + pl.id,
    });

    await db.write();
  }
  return;
};

export { monitorDeNews };
