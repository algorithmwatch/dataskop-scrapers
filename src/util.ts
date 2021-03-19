
export const getVideoIdFromUrl = (url: string): string | null => {
  const pattern = /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
  const match = url.match(pattern)

  return match !== null ? match[1] : null
}

// from: https://gist.github.com/Fauntleroy/5167736#gistcomment-3649319
export const convertISO8601ToMs = (duration: string): number  => {
  const time_extractor = /^P([0-9]*D)?T([0-9]*H)?([0-9]*M)?([0-9]*S)?$/i;
  const extracted = time_extractor.exec(duration);
  if (extracted) {
      const days = parseInt(extracted[1], 10) || 0;
      const hours = parseInt(extracted[2], 10) || 0;
      const minutes = parseInt(extracted[3], 10) || 0;
      const seconds = parseInt(extracted[4], 10) || 0;
      return (days * 24 * 3600 * 1000) + (hours * 3600 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
  }
  return 0;
}

export const parseNumberFromString = (str: string): number | null => {
  const numbers = str.match(/\d/g);
  if (numbers == null) return null;
  return parseInt(numbers.join(''), 10);
};