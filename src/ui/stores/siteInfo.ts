import { writable } from './store';

export type SiteInfo = {
  siteId: string;
  siteName: string;
  shortName: string;
  kind: 'site';
  isPasswordProtected: boolean;
  isPrivateStaging: boolean;
  workspaceId: string;
  workspaceSlug: string;
  domains: Array<{
    url: string;
    lastPublished: string | null;
    default: boolean;
    stage: 'staging' | 'production';
  }>;
};

// Matches the Svelte source: `writable()` with no initial value — the store
// holds `undefined` until first set, but is typed as `Writable<SiteInfo>`.
export const siteInfo = writable<SiteInfo>(undefined as unknown as SiteInfo);
