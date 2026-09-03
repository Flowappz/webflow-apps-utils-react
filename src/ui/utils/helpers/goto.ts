import { get } from '../../stores/store';
import { routerStore } from '../../../utils/stores';

/**
 * Normalizes a URL path to ensure proper formatting.
 */
const normalizeUrlPath = (path: string, hash: string): URL => {
  const safePath = path.replace(/([^:]\/)\/+/g, '$1');

  const parts = safePath.split(hash);
  const prefix = parts[0];
  const suffix = parts[parts.length - 1];
  const final = prefix + hash + suffix;

  const url = new URL(final, window.location.origin);

  return url;
};

/**
 * Navigates to a new path using the router store hash.
 */
export const goto = (path = '/', state: Record<string, unknown> = {}): void => {
  const { hash = '' } = get(routerStore);

  if (!hash) {
    console.error('goto method found no router hash in the router store. Contact Finsweet support.');
    return;
  }

  const url = normalizeUrlPath(`/${hash}/${path}`, hash);

  // React port: `svelte-routing`'s navigate() is replaced with the History API.
  window.history.pushState({ ...state }, '', url.pathname);
  window.dispatchEvent(new PopStateEvent('popstate', { state: { ...state } }));

  routerStore.update((current) => ({ ...current, url }));
};
