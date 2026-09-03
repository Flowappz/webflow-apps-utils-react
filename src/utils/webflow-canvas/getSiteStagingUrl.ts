/**
 * Returns a valid Webflow project staging URL.
 */
export const getSiteStagingUrl = async (origin?: boolean, stagingName?: boolean): Promise<string> => {
  const { shortName, domains } = await webflow.getSiteInfo();

  if (stagingName) return shortName;

  const stagingUrl = domains.find((domain) => domain.stage === 'staging')?.url;

  if (origin) return stagingUrl || `${shortName}.webflow.io`;

  if (stagingUrl) return `https://${stagingUrl}`;

  return `https://${shortName}.webflow.io`;
};
