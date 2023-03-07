/* eslint-disable no-console */
import { getTiktokVideoMeta } from '@algorithmwatch/schaufel-core';
import _ from 'lodash';
import memoize from 'memoizee';
import { CurlHttpVersion, curly } from 'node-libcurl';

const _getProxyList = async (logFun) => {
  logFun('Fetching proxy list from mullvad');
  const res = await curly('https://api.mullvad.net/www/relays/all/');
  const resList = res.data;
  return resList.filter((x) => x.type == 'wireguard' && x.active);
};

const getProxyList = memoize(_getProxyList, { maxAge: 30 * 60 * 1000 });

const getProxy = async (logFun): Promise<string> => {
  const list = await getProxyList(logFun);
  const chosen = _.sample(list);
  logFun(`Chosen ${chosen['socks_name']} for proxy`);
  return `socks5://${chosen['socks_name']}:${chosen['socks_port']}`;
};

const get = async (url, options) => {
  const { statusCode, data, headers } = await curly.get(url, {
    FOLLOWLOCATION: true,
    MAXREDIRS: 5,
    SSL_VERIFYPEER: false,
    SSL_VERIFYHOST: false,
    timeout: 20,
    userAgent: options.headers['User-Agent'],
    HTTP_VERSION: CurlHttpVersion.V2PriorKnowledge,
    proxy: await getProxy(console.log),
    httpHeader: ['Origin: https://tiktok.com'],
  });
  return { statusCode, data };
};

const getTiktokVideoMetaProxy = (urls: string[]) => {
  return getTiktokVideoMeta(urls, true, true, true, 0, console.log, get);
};

export { get, getTiktokVideoMetaProxy };
