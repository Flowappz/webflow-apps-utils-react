import { describe, expect, it } from 'vitest';

import { breakpointsStore } from './breakpoints';
import { componentInjectErrors } from './componentInjectErrors';
import { showConfirmActionModal } from './showConfirmActionModal';
import { siteInfo, type SiteInfo } from './siteInfo';
import { get } from './store';

describe('simple stores', () => {
  it('breakpointsStore starts empty and is writable', () => {
    expect(get(breakpointsStore)).toEqual({});

    breakpointsStore.set({ 991: 500, 767: 300 });
    expect(get(breakpointsStore)).toEqual({ 991: 500, 767: 300 });

    breakpointsStore.update((current) => ({ ...current, 478: 100 }));
    expect(get(breakpointsStore)[478]).toBe(100);

    breakpointsStore.set({});
  });

  it('componentInjectErrors starts false and toggles', () => {
    expect(get(componentInjectErrors)).toBe(false);

    componentInjectErrors.set(true);
    expect(get(componentInjectErrors)).toBe(true);

    componentInjectErrors.set(false);
  });

  it('showConfirmActionModal starts false and toggles', () => {
    expect(get(showConfirmActionModal)).toBe(false);

    showConfirmActionModal.update((v) => !v);
    expect(get(showConfirmActionModal)).toBe(true);

    showConfirmActionModal.set(false);
  });

  it('siteInfo starts undefined and accepts site data', () => {
    expect(get(siteInfo)).toBeUndefined();

    const info: SiteInfo = {
      siteId: 'site-1',
      siteName: 'Test Site',
      shortName: 'test',
      kind: 'site',
      isPasswordProtected: false,
      isPrivateStaging: false,
      workspaceId: 'ws-1',
      workspaceSlug: 'ws',
      domains: [
        { url: 'test.webflow.io', lastPublished: null, default: true, stage: 'staging' },
      ],
    };

    siteInfo.set(info);
    expect(get(siteInfo)).toEqual(info);
  });

  it('stores notify subscribers on change', () => {
    const seen: boolean[] = [];
    const unsubscribe = componentInjectErrors.subscribe((v) => seen.push(v));

    componentInjectErrors.set(true);
    componentInjectErrors.set(false);

    expect(seen).toEqual([false, true, false]);
    unsubscribe();
  });
});
