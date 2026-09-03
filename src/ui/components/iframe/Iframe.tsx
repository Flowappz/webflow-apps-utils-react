import { useMemo, useRef } from 'react';

import { buildProxyUrl, FINSWEET_REVERSE_PROXY_URL } from '../../../utils';

import type { IframeProps } from './types';

import './Iframe.css';

export const Iframe = ({
  url,
  title,
  width = '100%',
  height = '100%',
  useProxy = true,
  onLoadSuccess = () => {},
  onLoadError = () => {},
  className = '',
  id,
  ...restProps
}: IframeProps) => {
  // Component state
  const iframeElement = useRef<HTMLIFrameElement>(null);

  // Proxied src; empty (fail closed) if the target isn't a public HTTPS URL.
  const src = useMemo(() => {
    if (!useProxy) return url;

    try {
      return buildProxyUrl(url, FINSWEET_REVERSE_PROXY_URL);
    } catch {
      return '';
    }
  }, [url, useProxy]);

  // CSS classes
  const iframeClasses = `iframe ${className}`.trim();

  /**
   * Handle the iframe load event
   */
  function handleLoad(): void {
    if (!iframeElement.current?.contentDocument) {
      onLoadError();
      return;
    }

    const { contentDocument } = iframeElement.current;
    const iframeTitle = contentDocument.title;
    const { body } = contentDocument;

    // Check for various error conditions
    const hasNoContent = body.childNodes.length === 0;
    const has404InTitle = iframeTitle.includes('404');
    const has404InBody = body.outerHTML.includes('<span>404</span>');

    if (hasNoContent || has404InTitle || has404InBody) {
      onLoadError();
      return;
    }

    onLoadSuccess();
  }

  return (
    <iframe
      ref={iframeElement}
      id={id}
      title={title}
      src={src}
      width={width}
      height={height}
      sandbox="allow-scripts allow-same-origin"
      loading="lazy"
      referrerPolicy="no-referrer"
      className={iframeClasses}
      onLoad={handleLoad}
      {...restProps}
    ></iframe>
  );
};
