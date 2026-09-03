/** SSRF guard: blocks localhost, loopback, RFC-1918, link-local and IPv6 ULA hosts. */
export const isPrivateOrLocalHost = (hostname: string): boolean => {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');

  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) return true;
  if (host === '0.0.0.0' || host === '::1') return true;
  if (/^127\./.test(host)) return true; // IPv4 loopback
  if (/^10\./.test(host)) return true; // private
  if (/^192\.168\./.test(host)) return true; // private
  if (/^169\.254\./.test(host)) return true; // link-local
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true; // private 172.16.0.0–172.31.255.255
  if (/^(fc|fd)/.test(host)) return true; // IPv6 unique-local
  if (host.startsWith('fe80')) return true; // IPv6 link-local

  return false;
};

/** Returns the parsed URL if it's a public HTTPS target; throws otherwise. */
export const assertProxyableUrl = (input: string | URL): URL => {
  let url: URL;

  try {
    url = input instanceof URL ? input : new URL(input);
  } catch {
    throw new Error(`Invalid proxy target URL: ${String(input)}`);
  }

  if (url.protocol !== 'https:') {
    throw new Error(`Proxy target must use HTTPS: ${url.href}`);
  }

  if (isPrivateOrLocalHost(url.hostname)) {
    throw new Error(`Proxy target host is not allowed: ${url.hostname}`);
  }

  return url;
};

/**
 * Builds a reverse-proxy URL after validating (public HTTPS) and encoding the target.
 *
 * @param input - The URL to proxy.
 * @param proxyBaseUrl - Base URL of the proxy endpoint (e.g. `https://my-server.com/proxy?url=`).
 *   When omitted, the caller is responsible for providing the base URL.
 */
export const buildProxyUrl = (input: string | URL, proxyBaseUrl: string): string => {
  const url = assertProxyableUrl(input);
  return `${proxyBaseUrl}${encodeURIComponent(url.href)}`;
};
