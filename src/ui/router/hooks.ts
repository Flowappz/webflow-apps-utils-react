/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useRef } from 'react';

import { useStore } from '../stores/store';
import type { HistoryEntry, LocationInfo, RouteConfig, RouteParams, Router } from './router';

/** React context that carries the Router instance (replaces Svelte's `setContext('router', …)`). */
export const RouterContext = createContext<Router | null>(null);

/**
 * Get the router instance from context
 */
export function useRouter(): Router {
  const router = useContext(RouterContext);
  if (!router) {
    throw new Error('useRouter must be used within a Router component');
  }
  return router;
}

/**
 * Get reactive location information
 */
export function useLocation(): LocationInfo {
  const router = useRouter();
  return useStore(router.locationStore);
}

/**
 * Get reactive current route information
 */
export function useRoute(): RouteConfig | null {
  const router = useRouter();
  return useStore(router.routeStore);
}

/**
 * Get reactive route parameters
 */
export function useParams(): RouteParams {
  return useLocation().params;
}

/**
 * Get reactive query parameters
 */
export function useQuery(): URLSearchParams {
  return useLocation().query;
}

/**
 * Get reactive navigation state
 */
export function useNavigating(): boolean {
  const router = useRouter();
  return useStore(router.navigatingStore);
}

/**
 * Get reactive navigation history
 */
export function useHistory(): HistoryEntry[] {
  const router = useRouter();
  return useStore(router.historyStore);
}

/**
 * Get a navigation function
 */
export function useNavigate(): (pathname: string, options?: { replace?: boolean; state?: any }) => void {
  const router = useRouter();
  return (pathname: string, options?: { replace?: boolean; state?: any }) => {
    router.navigate(pathname, { ...options, replace: true });
  };
}

/**
 * Check if a path is currently active
 */
export function useIsActiveRoute(): (path: string, exact?: boolean) => boolean {
  const router = useRouter();
  // Subscribe to location so callers re-render when the active path changes
  useStore(router.locationStore);
  return (path: string, exact = false) => router.isActive(path, exact);
}

/**
 * Get a function to go back in history
 */
export function useGoBack(): () => void {
  const router = useRouter();
  return () => router.back();
}

/**
 * Get a function to go forward in history
 */
export function useGoForward(): () => void {
  const router = useRouter();
  return () => router.forward();
}

/**
 * Watch for route changes and execute a callback
 */
export function useRouteWatcher(
  callback: (location: LocationInfo, route: RouteConfig | null) => void,
  immediate = false
): void {
  const location = useLocation();
  const route = useRoute();
  const previousPathname = useRef<string | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    // Only call if pathname actually changed (or immediate is true)
    if (immediate || location.pathname !== previousPathname.current) {
      callbackRef.current(location, route);
      previousPathname.current = location.pathname;
    }
  }, [immediate, location, route]);
}

/**
 * Get current route metadata
 */
export function useRouteMeta(): Record<string, any> | undefined {
  const route = useRoute();
  return route?.meta;
}

/**
 * Create a search params helper with reactive updates
 */
export function useSearchParams(): {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
  has: (key: string) => boolean;
  toString: () => string;
  getAll: () => { [k: string]: string };
} {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    get: (key: string) => location.query.get(key),
    set: (key: string, value: string) => {
      const newQuery = new URLSearchParams(location.search);
      newQuery.set(key, value);
      const newPath = location.pathname + '?' + newQuery.toString();
      navigate(newPath, { replace: true });
    },
    delete: (key: string) => {
      const newQuery = new URLSearchParams(location.search);
      newQuery.delete(key);
      const search = newQuery.toString();
      const newPath = location.pathname + (search ? '?' + search : '');
      navigate(newPath, { replace: true });
    },
    has: (key: string) => location.query.has(key),
    toString: () => location.query.toString(),
    getAll: () => Object.fromEntries(location.query.entries()),
  };
}

/**
 * Hook to get the current app version path
 */
export function useAppVersion(): string {
  const router = useRouter();
  return router.getAppVersionPath();
}

/**
 * Hook to get the full pathname including app version
 */
export function useFullPathname(): string {
  const router = useRouter();
  return router.getFullPathname();
}
