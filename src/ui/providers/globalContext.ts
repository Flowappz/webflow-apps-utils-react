import { createContext, useContext as useReactContext, useMemo } from 'react';

import { writable, useStore, type Readable } from '../stores/store';
import { createDebouncedUpdate, hasConfiguratorChanged, validateWatchOptions } from './configuratorUtils';
import type {
  AppContextData,
  ConfiguratorState,
  ConfiguratorWatchOptions,
  ContextEvent,
  ContextOperations,
  ContextState,
  DataContextData,
  FormContextData,
  GlobalContextEvent,
  GlobalContextOperations,
} from './types';

/**
 * The global context object, extended with a reactive snapshot store so React
 * components can subscribe to state changes (replaces Svelte's `$state` Map).
 */
export type GlobalContext = GlobalContextOperations & {
  /** Reactive snapshot of all context data — updated synchronously on every mutation. */
  readonly stateStore: Readable<Record<string, unknown>>;
};

export function createGlobalContext(
  initialContexts: Record<string, unknown> = {},
  debug = false
): GlobalContext {
  // Context storage
  const contexts = new Map<string, ContextState>();
  const activeContexts = new Set<string>();
  const eventListeners = new Map<string, Set<(event: ContextEvent | GlobalContextEvent) => void>>();

  // Reactive snapshot store (React replacement for Svelte's `$state` reactivity)
  const stateStore = writable<Record<string, unknown>>({});

  // Performance optimization: Track last configurator state to avoid unnecessary updates
  let lastConfiguratorState: unknown = null;
  let lastConfiguratorHash: string | null = null;
  void lastConfiguratorState;

  function snapshot(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, context] of contexts.entries()) {
      result[key] = context.data;
    }
    return result;
  }

  function notifyState() {
    stateStore.set(snapshot());
  }

  // Initialize contexts
  for (const [key, value] of Object.entries(initialContexts)) {
    contexts.set(key, {
      data: value,
      updatedAt: Date.now(),
      version: 1,
    });
    activeContexts.add(key);
  }
  notifyState();

  // Debug logging with throttling
  let debugLogCount = 0;
  const MAX_DEBUG_LOGS = 100;

  function debugLog(message: string, data?: unknown) {
    if (debug && debugLogCount < MAX_DEBUG_LOGS) {
      console.log(`[GlobalContext] ${message}`, data);
      debugLogCount++;
      if (debugLogCount >= MAX_DEBUG_LOGS) {
        setTimeout(() => {
          debugLogCount = 0;
        }, 5000);
      }
    }
  }

  // Event emission with batching
  const eventQueue: Array<ContextEvent | GlobalContextEvent> = [];
  let eventBatchTimeout: ReturnType<typeof setTimeout> | null = null;

  function emitEvent(event: ContextEvent | GlobalContextEvent) {
    eventQueue.push(event);

    if (!eventBatchTimeout) {
      eventBatchTimeout = setTimeout(() => {
        flushEventQueue();
        eventBatchTimeout = null;
      }, 16);
    }
  }

  function flushEventQueue() {
    const events = [...eventQueue];
    eventQueue.length = 0;

    for (const event of events) {
      debugLog('Event emitted', event);

      // Emit to specific context listeners
      if ('contextKey' in event && event.contextKey) {
        const listeners = eventListeners.get(event.contextKey);
        if (listeners) {
          for (const listener of listeners) {
            try {
              listener(event);
            } catch (error) {
              console.warn('Event listener error:', error);
            }
          }
        }
      }

      // Emit to global listeners
      const globalListeners = eventListeners.get('*');
      if (globalListeners) {
        for (const listener of globalListeners) {
          try {
            listener(event);
          } catch (error) {
            console.warn('Global event listener error:', error);
          }
        }
      }
    }
  }

  // Helper methods for configurator handling
  function isConfiguratorUpdate(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      'configurator' in data &&
      typeof (data as { configurator: unknown }).configurator === 'object'
    );
  }

  // Fast hash function for configurator state comparison
  function hashObject(obj: unknown): string {
    if (!obj) return 'null';
    if (typeof obj !== 'object') return String(obj);

    try {
      const str = JSON.stringify(obj, null, 0);
      if (str.length > 1000) {
        return (
          Object.keys(obj).sort().join(',') +
          ':' +
          Object.values(obj)
            .filter((v) => typeof v !== 'object')
            .join(',')
        );
      }
      return str;
    } catch {
      return Object.keys(obj as Record<string, unknown>).sort().join(',');
    }
  }

  // Debounced configurator update handler
  const debouncedConfiguratorUpdate = createDebouncedUpdate(
    (appData: AppContextData) => {
      if (appData.configurator) {
        // Validate and set watch options
        appData.configurator.watchOptions = validateWatchOptions(
          appData.configurator.watchOptions || { watchAll: true, debounceMs: 50 }
        );

        // Compute hasChanged based on configurator and cache comparison
        const hasChanged = hasConfiguratorChanged(
          appData.configurator.configurator,
          appData.configurator.configuratorCache,
          appData.configurator.watchOptions
        );

        // Update hasChanged only if it's actually different
        if (appData.configurator.hasChanged !== hasChanged) {
          appData.configurator.hasChanged = hasChanged;
          notifyState();
          debugLog('Configurator hasChanged updated', {
            hasChanged,
            configurator: appData.configurator.configurator,
            cache: appData.configurator.configuratorCache,
            watchOptions: appData.configurator.watchOptions,
          });
        }
      }
    },
    50
  );

  function handleConfiguratorUpdate(newData: unknown, previousData: unknown) {
    void previousData;
    const appData = newData as AppContextData;
    if (appData.configurator) {
      // Quick hash check to avoid unnecessary processing
      const currentHash = hashObject(appData.configurator.configurator);
      if (currentHash === lastConfiguratorHash) {
        return;
      }
      lastConfiguratorHash = currentHash;
      lastConfiguratorState = appData.configurator.configurator;

      // Use debounced update for configurator changes
      debouncedConfiguratorUpdate(appData);
    }
  }

  // Enhanced context operations with configurator support
  function createContextOperations<T>(key: string): ContextOperations<T> {
    const operations: ContextOperations<T> = {
      get() {
        const context = contexts.get(key);
        return context?.data as T | null;
      },

      set(data: Partial<T>) {
        const currentContext = contexts.get(key);
        const previousData = currentContext?.data;
        const newData = previousData ? { ...previousData, ...data } : data;

        // Handle configurator state updates with watching
        if (key === 'app' && isConfiguratorUpdate(data)) {
          handleConfiguratorUpdate(newData, previousData);
        }

        contexts.set(key, {
          data: newData,
          updatedAt: Date.now(),
          version: (currentContext?.version || 0) + 1,
        });
        activeContexts.add(key);
        notifyState();

        emitEvent({
          type: 'set',
          contextKey: key,
          data: newData,
          previousData,
          timestamp: Date.now(),
        });
      },

      update(updater: (current: T | null) => T) {
        const currentContext = contexts.get(key);
        const previousData = currentContext?.data;
        const newData = updater(previousData as T | null);

        // Handle configurator state updates with watching
        if (key === 'app' && isConfiguratorUpdate(newData)) {
          handleConfiguratorUpdate(newData, previousData);
        }

        contexts.set(key, {
          data: newData,
          updatedAt: Date.now(),
          version: (currentContext?.version || 0) + 1,
        });
        activeContexts.add(key);
        notifyState();

        emitEvent({
          type: 'update',
          contextKey: key,
          data: newData,
          previousData,
          timestamp: Date.now(),
        });
      },

      clear() {
        const currentContext = contexts.get(key);
        const previousData = currentContext?.data;

        contexts.set(key, {
          data: null,
          updatedAt: Date.now(),
          version: (currentContext?.version || 0) + 1,
        });
        notifyState();

        emitEvent({
          type: 'clear',
          contextKey: key,
          data: null,
          previousData,
          timestamp: Date.now(),
        });
      },

      reset() {
        const currentContext = contexts.get(key);
        const previousData = currentContext?.data;

        contexts.delete(key);
        activeContexts.delete(key);
        notifyState();

        emitEvent({
          type: 'reset',
          contextKey: key,
          data: null,
          previousData,
          timestamp: Date.now(),
        });
      },

      subscribe(callback: (data: T | null) => void) {
        const listeners =
          eventListeners.get(key) || new Set<(event: ContextEvent | GlobalContextEvent) => void>();
        const wrappedCallback = (event: ContextEvent | GlobalContextEvent) => {
          if ('contextKey' in event && event.contextKey === key) {
            callback(event.data as T | null);
          }
        };
        listeners.add(wrappedCallback);
        eventListeners.set(key, listeners);

        // Return unsubscribe function
        return () => {
          listeners.delete(wrappedCallback);
          if (listeners.size === 0) {
            eventListeners.delete(key);
          }
        };
      },
    };

    return operations;
  }

  // Global operations
  const globalOperations: GlobalContext = {
    stateStore,

    getContext<T = unknown>(key: string): ContextOperations<T> {
      return createContextOperations<T>(key);
    },

    hasContext(key: string): boolean {
      return contexts.has(key);
    },

    removeContext(key: string) {
      const currentContext = contexts.get(key);
      const previousData = currentContext?.data;

      contexts.delete(key);
      activeContexts.delete(key);
      notifyState();

      emitEvent({
        type: 'remove',
        contextKey: key,
        data: null,
        previousData,
        timestamp: Date.now(),
      });
    },

    clearAll() {
      const previousState = this.getAllContexts();

      for (const key of contexts.keys()) {
        contexts.set(key, {
          data: null,
          updatedAt: Date.now(),
          version: (contexts.get(key)?.version || 0) + 1,
        });
      }
      notifyState();

      emitEvent({
        type: 'clearAll',
        data: null,
        previousData: previousState,
        timestamp: Date.now(),
      });
    },

    resetAll() {
      const previousState = this.getAllContexts();

      contexts.clear();
      activeContexts.clear();
      notifyState();

      emitEvent({
        type: 'resetAll',
        data: null,
        previousData: previousState,
        timestamp: Date.now(),
      });
    },

    resetByKey(key: string) {
      const operations = this.getContext(key);
      operations.reset();
    },

    getActiveContexts(): string[] {
      return Array.from(activeContexts);
    },

    getAllContexts(): Record<string, unknown> {
      return snapshot();
    },

    getContextMetadata(key: string) {
      const context = contexts.get(key);
      if (!context) return null;

      return {
        updatedAt: context.updatedAt,
        version: context.version,
        isActive: activeContexts.has(key),
      };
    },

    get state() {
      return this.getAllContexts();
    },

    subscribe(callback: (event: ContextEvent | GlobalContextEvent) => void) {
      const listeners =
        eventListeners.get('*') || new Set<(event: ContextEvent | GlobalContextEvent) => void>();
      listeners.add(callback);
      eventListeners.set('*', listeners);

      // Return unsubscribe function
      return () => {
        listeners.delete(callback);
        if (listeners.size === 0) {
          eventListeners.delete('*');
        }
      };
    },
  };

  return globalOperations;
}

// React context (replaces Svelte's setContext/getContext)
export const GlobalContextReactContext = createContext<GlobalContext | null>(null);

// Module-level fallback so `setGlobalContext` keeps working outside a React tree
let globalContextSingleton: GlobalContext | null = null;

// Context provider functions
export function setGlobalContext(context: ReturnType<typeof createGlobalContext>): GlobalContext {
  globalContextSingleton = context;
  return context;
}

/**
 * React hook: get the global context. Must be used within a `GlobalProvider`
 * (falls back to the last context registered via `setGlobalContext`).
 */
export function getGlobalContext(): GlobalContext {
  const context = useReactContext(GlobalContextReactContext) ?? globalContextSingleton;
  if (!context) {
    throw new Error(
      'Global context not found. Make sure to wrap your app with GlobalProvider component.'
    );
  }
  return context;
}

/** Alias for `getGlobalContext` with a conventional React hook name. */
export const useGlobalContext = getGlobalContext;

// Convenience hooks for specific contexts
export function useContext<T = unknown>(key: string): ContextOperations<T> {
  const globalContext = getGlobalContext();
  // Subscribe to state changes so consumers re-render (Svelte `$state` parity)
  useStore(globalContext.stateStore);
  return useMemo(() => globalContext.getContext<T>(key), [globalContext, key]);
}

export function useFormContext(): ContextOperations<FormContextData> {
  return useContext<FormContextData>('form');
}

export function useAppContext<TConfigurator = Record<string, unknown>>(): ContextOperations<
  AppContextData<TConfigurator>
> {
  return useContext<AppContextData<TConfigurator>>('app');
}

export function useDataContext<TData = Record<string, unknown>>(): ContextOperations<
  DataContextData<TData>
> {
  return useContext<DataContextData<TData>>('data');
}

/**
 * React hook: reactive value of a single context key.
 */
export function useContextValue<T = unknown>(key: string): T | null {
  const globalContext = getGlobalContext();
  const all = useStore(globalContext.stateStore);
  return (all[key] as T | undefined) ?? null;
}

// Enhanced configurator hooks
export function useConfiguratorContext<TConfigurator = Record<string, unknown>>(): {
  readonly configurator: TConfigurator | null;
  readonly configuratorCache: TConfigurator | null;
  readonly hasChanged: boolean;
  readonly watchOptions: ConfiguratorWatchOptions;
  setConfigurator(
    configurator: TConfigurator | null,
    watchOptions?: Partial<ConfiguratorWatchOptions>
  ): void;
  setConfiguratorCache(configuratorCache: TConfigurator | null): void;
  saveToCache(): void;
  updateWatchOptions(watchOptions: Partial<ConfiguratorWatchOptions>): void;
} {
  const appContext = useAppContext<TConfigurator>();

  const configuratorOps = {
    // Computed properties
    get configurator(): TConfigurator | null {
      const data = appContext.get();
      return data?.configurator?.configurator || null;
    },

    get configuratorCache(): TConfigurator | null {
      const data = appContext.get();
      return data?.configurator?.configuratorCache || null;
    },

    get hasChanged(): boolean {
      const data = appContext.get();
      return data?.configurator?.hasChanged || false;
    },

    get watchOptions(): ConfiguratorWatchOptions {
      const data = appContext.get();
      return data?.configurator?.watchOptions || { watchAll: true, debounceMs: 50 };
    },

    // Optimized configurator methods
    setConfigurator(
      configurator: TConfigurator | null,
      watchOptions?: Partial<ConfiguratorWatchOptions>
    ) {
      const currentData = appContext.get();
      const currentConfigurator: ConfiguratorState<TConfigurator> = currentData?.configurator || {
        configurator: null,
        configuratorCache: null,
        hasChanged: false,
        watchOptions: { watchAll: true, debounceMs: 50 },
      };

      appContext.set({
        configurator: {
          ...currentConfigurator,
          configurator,
          watchOptions: validateWatchOptions({
            ...currentConfigurator.watchOptions,
            ...watchOptions,
          }),
        },
      } as Partial<AppContextData<TConfigurator>>);
    },

    setConfiguratorCache(configuratorCache: TConfigurator | null) {
      const currentData = appContext.get();
      const currentConfigurator: ConfiguratorState<TConfigurator> = currentData?.configurator || {
        configurator: null,
        configuratorCache: null,
        hasChanged: false,
        watchOptions: { watchAll: true, debounceMs: 50 },
      };

      appContext.set({
        configurator: {
          ...currentConfigurator,
          configuratorCache,
        },
      } as Partial<AppContextData<TConfigurator>>);
    },

    saveToCache() {
      const current = configuratorOps.configurator;
      if (current) {
        configuratorOps.setConfiguratorCache(current);
      }
    },

    updateWatchOptions(watchOptions: Partial<ConfiguratorWatchOptions>) {
      const currentData = appContext.get();
      const currentConfigurator: ConfiguratorState<TConfigurator> = currentData?.configurator || {
        configurator: null,
        configuratorCache: null,
        hasChanged: false,
        watchOptions: { watchAll: true, debounceMs: 50 },
      };

      appContext.set({
        configurator: {
          ...currentConfigurator,
          watchOptions: validateWatchOptions({
            ...currentConfigurator.watchOptions,
            ...watchOptions,
          }),
        },
      } as Partial<AppContextData<TConfigurator>>);
    },
  };

  return configuratorOps;
}
