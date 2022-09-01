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

const removeChatText = (obj: any) => {
  return _.mapValues(obj, (messages) => textTolength(messages, 'Content'));
};

const removeCommentText = (comments: any[]) => {
  return textTolength(comments, 'Comment');
};

/**
 * Remove certain private information from a TikTok data dump
 */
const redactTiktokDump = (data: any) => {
  const transformations = [
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
  ];

  for (const { path, transform } of transformations) {
    _.update(data, path, transform);
  }

  return data;
};

export { redactTiktokDump };
