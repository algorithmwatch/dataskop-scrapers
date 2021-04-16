/**
 * Check if provided string is a valid url
 * Sourced from: https://stackoverflow.com/a/3809435/5732518
 * @param url the URL string
 */
export function isValidUrl(url: string): boolean {
  url = url.trim();

  const urlPattern = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  if (urlPattern.test(url)) {
    return true;
  }

  return false;
}

// const result = isValidUrl('https://youtu.be/bwRFj52f7Ps')
// result
