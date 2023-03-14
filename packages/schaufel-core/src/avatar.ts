import { get } from './get';
import { toBase64 } from './utils';

const pattern = /<img loading="lazy" src="([^"]*)"/;

const scrapeAuthorAvatar = async (
  author: string,
  logFun = console.log,
): Promise<string> => {
  const url = `https://www.tiktok.com/@${author}`;
  const html = await get(url, logFun);

  const result = html.match(pattern);
  const imageUrl = result[1];

  logFun(`Fetchig image ${imageUrl}`);

  const image = await get(imageUrl, logFun, undefined, undefined, true);
  const dataUri = 'data:image/jpeg;base64,' + toBase64(image);
  return dataUri;
};

export { scrapeAuthorAvatar };
