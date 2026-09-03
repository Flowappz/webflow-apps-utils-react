import { beforeEach, describe, expect, it } from 'vitest';

import { get } from '../stores/store';
import { routerStore } from '../../utils/stores';
import { createRouter, Router } from './router';

describe('Router', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('initializes with the current browser location', () => {
    const router = new Router();
    expect(router.useLocation().pathname).toBe('/');
    router.destroy();
  });

  it('navigate() updates browser and internal location', () => {
    const router = createRouter();
    router.navigate('/about');

    expect(window.location.pathname).toBe('/about');
    expect(router.useLocation().pathname).toBe('/about');
    router.destroy();
  });

  it('matches registered routes and extracts params', () => {
    const router = createRouter();
    const userRoute = { path: '/users/:id', meta: { title: 'User' } };
    router.addRoutes([{ path: '/' }, userRoute]);

    router.navigate('/users/42');

    expect(router.useRoute()).toBe(userRoute);
    expect(router.getParams()).toEqual({ id: '42' });
    router.destroy();
  });

  it('decodes URI-encoded params', () => {
    const router = createRouter();
    router.addRoute({ path: '/tags/:tag' });

    router.navigate('/tags/hello%20world');
    expect(router.getParams()).toEqual({ tag: 'hello world' });
    router.destroy();
  });

  it('returns null route when nothing matches (not found)', () => {
    const router = createRouter();
    router.addRoutes([{ path: '/' }, { path: '/about' }]);

    router.navigate('/totally-unknown');

    expect(router.useRoute()).toBeNull();
    expect(router.useLocation().pathname).toBe('/totally-unknown');
    router.destroy();
  });

  it('isActive() supports exact and prefix matching', () => {
    const router = createRouter();
    router.navigate('/about/team');

    expect(router.isActive('/about')).toBe(true);
    expect(router.isActive('/about', true)).toBe(false);
    expect(router.isActive('/about/team', true)).toBe(true);
    expect(router.isActive('/')).toBe(false);
    router.destroy();
  });

  it('normalizes trailing slashes when matching', () => {
    const router = createRouter();
    router.addRoute({ path: '/about/' });

    router.navigate('/about');
    expect(router.useRoute()).not.toBeNull();
    router.destroy();
  });

  it('tracks navigation history', () => {
    const router = createRouter();
    router.navigate('/a');
    router.navigate('/b');

    const history = router.useHistory();
    const pathnames = history.map((entry) => entry.pathname);
    expect(pathnames).toContain('/a');
    expect(pathnames).toContain('/b');
    router.destroy();
  });

  it('exposes query params', () => {
    const router = createRouter();
    router.navigate('/search?q=hello&page=2');

    expect(router.getQuery().get('q')).toBe('hello');
    expect(router.getQuery().get('page')).toBe('2');
    expect(router.useLocation().search).toBe('?q=hello&page=2');
    router.destroy();
  });

  it('responds to popstate events (back/forward)', () => {
    const router = createRouter();
    router.navigate('/first');

    // Simulate browser back
    window.history.replaceState(null, '', '/second');
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(router.useLocation().pathname).toBe('/second');
    router.destroy();
  });

  it('destroy() removes event listeners', () => {
    const router = createRouter();
    router.navigate('/kept');
    router.destroy();

    window.history.replaceState(null, '', '/changed');
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(router.useLocation().pathname).toBe('/kept');
  });

  it('supports app version paths', () => {
    const router = createRouter();
    router.initAppVersion('/v123');

    router.navigate('/about');

    expect(window.location.pathname).toBe('/v123/about');
    // Internal pathname strips the app version prefix
    expect(router.useLocation().pathname).toBe('/about');
    expect(router.getAppVersionPath()).toBe('/v123');
    expect(router.getActivePath()).toBe('/v123/about');

    // The external routerStore receives the version hash
    expect(get(routerStore).hash).toBe('v123');

    router.gotoRootPath();
    expect(window.location.pathname).toBe('/v123');
    router.destroy();
  });

  it('location store notifies subscribers on navigation', () => {
    const router = createRouter();
    const pathnames: string[] = [];
    const unsubscribe = router.locationStore.subscribe((location) => pathnames.push(location.pathname));

    router.navigate('/subscribed');

    expect(pathnames[pathnames.length - 1]).toBe('/subscribed');
    unsubscribe();
    router.destroy();
  });
});
