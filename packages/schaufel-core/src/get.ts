/* eslint-disable no-console */
import got from 'got';
import _ from 'lodash';
import UserAgent from 'user-agents';
import { delay } from './utils';

const get = async (
  url: string,
  logFun = console.log,
  fetchFun: any = got,
  maxTries = 5,
  keepRaw = false,
) => {
  for (const i of _.range(maxTries)) {
    const userAgent = new UserAgent().toString();

    const options = {
      http2: true,
      headers: { 'User-Agent': userAgent },
    };

    try {
      const resp: any = await fetchFun(url, options);

      const body = resp.rawBody
        ? keepRaw
          ? resp.rawBody
          : resp.rawBody.toString()
        : resp.data;
      if (resp.statusCode == 200 || resp.statusCode == 404)
        return [body, resp.statusCode];
      throw Error(`Faulty status code: ${resp.statusCode}`);
    } catch (error) {
      if (i + 1 == maxTries) throw error;
      else {
        logFun(`Error fetching, retry: ${error.message}`);
        await delay(500 * i);
      }
    }
  }
};

export { get };
