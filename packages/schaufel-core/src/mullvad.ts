/* eslint-disable no-console */
import got from 'got';
import _ from 'lodash';
import memoize from 'memoizee';
import { SocksProxyAgent } from 'socks-proxy-agent';
import UserAgent from 'user-agents';
import { delay } from './utils';

const _getProxyList = async (logFun) => {
  logFun('Fetching proxy list from mullvad');
  const res = (await got(
    'https://api.mullvad.net/www/relays/all/',
  ).json()) as any[];
  return res.filter((x) => x.type == 'wireguard' && x.active);
};

const getProxyList = memoize(_getProxyList, { maxAge: 30 * 60 * 1000 });

const getProxy = async (logFun): Promise<string> => {
  const list = await getProxyList(logFun);
  const chosen = _.sample(list);
  logFun(`Chosen ${chosen['socks_name']} for proxy`);
  return `socks5://${chosen['socks_name']}:${chosen['socks_port']}`;
};

const get = async (url, proxy = true, logFun = console.log) => {
  const MAX_TRIES = 5;
  for (const i of _.range(MAX_TRIES)) {
    const userAgent = new UserAgent().toString();

    const options = {
      throwHttpErrors: false,
      http2: true,
      headers: { 'User-Agent': userAgent },
    };

    if (proxy) {
      const tunnel = (new SocksProxyAgent(await getProxy(logFun)) as any).agent;
      options['agent'] = { http: tunnel, https: tunnel, http2: tunnel };
    }
    const resp: any = await got(url, options);
    if (resp.statusCode == 200 || resp.statusCode == 404 || i + 1 == MAX_TRIES)
      return [resp.rawBody.toString(), resp.statusCode];
    else {
      logFun('Error fetching, retry');
      await delay(500 * i);
    }
  }
};

export { get };
