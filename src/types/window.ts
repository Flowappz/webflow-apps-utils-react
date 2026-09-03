import type { Webflow, WebflowCallback, WF } from './webflow';

/**
 * Window object.
 */
declare global {
  interface Window {
    doNotTrack: string | null;
    dataLayer: Array<
      | {
          event: string;
        }
      | IArguments
    >;
    Webflow?: Webflow | WebflowCallback[];
    wf?: WF;
    isLoadingCustomCodeConfigs: boolean;
  }
}

export type ALLOWED_BREAKPOINTS = '320' | '480' | '768' | '991' | '1280' | '1440' | '1920';
