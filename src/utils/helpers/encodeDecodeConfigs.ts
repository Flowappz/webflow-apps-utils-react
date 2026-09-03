/**
 * Converts a configuration object to a base64-encoded string.
 * @param {object} configs
 * @returns
 */
export const encodeComponentConfigs = (configs: object): string => {
  const previewModeConfigs = btoa(JSON.stringify(configs));
  return previewModeConfigs;
};

/**
 * Decodes a base64-encoded configuration string to a configuration object.
 * @param configsString
 * @param component
 * @returns
 */
export const decodeComponentConfigs = <T>(configsString: string): T => {
  const jsonString = atob(configsString);
  const configParsed = JSON.parse(jsonString) as T;
  return configParsed;
};
