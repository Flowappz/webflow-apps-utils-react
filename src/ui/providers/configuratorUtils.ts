/* eslint-disable @typescript-eslint/no-explicit-any */
import { deepDiffMapper, DiffType, type DiffMap, type DiffResult } from '../utils/diff-mapper';

import type { ConfiguratorState, ConfiguratorWatchOptions } from './types';

/**
 * Create default configurator state
 */
export function createDefaultConfiguratorState<T = Record<string, any>>(): ConfiguratorState<T> {
  return {
    configurator: null,
    configuratorCache: null,
    hasChanged: false,
    watchOptions: {
      watchAll: true,
      watchKeys: [],
      debounceMs: 100,
    },
  };
}

// Cache for diff comparison results to avoid repeated expensive operations
const diffCache = new Map<string, { result: DiffResult | DiffMap; timestamp: number }>();
const CACHE_TTL = 1000;

/**
 * Use deepDiffMapper to compare objects and determine if there are any changes
 */
export function hasChangesViaDiff<T>(current: T, updated: T): boolean {
  if (current === updated) return false;

  const cacheKey = JSON.stringify([current, updated]);
  const cached = diffCache.get(cacheKey);

  let diff: DiffResult | DiffMap;
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    diff = cached.result;
  } else {
    diff = deepDiffMapper.compare(current, updated);
    diffCache.set(cacheKey, { result: diff, timestamp: Date.now() });

    // Clean old cache entries periodically
    if (diffCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of diffCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          diffCache.delete(key);
        }
      }
    }
  }

  // Check if there are any meaningful changes
  return hasAnyChanges(diff);
}

/**
 * Recursively check if a diff result contains any actual changes
 */
function hasAnyChanges(diff: any): boolean {
  // If it's a DiffResult, check if it's not UNCHANGED
  if (diff && typeof diff === 'object' && 'type' in diff && 'data' in diff) {
    return diff.type !== DiffType.UNCHANGED;
  }

  // If it's a DiffMap, check all properties recursively
  if (diff && typeof diff === 'object') {
    for (const key in diff) {
      if (hasAnyChanges(diff[key])) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Get detailed diff information using deepDiffMapper
 */
export function getDetailedDiff<T>(current: T, updated: T): DiffResult | DiffMap {
  const cacheKey = JSON.stringify([current, updated]);
  const cached = diffCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const diff = deepDiffMapper.compare(current, updated);
  diffCache.set(cacheKey, { result: diff, timestamp: Date.now() });

  return diff;
}

/**
 * Compare specific keys of two objects with optimization using deepDiffMapper
 */
export function compareKeys<T extends Record<string, any>>(
  current: T | null,
  updated: T | null,
  keys: string[]
): boolean {
  if (!current && !updated) return true;
  if (!current || !updated) return false;
  if (keys.length === 0) return true;

  if (keys.length === 1) {
    const key = keys[0];
    return !hasChangesViaDiff(current[key], updated[key]);
  }

  for (const key of keys) {
    const val1 = current[key];
    const val2 = updated[key];

    if (val1 === val2) continue;

    if (hasChangesViaDiff(val1, val2)) {
      return false;
    }
  }

  return true;
}

// Debounce storage
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Determine if configurator has changed with performance optimization using deepDiffMapper
 */
export function hasConfiguratorChanged<T extends Record<string, any>>(
  configurator: T | null,
  configuratorCache: T | null,
  watchOptions: ConfiguratorWatchOptions
): boolean {
  if (!configurator && !configuratorCache) return false;
  if (!configurator || !configuratorCache) return true;

  if (watchOptions.watchAll) {
    // Use deepDiffMapper for comprehensive comparison with type coercion and better edge case handling
    return hasChangesViaDiff(configurator, configuratorCache);
  }

  if (watchOptions.watchKeys && watchOptions.watchKeys.length > 0) {
    // Extract only the watched keys and compare them
    const extracted1 = extractKeys(configurator, watchOptions.watchKeys);
    const extracted2 = extractKeys(configuratorCache, watchOptions.watchKeys);
    return hasChangesViaDiff(extracted1, extracted2);
  }

  // For minimal watch (no specific keys), fallback to full comparison with diff mapper
  return hasChangesViaDiff(configurator, configuratorCache);
}

/**
 * Create a debounced function for configurator updates
 */
export function createDebouncedUpdate<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  const key = fn.toString();

  return ((...args: Parameters<T>) => {
    const existingTimer = debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      debounceTimers.delete(key);
      fn(...args);
    }, delay);

    debounceTimers.set(key, timer);
  }) as T;
}

/**
 * Extract specific keys from an object
 */
export function extractKeys<T extends Record<string, any>>(
  current: T | null,
  keys: string[]
): Partial<T> | null {
  if (!current || keys.length === 0) return null;

  const result: Partial<T> = {};
  for (const key of keys) {
    if (key in current) {
      result[key as keyof T] = current[key];
    }
  }

  return result;
}

/**
 * Validate watch options
 */
export function validateWatchOptions(options: ConfiguratorWatchOptions): ConfiguratorWatchOptions {
  const validated: ConfiguratorWatchOptions = {
    watchAll: options.watchAll ?? true,
    watchKeys: options.watchKeys ?? [],
    debounceMs: Math.max(options.debounceMs ?? 50, 16),
  };

  if (!validated.watchAll && (!validated.watchKeys || validated.watchKeys.length === 0)) {
    validated.watchAll = true;
  }

  return validated;
}
