import _ from 'lodash';

/**
 * Returns the number of characters used in the stringified JSON represenation of the object.
 */
const toStringLength = (obj: any) => JSON.stringify(obj).length;

/**
 * Transforms an array of objects to remove strings from a specific field.
 *
 * Only transforms strings that are not TikTok shares (e.g. video links).
 * Instead of fully removing the string we keep the number of characters.
 */
const textTolength = (messages: any[], field: string) => {
  _(messages)
    .filter((x) => !x[field].startsWith('https://www.tiktokv.com/'))
    .forEach((x) => _.update(x, field, (x) => x.length));
  return messages;
};

const pickArray = (arr: any[], keys: string[]) => {
  // Catch all `null` or `undefined` values for the array
  if (arr == null) return [];
  return arr.map((x) => _.pick(x, keys));
};

const removeChatText = (obj: any) => {
  return _.mapValues(obj, (messages) => textTolength(messages, 'Content'));
};

const removeCommentText = (comments: any[]) => {
  return textTolength(comments, 'Comment');
};

const removeProfile = (obj) => {
  for (const x of [
    'bioDescription',
    'telephoneNumber',
    'profileVideo',
    'profilePhoto',
    'likesReceived',
    'emailAddress',
    'PlatformInfo',
  ]) {
    obj[x] = toStringLength(obj[x]);
  }

  let year = obj.birthDate.split('-');
  if (year.length === 3 && year[2]) year = parseInt(year[2]);
  obj.birthDate = year;
  return obj;
};

const removeLiveText = (obj) => {
  return _.mapValues(obj, (x) => {
    if (x.Questions !== null)
      x.Questions.forEach(
        (xx) => (xx.QuestionContent = xx.QuestionContent.length),
      );

    if (x.Comments !== null)
      x.Comments.forEach(
        (xx) => (xx.CommentContent = xx.CommentContent.length),
      );

    return x;
  });
};

/**
 * Remove certain private information from a TikTok data dump
 */
const redactTiktokDump = (data: any) => {
  const transformations = [
    {
      path: ['Activity', 'Follower List', 'FansList'],
      transform: (x) => pickArray(x, ['Date']),
    },
    {
      path: ['Activity', 'Login History', 'LoginHistoryList'],
      transform: (x) =>
        pickArray(x, ['Date', 'DeviceModel', 'DeviceSystem', 'NetworkType']),
    },
    {
      path: ['Activity', 'Purchase History', 'SendGifts', 'SendGifts'],
      transform: (x) => pickArray(x, ['Date', 'GiftAmount']),
    },
    {
      path: ['Activity', 'Status'],
      transform: toStringLength,
    },
    {
      path: 'Tiktok Shopping',
      transform: toStringLength,
    },
    {
      path: ['Comment', 'Comments', 'CommentsList'],
      transform: removeCommentText,
    },
    {
      path: ['Direct Messages', 'Chat History', 'ChatHistory'],
      transform: removeChatText,
    },
    {
      path: ['Profile', 'Profile Information', 'ProfileMap'],
      transform: removeProfile,
    },
    {
      path: ['Tiktok Live', 'Go Live History'],
      transform: toStringLength,
    },
    {
      path: ['Tiktok Live', 'Go Live Settings'],
      transform: toStringLength,
    },
    {
      path: ['Tiktok Live', 'Watch Live History', 'WatchLiveMap'],
      transform: removeLiveText,
    },
    {
      path: ['Video', 'Videos', 'VideoList'],
      transform: (x) => pickArray(x, ['Date', 'Likes']),
    },
  ];

  for (const { path, transform } of transformations) {
    _.update(data, path, transform);
  }

  return data;
};

export { redactTiktokDump };
