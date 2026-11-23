/** A fragment carries interface state without creating another crawlable page URL. */
export function pageStateHref(path: string, state: Record<string, string> | URLSearchParams) {
  return `${path}#${new URLSearchParams(state).toString()}`;
}

/** Keep previously shared query-string links working. */
export function readPageState(location: Pick<Location, "search" | "hash">, keys: readonly string[]) {
  const fragment = new URLSearchParams(location.hash.slice(1));
  const query = new URLSearchParams(location.search);
  const state = new URLSearchParams();
  for (const key of keys) {
    const value = fragment.get(key) ?? query.get(key);
    if (value !== null) state.set(key, value);
  }
  return state;
}
