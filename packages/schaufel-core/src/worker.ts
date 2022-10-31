/* eslint-disable no-console */

import { a, b } from '@algorithmwatch/schaufel-ab';
import {
  getIdFromUrl,
  prependTiktokSuffix,
} from '@algorithmwatch/schaufel-wrangle/src/index';
import _ from 'lodash';
import process from 'process';
import { getTiktokVideoMeta, idToTiktokUrl } from './scrape';
import { b64encode, request } from './utils';

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

  // Check if done data is valid
  const numProbes = _.min([
    _.ceil(Object.keys(data.input_done).length / 100),
    30,
  ]);
  const probes = _.sampleSize(data.input_done, numProbes);

  const p_ids = Object.keys(probes);
  const p_results = await getTiktokVideoMeta(p_ids.map(idToTiktokUrl));

  const staticAttributes = [
    'result.id',
    'result.desc',
    'result.createTime',
    'result.author',
    'result.nickname',
    'result.authorId',
    'result.video.duration',
    'result.music.id',
    'result.music.title',
    'result.music.authorName',
    'result.music.original',
  ];

  // ignore result.diversificationLabels

  let allGood = true;
  let log = '';

  for (const [id, res] of _.zip(p_ids, p_results)) {
    const pr = b(probes[id]);
    if (
      !_.isEqual(_.pick(res, staticAttributes), _.pick(pr, staticAttributes))
    ) {
      allGood = false;
      log +=
        'input_done: error (1) with\n' +
        JSON.stringify(res) +
        '\n' +
        JSON.stringify(pr) +
        '\n';
      break;
    }

    const statsRes = _.pick(res, 'result.stats');
    const statsProbes = _.pick(pr, 'result.stats');
    for (const x of Object.keys(statsRes)) {
      // Fresher data should be equal or larger that old data.
      // This may not be true if likes get removed etc, but we ignore this edge case.
      if (statsRes[x] < statsProbes[x]) {
        allGood = false;
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

  await updateBackend(`lookupjobs/${data.id}`, 'put', {
    results: allGood ? data.input_done : {},
    log: allGood ? `input_done: passed all checks` : log,
    done: true,
    error: !allGood,
  });
  if (allGood) console.log('Done working on `input_done`');
  else console.log(log);
};

const workOnTodo = async (data) => {
  console.log('Workig on `input_todo`');

  // Scrape new data and upload it
  const CHUNK_SIZE = 10;

  let numDoneIds = 0;
  // check if valid
  const ids: string = data.input_todo;
  for (const c_ids of _.chunk(ids, CHUNK_SIZE)) {
    const results = await getTiktokVideoMeta(c_ids.map(idToTiktokUrl));
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
