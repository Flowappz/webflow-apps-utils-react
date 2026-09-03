/**
 * Checks if localStorage is available in the current environment.
 */
export const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    // Attempt to access localStorage
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error(
      'Error! window.localStorage is not available in this browser setting, please check if you have disabled third party cookies and/or site data.',
      e
    );
    return false;
  }
};

/**
 * Gets a value from localStorage.
 */
export const getLocalStorage = (key: string): string | null => {
  if (isLocalStorageAvailable()) {
    const value = localStorage.getItem(key);
    return value !== null ? value : null;
  }
  return null;
};

/**
 * Sets a value in localStorage.
 */
export const setLocalStorage = (key: string, value: string): boolean => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem(key, value);
    return true;
  }
  return false;
};

/**
 * Removes a value from localStorage.
 */
export const removeLocalStorage = (key: string): boolean => {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(key);
    return true;
  }
  return false;
};
