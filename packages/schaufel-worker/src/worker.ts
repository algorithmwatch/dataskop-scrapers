/* eslint-disable no-console */
import { a } from '@algorithmwatch/schaufel-ab';
import {
  b64encode,
  getTiktokVideoMeta,
  idToTiktokUrl,
} from '@algorithmwatch/schaufel-core';
import {
  getIdFromUrl,
  prependTiktokSuffix,
} from '@algorithmwatch/schaufel-wrangle';
import https from 'https';
import _ from 'lodash';
import process from 'process';
import { get } from './mullvad';

// FIXME: Use 3rd-party http client
const request = (
  url: string,
  method = 'get',
  headers: any,
  data = null,
): Promise<[string | JSON, number]> => {
  const urlObj = new URL(url);

  if (data !== null) {
    data = JSON.stringify(data);

    headers = {
      ...headers,
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    };
  }

  return new Promise((resolve, reject) => {
    const req = https
      .request(
        {
          method,
          hostname: urlObj.hostname,
          path: urlObj.pathname,
          headers,
          timeout: 60 * 1000,
        },
        (res) => {
          res.setEncoding('utf8');
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () =>
            resolve([
              res.headers['content-type'] == 'application/json'
                ? JSON.parse(body)
                : body,
              res.statusCode,
            ]),
          );
        },
      )
      .on('error', (e) => {
        console.error(e);
        reject(e);
      });

    req.on('timeout', () => {
      console.log('timeout');
      req.destroy();
      reject();
    });

    if (data !== null) req.write(data);
    req.end();
  });
};

const updateBackend = (path, method, data = null) => {
  return request(
    process.env.PLATFORM_URL + '/api/' + path + '/',
    method,
    {
      'Content-Type': 'application/json',
      'X-DataSkop-Api-Key': process.env.API_KEY,
      Authorization: `Basic ${b64encode(
        `user:${process.env.SERIOUS_PROTECTION}`,
      )}`,
    },
    data,
  );
};

const normalizeObject = (x) => {
  return Object.fromEntries(Object.entries(x).sort());
};

const addVideoDumpJob = async (data) => {
  const videoUrls = data['Activity']['Video Browsing History']['VideoList'].map(
    (x) => x.VideoLink ?? x.Link,
  );
  const videoIds = _.uniq(videoUrls).map(getIdFromUrl).map(prependTiktokSuffix);

  const req = await updateBackend('lookupjobs', 'post', {
    todo: videoIds,
    log: 'add dump',
  });
  console.log(`succesfully added ${videoIds.length} items from a dump`);
  return null;
};

const workOnDoneData = async (data: any) => {
  console.log('Workig on `input_done`');

  const allKeys = Object.keys(data.input_done);

  // Check if done data is valid, at max check for 10 items
  const numProbes = _.min([_.ceil(allKeys.length / 100), 10]);

  console.log(`Number of probes: ${numProbes}`);

  const probeKeys = _.sampleSize(allKeys, numProbes);
  const probes = _.pick(data.input_done, probeKeys);
  const p_ids = Object.keys(probes);

  console.log(`First in p_id: ${p_ids[0]}, length of p_ids: ${p_ids.length}`);

  const p_results = await getTiktokVideoMeta(
    p_ids.map(idToTiktokUrl),
    true,
    true,
    true,
    3000,
    console.log,
    get,
    15,
  );

  const staticAttributes = [
    'result.id',
    'result.desc',
    'result.createTime',
    'result.authorId',
    'result.video.duration',
    'result.music.id',
  ];
  // Not static!
  // 'result.author',
  // 'result.nickname',
  // 'result.music.original'
  // 'result.music.title'
  // 'result.music.authorName'
  // 'result.diversificationLabels'

  let numNotIdentical = 0;
  let log = '';

  for (const [id, resOrg] of _.zip(p_ids, p_results)) {
    const res = _.pick(normalizeObject(resOrg), staticAttributes);
    const pr = _.pick(normalizeObject(probes[id]), staticAttributes);

    if (!_.isEqual(res, pr)) {
      numNotIdentical += 1;
      log +=
        'input_done: error (1) with\n' +
        JSON.stringify(res) +
        '\n' +
        JSON.stringify(pr) +
        '\n';
      continue;
    }

    const statsRes = _.pick(res, 'result.stats');
    const statsProbes = _.pick(pr, 'result.stats');
    for (const x of Object.keys(statsRes)) {
      // Fresher data should be equal or larger that old data.
      // This may not be true if likes get removed etc, but we ignore this edge case.
      if (statsRes[x] < statsProbes[x]) {
        numNotIdentical += 1;
        log +=
          'input_done: error (2) with\n' +
          JSON.stringify(res) +
          '\n' +
          JSON.stringify(pr) +
          '\n';
        break;
      }
    }
  }

  const results = Object.fromEntries(
    Object.entries(data.input_done).map((x) => [x[0], a(x[1])]),
  );

  // 50% error allowed
  const allGood = numNotIdentical < numProbes * 0.5;
  log += `\nerror: ${numNotIdentical}\n`;

  if (allGood) log += `\ninput_done: passed all checks\n`;
  else log += `\ninput_done: failed!\n`;

  const updateData = {
    log,
    done: true,
    error: !allGood,
  };

  if (allGood) updateData['results'] = results;

  const updateResp = await updateBackend(
    `lookupjobs/${data.id}`,
    'put',
    updateData,
  );

  console.log(
    'Done working on `input_done`, update backend status: ' + updateResp[1],
  );
};

const workOnTodo = async (data) => {
  // TODO: Improve error handling
  console.log('Workig on `input_todo`');

  // Scrape new data and upload it
  const CHUNK_SIZE = 10;

  let numDoneIds = 0;
  // check if valid
  const ids: string = data.input_todo;
  for (const c_ids of _.chunk(ids, CHUNK_SIZE)) {
    const results = await getTiktokVideoMeta(
      c_ids.map(idToTiktokUrl),
      true,
      true,
      true,
      0,
      console.log,
      get,
      15,
    );
    numDoneIds += c_ids.length;

    const toUploads = _.zipObject(c_ids, results.map(a));
    await updateBackend(`lookupjobs/${data.id}`, 'put', {
      results: toUploads,
      log: `add ${results.length} items`,
      done: numDoneIds === ids.length,
    });
  }
  console.log('Done working on `input_todo`');
};

const startJob = async (): Promise<void> => {
  // Fetch and execute a new job
  const [data, status] = (await updateBackend('lookupjobs', 'get')) as [
    JSON,
    number,
  ];

  if (status == 204) {
    console.log('No job available');
    return;
  }

  if (status !== 200) {
    throw new Error(
      `Something is wrong with the backend, received the following status code: ${status}`,
    );
  }

  console.log(`Working on job ${data['id']}`);

  try {
    if ('input_done' in data && data['input_done']) {
      return workOnDoneData(data);
    }

    if ('input_todo' in data && data['input_todo']) {
      return workOnTodo(data);
    }
  } catch (error) {
    console.error(`error with ${error}`);
    await updateBackend(`lookupjobs/${data['id']}`, 'put', {
      log: `error with ${error}`,
      error: true,
    });
  }

  throw new Error('Job could not get processed');
};

const addVideoJob = async (videoIds: (string | number)[]) => {
  const req = await updateBackend('lookupjobs', 'post', {
    todo: videoIds.map(prependTiktokSuffix),
    log: 'add dump',
  });
  return req;
};

export { addVideoDumpJob, addVideoJob, startJob };
