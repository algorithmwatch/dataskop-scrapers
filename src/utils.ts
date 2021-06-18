import { URLSearchParams } from 'url';
import { JsonLinkedData } from './types';

/**
 * Convert ISO 8601 duration string to milliseconds
 * Sourced from: https://gist.github.com/Fauntleroy/5167736#gistcomment-3649319
 * @param duration String e.g. "P1DT6H11M55S"
 * @returns number Miliseconds
 */
export const convertISO8601ToMs = (duration: string): number => {
  const time_extractor = /^P([0-9]*D)?T([0-9]*H)?([0-9]*M)?([0-9]*S)?$/i;
  const extracted = time_extractor.exec(duration);
  if (extracted) {
    const days = parseInt(extracted[1], 10) || 0;
    const hours = parseInt(extracted[2], 10) || 0;
    const minutes = parseInt(extracted[3], 10) || 0;
    const seconds = parseInt(extracted[4], 10) || 0;
    return (
      days * 24 * 3600 * 1000 +
      hours * 3600 * 1000 +
      minutes * 60 * 1000 +
      seconds * 1000
    );
  }
  return 0;
};

export const extractNumberFromString = (str: string): number | null => {
  const numbers = str?.match(/\d/g);
  if (numbers == null) return null;
  return parseInt(numbers.join(''), 10);
};

/**
 * Extracts "JSON Linked data"
 * See: https://developers.google.com/search/docs/guides/intro-structured-data
 * @param $ Cheerio Root
 * @returns JsonLinkedData
 */
export const extractJsonLinkedData = ($: cheerio.Root): JsonLinkedData => {
  const schemaText = $('script[type=application\\/ld\\+json]#scriptTag')
    .first()
    .html();

  if (!schemaText) return;

  try {
    return JSON.parse(schemaText);
  } catch {
    return;
  }
};

/**
 * Convert duration string in HH:MM:SS format to milliseconds
 * @param durationString e.g. 5:08, 46:11, 19:33:49
 * @returns number Miliseconds
 */
export const convertHHMMSSDurationToMs = (durationString: string): number => {
  const spl = durationString.split(':');
  let milliseconds = 0;
  let hours, minutes, seconds;

  if (spl.length === 2) {
    minutes = +spl[0];
    seconds = +spl[1];
  } else if (spl.length === 3) {
    hours = +spl[0];
    minutes = +spl[1];
    seconds = +spl[2];
  } else {
    return 0;
  }

  if (hours) {
    milliseconds += hours * 3600000;
  }

  if (minutes) {
    milliseconds += minutes * 60000;
  }

  milliseconds += seconds * 1000;

  return milliseconds;
};

export const convertPercentageStringToNumber = (
  percentString: string,
): number => {
  percentString = percentString.trim();

  if (percentString.endsWith('%')) {
    return Number(percentString.slice(0, -1) || null);
  }

  return Number(percentString);
};

export const extractIdFromUrl = (url: string): string => {
  const params = new URLSearchParams(url.split('?')[1]);
  const id = params.get('v');
  if (id === null) return '';
  return id;
};
