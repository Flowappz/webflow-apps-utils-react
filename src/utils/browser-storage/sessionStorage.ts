/**
 * Checks if sessionStorage is available in the current environment.
 */
export const isSessionStorageAvailable = (): boolean => {
  try {
    // Attempt to access sessionStorage
    const testKey = '__sessionStorage_test__';
    sessionStorage.setItem(testKey, '1');
    sessionStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error(
      {},
      'Error! window.sessionStorage is not available your browser setting, please check if you have disabled third party cookies and/or site data.',
      e
    );
    return false;
  }
};

/**
 * Gets a value from sessionStorage.
 */
export const getSessionStorage = (key: string): string | null => {
  if (isSessionStorageAvailable()) {
    const value = sessionStorage.getItem(key);
    return value !== null ? value : null;
  }
  return null;
};

/**
 * Sets a value in sessionStorage.
 */
export const setSessionStorage = (key: string, value: string): boolean => {
  if (isSessionStorageAvailable()) {
    sessionStorage.setItem(key, value);
    return true;
  }
  return false;
};

/**
 * Removes a value from sessionStorage.
 */
export const removeSessionStorage = (key: string): boolean => {
  if (isSessionStorageAvailable()) {
    sessionStorage.removeItem(key);
    return true;
  }
  return false;
};
