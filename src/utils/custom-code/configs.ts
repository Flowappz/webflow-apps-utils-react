/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable, type Writable } from '../../ui/stores/store';
import { getCustomCode } from './api';

/**
 * Store for Custom Code stored Component configs
 */
export const componentConfigsStore: Writable<null> = writable(null);

export type CustomCodeConfigsStore = {
  component: string;
  instance: string[];
}[];

/**
 * Store for Custom Code stored Component configs instances
 */
export const customCodeConfigsStore: Writable<CustomCodeConfigsStore> = writable<CustomCodeConfigsStore>([]);

/**
 * Get configs from custom code.
 * @param displayName - The name of the custom code block to get configs from.
 */
export const getProjectConfigs = async (displayName: string): Promise<any> => {
  const [customCodeBlock] = await getCustomCode(displayName);

  if (!customCodeBlock || !customCodeBlock.hostedLocation) {
    return null;
  }

  // activate loading state to block iife scripts
  window.isLoadingCustomCodeConfigs = true;

  const configs = await import(/* @vite-ignore */ customCodeBlock.hostedLocation);

  window.isLoadingCustomCodeConfigs = false;

  customCodeConfigsStore.set(configs);

  return configs;
};

/**
 * Fetches configs stored in custom code for a given component.
 * @param component
 * @returns
 */
export const getComponentConfigs = async (component: string, displayName: string): Promise<any> => {
  const customCodeBlock = await getProjectConfigs(displayName);

  if (!customCodeBlock || Object.keys(customCodeBlock[component]).length === 0) return null;

  return customCodeBlock[component];
};
