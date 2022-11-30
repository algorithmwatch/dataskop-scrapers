import { get } from './mullvad';

const pattern = /<img loading="lazy" src="([^"]*)"/;

const toBase64 = (rawData) => {
  return Buffer.from(rawData, 'binary').toString('base64');
};

const scrapeAuthorAvatar = async (
  author: string,
  logFun = console.log,
): Promise<string> => {
  const url = `https://www.tiktok.com/@${author}`;
  const [html, status] = await get(url, false, logFun);

  const result = html.toString().match(pattern);
  const imageUrl = result[1];

  logFun(`Fetchig image ${imageUrl}`);

  const [image, status2] = await get(imageUrl, false, logFun);
  const dataUri = 'data:image/jpeg;base64,' + toBase64(image);
  return dataUri;
};

export { scrapeAuthorAvatar };
