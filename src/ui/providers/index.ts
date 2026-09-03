// Main provider component
export { GlobalProvider } from './GlobalProvider';

// Context functions and hooks
export {
  createGlobalContext,
  setGlobalContext,
  getGlobalContext,
  useGlobalContext,
  useContext,
  useContextValue,
  useFormContext,
  useAppContext,
  useDataContext,
  useConfiguratorContext,
  GlobalContextReactContext,
} from './globalContext';
export type { GlobalContext } from './globalContext';

export type {
  FormContextState,
  AppContextState,
  DataContextState,
  ContextState,
  GlobalContextState,
  ContextOperations,
  GlobalContextOperations,
  GlobalProviderProps,
  ContextEvent,
  GlobalContextEvent,
  ContextKey,
  ContextId,
  ConfiguratorWatchOptions,
  ConfiguratorState,
  AppContextData,
  FormContextData,
  DataContextData,
} from './types';
export { CONTEXT_KEYS } from './types';

// Configurator utilities
export {
  hasChangesViaDiff,
  getDetailedDiff,
  compareKeys,
  hasConfiguratorChanged,
  createDebouncedUpdate,
  extractKeys,
  validateWatchOptions,
  createDefaultConfiguratorState,
} from './configuratorUtils';
