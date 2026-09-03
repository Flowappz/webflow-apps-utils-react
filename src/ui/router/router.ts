/* eslint-disable @typescript-eslint/no-explicit-any */
import { routerStore } from '../../utils/stores';

import { get, writable, type Readable, type Writable } from '../stores/store';

/**
 * Custom Client-Side Router (React port — reactive state lives in stores)
 */

// Browser detection utility
const browser = typeof window !== 'undefined';

/** Route configuration object */
export interface RouteConfig {
  /** The path pattern to match (supports parameters like /users/:id) */
  path: string;
  /** Optional component to render when route matches */
  component?: any;
  /** Additional metadata for the route */
  meta?: Record<string, any>;
}

/** Parsed route parameters from URL */
export interface RouteParams {
  [key: string]: string;
}

/** Current location information */
export interface LocationInfo {
  /** Current pathname (e.g., '/users/123') */
  pathname: string;
  /** Current search string (e.g., '?page=1') */
  search: string;
  /** Current hash (e.g., '#section') */
  hash: string;
  /** Complete URL object */
  url: URL;
  /** Parsed route parameters */
  params: RouteParams;
  /** Current query parameters */
  query: URLSearchParams;
}

/** History entry for navigation tracking */
export interface HistoryEntry {
  /** The pathname of the history entry */
  pathname: string;
  /** Timestamp when entry was created */
  timestamp: number;
  /** Optional state data */
  state?: any;
}

/** Router configuration options */
export interface RouterConfig {
  /** Base path for all routes (default: '') */
  basePath?: string;
  /** Whether to use hash-based routing (default: false) */
  hashMode?: boolean;
  /** Initial route to navigate to if no route matches */
  fallbackRoute?: string;
  /** Whether to automatically initialize on browser load */
  autoInit?: boolean;
}

/** Custom Router Class */
export class Router {
  // Reactive state (React port: writable stores replace Svelte 5 runes)
  #currentLocation!: Writable<LocationInfo>;
  #currentRoute = writable<RouteConfig | null>(null);
  #isNavigating = writable(false);
  #history = writable<HistoryEntry[]>([]);

  // Configuration
  #config: Required<RouterConfig>;
  #routes: RouteConfig[] = [];
  #isInitialized = false;
  #appVersionPath = '';

  // Event listeners cleanup
  #cleanup: Array<() => void> = [];

  /** Creates a new Router instance */
  constructor(config: RouterConfig = {}) {
    this.#config = {
      basePath: config.basePath || '',
      hashMode: config.hashMode || false,
      fallbackRoute: config.fallbackRoute || '/',
      autoInit: config.autoInit !== false, // Default to true
    };

    // Initialize location with current browser location
    this.#initializeLocation();

    // Auto-initialize if in browser and autoInit is enabled
    if (browser && this.#config.autoInit) {
      this.init();
    }
  }

  /** Reactive location store (subscribe for updates; see also `useLocation`) */
  get locationStore(): Readable<LocationInfo> {
    return this.#currentLocation;
  }

  /** Reactive current-route store */
  get routeStore(): Readable<RouteConfig | null> {
    return this.#currentRoute;
  }

  /** Reactive navigating store */
  get navigatingStore(): Readable<boolean> {
    return this.#isNavigating;
  }

  /** Reactive history store */
  get historyStore(): Readable<HistoryEntry[]> {
    return this.#history;
  }

  /** Initialize the router and start listening to navigation events */
  init(): void {
    if (!browser || this.#isInitialized) return;

    this.#isInitialized = true;
    this.#setupEventListeners();
    this.#handleCurrentLocation();
  }

  /** Navigate to the root path */
  gotoRootPath(): void {
    const currentFullPath = this.getFullPathname();
    const rootPath = this.#appVersionPath || '/';

    if (currentFullPath === rootPath) {
      return;
    }

    // Navigate to the app version path (e.g., /test) or root (/)
    if (this.#appVersionPath) {
      // Navigate to app version root (e.g., /test)
      window.history.replaceState(null, '', this.#appVersionPath);
      const url = new URL(window.location.href);
      this.#updateLocation(url);
    } else {
      // Navigate to regular root
      this.navigate('/', { replace: true });
    }
  }

  /** Initialize the app version path that will be persisted across all routes */
  initAppVersion(appVersionPath: string): void {
    // Ensure the path starts with / and doesn't end with /
    this.#appVersionPath = appVersionPath.startsWith('/') ? appVersionPath : `/${appVersionPath}`;
    if (this.#appVersionPath.endsWith('/') && this.#appVersionPath.length > 1) {
      this.#appVersionPath = this.#appVersionPath.slice(0, -1);
    }

    // Update current location to include app version path
    if (browser) {
      const currentURL = new URL(window.location.href);
      const pathname = currentURL.pathname;

      // If current path doesn't include the app version path, navigate to it
      if (!pathname.startsWith(this.#appVersionPath)) {
        const newPath = this.#appVersionPath + (pathname === '/' ? '' : pathname);
        this.navigate(newPath, { replace: true });
      } else {
        // Update internal state with current location
        this.#updateLocation(currentURL);
      }
    }
  }

  /** Clean up event listeners and stop the router */
  destroy(): void {
    this.#cleanup.forEach((cleanup) => cleanup());
    this.#cleanup = [];
    this.#isInitialized = false;
  }

  /** Register a route with the router */
  addRoute(route: RouteConfig): void {
    this.#routes.push(route);
  }

  /** Register multiple routes at once */
  addRoutes(routes: RouteConfig[]): void {
    this.#routes.push(...routes);
  }

  /** Navigate to a specified pathname */
  navigate(pathname: string, options: { replace?: boolean; state?: any } = {}): void {
    if (!browser) return;

    this.#isNavigating.set(true);

    try {
      // Prepend app version path if it's set and not already included
      let fullPath = pathname;
      if (this.#appVersionPath && !pathname.startsWith(this.#appVersionPath)) {
        // Handle root path specially
        if (pathname === '/') {
          fullPath = this.#appVersionPath;
        } else {
          fullPath = this.#appVersionPath + pathname;
        }
      }

      const url = this.#createURL(fullPath);

      // Update browser history
      if (options.replace) {
        window.history.replaceState(options.state || null, '', url.toString());
      } else {
        window.history.pushState(options.state || null, '', url.toString());
      }

      // Update internal state
      this.#updateLocation(url, options.state);
    } finally {
      this.#isNavigating.set(false);
    }
  }

  /** Navigate back in history */
  back(): void {
    if (!browser) return;
    window.history.back();
  }

  /** Navigate forward in history */
  forward(): void {
    if (!browser) return;
    window.history.forward();
  }

  /** Get current location information */
  useLocation(): LocationInfo {
    return get(this.#currentLocation);
  }

  /** Get current route information */
  useRoute(): RouteConfig | null {
    return get(this.#currentRoute);
  }

  /** Get navigation history */
  useHistory(): HistoryEntry[] {
    return get(this.#history);
  }

  /** Get navigation state */
  useNavigating(): boolean {
    return get(this.#isNavigating);
  }

  /** Check if a path matches the current location */
  isActive(path: string, exact = false): boolean {
    const currentPath = this.#normalizePath(this.useLocation().pathname);
    const checkPath = this.#normalizePath(path);

    if (exact) {
      return currentPath === checkPath;
    }

    if (checkPath === '/') {
      return currentPath === '/';
    }

    return currentPath === checkPath || currentPath.startsWith(checkPath + '/');
  }

  /** Get the current app version path */
  getAppVersionPath(): string {
    return this.#appVersionPath;
  }

  /** Get the full pathname including app version path */
  getFullPathname(): string {
    if (!browser) return '/';
    return window.location.pathname;
  }

  /** Get the current active path */
  getActivePath(): string {
    // include the app version path
    return this.#appVersionPath + this.useLocation().pathname;
  }

  /** Get the current route parameters */
  getParams(): RouteParams {
    return this.useLocation().params;
  }

  /** Get current query parameters */
  getQuery(): URLSearchParams {
    return this.useLocation().query;
  }

  /** Initialize location state from current browser location */
  #initializeLocation(): void {
    if (!browser) {
      // Provide default values for SSR
      this.#currentLocation = writable<LocationInfo>({
        pathname: '/',
        search: '',
        hash: '',
        url: new URL('https://finsweet.com/'),
        params: {},
        query: new URLSearchParams(),
      });
      return;
    }

    const url = new URL(window.location.href);
    this.#currentLocation = writable<LocationInfo>({
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      url,
      params: {},
      query: new URLSearchParams(url.search),
    });
    this.#updateLocation(url);
  }

  /** Setup event listeners for navigation */
  #setupEventListeners(): void {
    if (!browser) return;

    // Listen for popstate events (back/forward navigation)
    const handlePopState = (event: PopStateEvent) => {
      const url = new URL(window.location.href);
      this.#updateLocation(url, event.state);
    };

    // Listen for hash changes if in hash mode
    const handleHashChange = () => {
      if (this.#config.hashMode) {
        const url = new URL(window.location.href);
        this.#updateLocation(url);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    // Store cleanup functions
    this.#cleanup.push(
      () => window.removeEventListener('popstate', handlePopState),
      () => window.removeEventListener('hashchange', handleHashChange)
    );
  }

  /** Create a URL object from a pathname */
  #createURL(pathname: string): URL {
    if (!browser) return new URL('https://finsweet.com/');

    const baseURL = window.location.origin;
    let fullPath = pathname;

    // Handle base path
    if (this.#config.basePath && !pathname.startsWith(this.#config.basePath)) {
      fullPath = this.#config.basePath + pathname;
    }

    // Handle hash mode
    if (this.#config.hashMode) {
      fullPath = window.location.pathname + '#' + pathname;
    }

    return new URL(fullPath, baseURL);
  }

  /**
   * Update internal location state
   * @private
   */
  #updateLocation(url: URL, state?: any): void {
    let pathname = url.pathname;

    // Remove base path for internal routing
    if (this.#config.basePath && pathname.startsWith(this.#config.basePath)) {
      pathname = pathname.slice(this.#config.basePath.length) || '/';
    }

    // Remove app version path for internal routing
    if (this.#appVersionPath && pathname.startsWith(this.#appVersionPath)) {
      pathname = pathname.slice(this.#appVersionPath.length) || '/';
    }

    // Handle hash mode
    if (this.#config.hashMode) {
      pathname = url.hash.slice(1) || '/';
    }

    // Find matching route and extract parameters
    const match = this.#findMatchingRoute(pathname);

    // Update current location (store the clean pathname without app version)
    this.#currentLocation.set({
      pathname,
      search: url.search,
      hash: url.hash,
      url,
      params: match?.params || {},
      query: new URLSearchParams(url.search),
    });

    // Update current route
    this.#currentRoute.set(match?.route || null);

    // Add to history
    this.#addToHistory(pathname, state);

    // Update the external routerStore whenever route changes
    this.#updateRouterStore(url);
  }

  /**
   * Update the external routerStore with current route information
   * @private
   */
  #updateRouterStore(url: URL): void {
    // Extract the app version ID (hash) from the app version path
    const hash = this.#appVersionPath ? this.#appVersionPath.slice(1) : ''; // Remove leading slash

    routerStore.set({
      hash,
      url,
    });
  }

  /**
   * Find a route that matches the given pathname
   * @private
   */
  #findMatchingRoute(
    pathname: string
  ): { route: RouteConfig; params: RouteParams; isExact: boolean } | null {
    for (const route of this.#routes) {
      const match = this.#matchRoute(route.path, pathname);
      if (match) {
        return {
          route,
          params: match.params,
          isExact: match.isExact,
        };
      }
    }
    return null;
  }

  /**
   * Normalize path by removing trailing slashes (except for root)
   * @private
   */
  #normalizePath(path: string): string {
    if (path === '/') return path;
    return path.replace(/\/+$/, '');
  }

  /**
   * Match a route pattern against a pathname
   * @private
   */
  #matchRoute(pattern: string, pathname: string): { params: RouteParams; isExact: boolean } | null {
    // Normalize both paths to handle trailing slashes
    const normalizedPattern = this.#normalizePath(pattern);
    const normalizedPathname = this.#normalizePath(pathname);

    // Simple exact match
    if (normalizedPattern === normalizedPathname) {
      return { params: {}, isExact: true };
    }

    // Parameter matching
    const patternParts = normalizedPattern.split('/').filter(Boolean);
    const pathnameParts = normalizedPathname.split('/').filter(Boolean);

    // Must have same number of parts for exact match
    if (patternParts.length !== pathnameParts.length) {
      return null;
    }

    const params: RouteParams = {};

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathnamePart = pathnameParts[i];

      if (patternPart.startsWith(':')) {
        // This is a parameter
        const paramName = patternPart.slice(1);
        params[paramName] = decodeURIComponent(pathnamePart);
      } else if (patternPart !== pathnamePart) {
        // Not a match
        return null;
      }
    }

    return { params, isExact: true };
  }

  /**
   * Add entry to navigation history
   * @private
   */
  #addToHistory(pathname: string, state?: any): void {
    const entry: HistoryEntry = {
      pathname,
      timestamp: Date.now(),
      state,
    };

    this.#history.update((history) => {
      const next = [...history];
      // Limit history size to prevent memory issues
      if (next.length >= 100) {
        next.shift();
      }
      next.push(entry);
      return next;
    });
  }

  /**
   * Handle current location on initialization
   * @private
   */
  #handleCurrentLocation(): void {
    if (!browser) return;

    const url = new URL(window.location.href);
    this.#updateLocation(url);
  }
}

/**
 * Create a router instance with the given configuration
 */
export function createRouter(config?: RouterConfig): Router {
  return new Router(config);
}

/**
 * Default router instance for convenience
 */
export const router = createRouter();

// Export hooks and utilities
export * from './hooks';
