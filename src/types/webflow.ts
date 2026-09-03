/**
 * Callback type for the Webflow.push() method.
 */
export type WebflowCallback = (value?: unknown) => unknown;

export type WebflowModule = 'ix2' | 'commerce' | 'lottie' | 'lightbox' | 'slider' | 'tabs' | 'maps';

interface WebflowCommerce {
  destroy: () => void;
  init: (params: { siteId: string; apiUrl: string }) => void;
}

interface WebflowLightbox {
  preview: () => void;
  design: () => void;
  ready: () => void;
}

interface WebflowSlider {
  preview: () => void;
  design: () => void;
  ready: () => void;
  destroy: () => void;
  redraw: () => void;
}

interface WebflowMaps {
  ready: () => void;
  destroy: () => void;
}

type WebflowTabs = WebflowSlider;

interface WebflowIx2 {
  destroy: () => void;
  init: () => void;
  actions: {
    [key: string]: (...params: unknown[]) => unknown;
  };
  store: {
    dispatch: (param: unknown) => void;
    getState: () => {
      ixData: {
        actionLists: unknown;
        eventTypeMap: unknown;
        events: unknown;
        mediaQueries: unknown;
        mediaQueryKeys: unknown;
      };
      ixElements: {
        [key: string]: unknown;
      };
      ixInstances: {
        [key: string]: unknown;
      };
      ixRequest: {
        [key: string]: unknown;
      };
      ixSession: {
        eventState: {
          [key: string]: unknown;
        };
        [key: string]: unknown;
      };
    };
  };
}

/**
 * Includes methods of the Webflow.js object
 */
export interface Webflow extends Pick<WebflowCallback[], 'push'> {
  destroy: () => void;
  ready: () => void;
  env: () => boolean;
  require: <Key extends WebflowModule>(
    key: Key
  ) =>
    | (Key extends 'commerce'
        ? WebflowCommerce
        : Key extends 'lightbox'
          ? WebflowLightbox
          : Key extends 'slider'
            ? WebflowSlider
            : Key extends 'tabs'
              ? WebflowTabs
              : Key extends 'maps'
                ? WebflowMaps
                : WebflowIx2)
    | undefined;
  /**
   * @deprecated - Legacy API, use `window.wf` instead
   */
  analytics?: {
    optIn: ({ reload }: { reload?: boolean }) => void;
    optOut: ({ reload }: { reload?: boolean }) => void;
    getIsOptedOut: () => 'true' | null;
  };
}

/**
 * Includes methods of the wf object
 */
export interface WF {
  ready: (callback?: () => void) => void;
  /**
   * Enables user tracking for the current user.
   * @param options
   */
  allowUserTracking?: (options?: { reload?: boolean; activate?: boolean }) => void;
  /**
   * Disables user tracking for the current user.
   * @param options
   */
  denyUserTracking?: (options?: { reload?: boolean }) => void;
  /**
   * Retrieves the user’s current tracking preference.
   */
  getUserTrackingChoice?: () => 'allow' | 'deny' | 'none';
}

export type XSCPMetadata = {
  meta: {
    droppedLinks: number;
    dynBindRemovedCount: number;
    dynListBindRemovedCount: number;
    paginationRemovedCount: number;
    universalBindingsRemovedCount: number;
    unlinkedSymbolCount: number;
  };
  type: string;
  payload: {
    nodes: PastedNodes[];
    assets: object[];
    ix1: object[];
    ix2: object[];
    styles: {
      name: string;
      type: string | 'class';
    }[];
  };
};

export type PastedNodes = {
  children: string[];
  classes: string[];
  tag: string;
  type: string;
  _id: string;
  data: {
    xattr: Attr[];
  };
};
