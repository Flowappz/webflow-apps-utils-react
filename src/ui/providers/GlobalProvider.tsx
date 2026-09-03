import { useState } from 'react';

import { createGlobalContext, GlobalContextReactContext, setGlobalContext } from './globalContext';
import type { GlobalProviderProps } from './types';

export function GlobalProvider({ initialContexts = {}, debug = false, children }: GlobalProviderProps) {
  // Default contexts with configurator support
  const defaultContexts = {
    app: {
      editMode: false,
      repairMode: false,
      title: null,
      configurator: {
        configurator: null,
        configuratorCache: null,
        hasChanged: false,
        watchOptions: {
          watchAll: true,
          watchKeys: [],
          debounceMs: 100,
        },
      },
    },
    form: {
      formKey: null,
      formUpdateKey: null,
    },
    data: {
      state: null,
    },
  };

  // Create and set the global context once (intentionally captures initial values,
  // mirroring the Svelte `untrack` behavior)
  const [globalContext] = useState(() => {
    const mergedContexts = {
      ...defaultContexts,
      ...initialContexts,
    };
    return setGlobalContext(createGlobalContext(mergedContexts, debug));
  });

  return (
    <GlobalContextReactContext.Provider value={globalContext}>
      {children}
    </GlobalContextReactContext.Provider>
  );
}
