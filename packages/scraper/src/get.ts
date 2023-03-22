/* eslint-disable no-console */
import { delay } from '@algorithmwatch/utils';
import got from 'got';
import _ from 'lodash';
import UserAgent from 'user-agents';

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
      return body;
    } catch (error) {
      // Don't retry when there is no resource.
      if (error.message.includes(404)) throw error;

      if (i + 1 == maxTries) throw error;
      else {
        logFun(`Error fetching, retry: ${error.message}`);
        await delay(500 * i);
      }
    }
  }
};

export { get };
