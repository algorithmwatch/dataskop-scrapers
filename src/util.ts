/**
 * Check if provided string is a valid url
 * Sourced from: https://stackoverflow.com/a/3809435/5732518
 * @param url the URL string
 */
const urlPattern = /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;

export function isValidUrl(url: string): boolean {
  url = url.trim();
  return urlPattern.test(url);
}
