import type * as React from 'react';

export type FormContextState = {
  currentForm: string | null;
  validationMode: 'strict' | 'loose';
  formErrors: Record<string, string[]>;
};

export type AppContextState = {
  editMode: boolean;
  repairMode: boolean;
  title: string | null;
};

export type DataContextState = {
  cacheSize: number;
  syncInterval: number;
  lastSync: number | null;
};

export type ContextState<T = unknown> = {
  data: T;
  updatedAt: number;
  version: number;
};

export type GlobalContextState = {
  contexts: Map<string, ContextState>;
  activeContexts: Set<string>;
};

export interface ContextOperations<T> {
  get(): T | null;
  set(data: Partial<T>): void;
  update(updater: (current: T | null) => T): void;
  clear(): void;
  reset(): void;
  subscribe(callback: (data: T | null) => void): () => void;
}

export interface GlobalContextOperations {
  getContext<T = unknown>(key: string): ContextOperations<T>;
  hasContext(key: string): boolean;
  removeContext(key: string): void;
  clearAll(): void;
  resetAll(): void;
  resetByKey(key: string): void;
  getActiveContexts(): string[];
  getAllContexts(): Record<string, unknown>;
  getContextMetadata(key: string): {
    updatedAt: number;
    version: number;
    isActive: boolean;
  } | null;
  get state(): Record<string, unknown>;
  subscribe(callback: (event: ContextEvent | GlobalContextEvent) => void): () => void;
}

export interface ContextEvent {
  type: 'set' | 'update' | 'clear' | 'reset';
  contextKey: string;
  data: unknown;
  previousData?: unknown;
  timestamp: number;
}

export interface GlobalContextEvent {
  type: 'clearAll' | 'resetAll' | 'remove';
  contextKey?: string;
  data?: unknown;
  previousData?: unknown;
  timestamp: number;
}

export interface ConfiguratorWatchOptions {
  watchAll?: boolean;
  watchKeys?: string[];
  debounceMs?: number;
}

export interface ConfiguratorState<T = Record<string, unknown>> {
  configurator: T | null;
  configuratorCache: T | null;
  hasChanged: boolean;
  watchOptions: ConfiguratorWatchOptions;
}

export interface AppContextData<TConfigurator = Record<string, unknown>> {
  editMode: boolean;
  repairMode: boolean;
  title: string | null;
  debugMode?: boolean;
  configurator: ConfiguratorState<TConfigurator>;
}

export interface FormContextData {
  formKey: string | null;
  formUpdateKey: string | null;
}

export interface DataContextData<TData = Record<string, unknown>> {
  state: TData | null;
}

export interface GlobalProviderProps {
  initialContexts?: Record<string, unknown>;
  debug?: boolean;
  children?: React.ReactNode;
}

// Context keys for type safety
export const CONTEXT_KEYS = {
  APP: 'app',
  FORM: 'form',
  DATA: 'data',
} as const;

export type ContextId = string & { readonly brand: unique symbol };
export type ContextKey = keyof typeof CONTEXT_KEYS;
