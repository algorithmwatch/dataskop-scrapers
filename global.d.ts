// URLSearchParams is available globally in Node v10+ so we don't have to import it from node's lib.
// This makes this code run in a browser environment.
declare global {
  const URLSearchParams: any;
}
export {};
