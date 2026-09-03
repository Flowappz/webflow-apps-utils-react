import { load } from 'cheerio';

import { FINSWEET_REVERSE_PROXY_URL } from '../constants';
import { buildProxyUrl } from './proxy';

export interface ProxyOptions {
  proxyBaseUrl?: string;
}

/**
 * Function to fetch the Document of a specified URL via a CORS proxy.
 *
 * @param url - The URL of the page.
 * @param slug - [optional] The slug of the page.
 * @param options - [optional] Proxy options. Defaults to the Finsweet reverse proxy.
 */
export const fetchDocument = async (url: string, slug?: string, options?: ProxyOptions): Promise<Document> => {
  const pageUrl = new URL(url);
  if (slug) pageUrl.pathname = slug;

  const target = buildProxyUrl(pageUrl, options?.proxyBaseUrl ?? FINSWEET_REVERSE_PROXY_URL);

  const response = await fetch(target);
  const pageContent = await response.text();

  const parser = new DOMParser();
  return parser.parseFromString(pageContent, 'text/html');
};

/**
 * Function to fetch the Elements of a specified URL via a CORS proxy.
 *
 * @param url - The URL of the page.
 * @param tagName - The tag name of the elements to fetch. If not provided, returns the whole page as a string.
 * @param asElement - [optional] If true, returns the element as an object.
 * @param options - [optional] Proxy options. Defaults to the Finsweet reverse proxy.
 */
export const fetchElements = async (
  url: URL,
  tagName?: string,
  asElement?: boolean,
  options?: ProxyOptions
): Promise<string[] | HTMLElement[]> => {
  const target = buildProxyUrl(url, options?.proxyBaseUrl ?? FINSWEET_REVERSE_PROXY_URL);

  const response = await fetch(target);
  const html = await response.text();

  const $ = load(html);

  // return the whole page if no tag name is provided
  if (!tagName) return [$.html()];

  // crawl page and get elements
  if (asElement && tagName) {
    const elements = $(tagName)
      .map((_, el) => {
        const outerHTML = $.html(el); // Get the outer HTML of each element
        const parser = new DOMParser();
        const parsedDoc = parser.parseFromString(outerHTML, 'text/html');
        const element = parsedDoc.querySelector<HTMLElement>(tagName);
        return element;
      })
      .get();

    return elements as HTMLElement[];
  }

  // crawl page and get elements as strings
  const elements = $(tagName)
    .map((_, el) => {
      const outerHTML = $.html(el);
      return outerHTML;
    })
    .get();

  return elements;
};

/**
 * Fetch elements by attribute via a CORS proxy.
 *
 * @param url - The URL of the page to fetch.
 * @param attribute - CSS selector for the attribute to match.
 * @param options - [optional] Proxy options. Defaults to the Finsweet reverse proxy.
 */
export const fetchElementsByAttribute = async (
  url: URL,
  attribute: string,
  options?: ProxyOptions
): Promise<string[]> => {
  const target = buildProxyUrl(url, options?.proxyBaseUrl ?? FINSWEET_REVERSE_PROXY_URL);

  const response = await fetch(target);
  const html = await response.text();

  const $ = load(html);

  const elements = $(attribute)
    .map((_, el) => {
      const outerHTML = $.html(el);
      return outerHTML;
    })
    .get();

  return elements;
};
