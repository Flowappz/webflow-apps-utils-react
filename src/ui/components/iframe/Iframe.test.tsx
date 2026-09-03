import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../utils', () => ({
  FINSWEET_REVERSE_PROXY_URL: 'https://api.finsweet.com/cors?url=',
  buildProxyUrl: (input: string | URL, proxyBaseUrl: string) => {
    const url = new URL(String(input));
    if (url.protocol !== 'https:') throw new Error('not proxyable');
    return `${proxyBaseUrl}${encodeURIComponent(url.href)}`;
  },
}));

import { Iframe } from './Iframe';

describe('Iframe', () => {
  it('renders an iframe with the proxied src by default', () => {
    render(<Iframe url="https://example.com" title="Example Website" />);

    const iframe = screen.getByTitle('Example Website') as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveClass('iframe');
    expect(iframe.getAttribute('src')).toBe(
      'https://api.finsweet.com/cors?url=' + encodeURIComponent('https://example.com/')
    );
    expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin');
    expect(iframe).toHaveAttribute('referrerpolicy', 'no-referrer');
    expect(iframe).toHaveAttribute('loading', 'lazy');
  });

  it('uses the raw url when useProxy is false', () => {
    render(<Iframe url="https://example.com" title="Direct" useProxy={false} />);

    const iframe = screen.getByTitle('Direct');
    expect(iframe.getAttribute('src')).toBe('https://example.com');
  });

  it('fails closed to an empty src for non-proxyable urls', () => {
    render(<Iframe url="http://insecure.local" title="Insecure" />);

    const iframe = screen.getByTitle('Insecure');
    expect(iframe.getAttribute('src') ?? '').toBe('');
  });

  it('applies custom class, dimensions and id', () => {
    render(
      <Iframe
        url="https://example.com"
        title="Styled"
        className="custom-styled-iframe"
        width="800px"
        height="600px"
        id="my-frame"
      />
    );

    const iframe = screen.getByTitle('Styled');
    expect(iframe).toHaveClass('iframe', 'custom-styled-iframe');
    expect(iframe).toHaveAttribute('width', '800px');
    expect(iframe).toHaveAttribute('height', '600px');
    expect(iframe).toHaveAttribute('id', 'my-frame');
  });

  const stubContentDocument = (iframe: HTMLIFrameElement, doc: unknown) => {
    Object.defineProperty(iframe, 'contentDocument', { value: doc, configurable: true });
  };

  it('calls onLoadError when there is no content document', () => {
    const onLoadError = vi.fn();
    const onLoadSuccess = vi.fn();

    render(
      <Iframe
        url="https://example.com"
        title="No Doc"
        onLoadError={onLoadError}
        onLoadSuccess={onLoadSuccess}
      />
    );

    const iframe = screen.getByTitle('No Doc') as HTMLIFrameElement;
    stubContentDocument(iframe, null);
    fireEvent.load(iframe);

    expect(onLoadError).toHaveBeenCalledTimes(1);
    expect(onLoadSuccess).not.toHaveBeenCalled();
  });

  it('calls onLoadError when the loaded document has no content', () => {
    const onLoadError = vi.fn();
    const onLoadSuccess = vi.fn();

    render(
      <Iframe
        url="https://example.com"
        title="Empty Doc"
        onLoadError={onLoadError}
        onLoadSuccess={onLoadSuccess}
      />
    );

    const iframe = screen.getByTitle('Empty Doc') as HTMLIFrameElement;
    stubContentDocument(iframe, {
      title: '',
      body: { childNodes: [], outerHTML: '<body></body>' },
    });
    fireEvent.load(iframe);

    expect(onLoadError).toHaveBeenCalledTimes(1);
    expect(onLoadSuccess).not.toHaveBeenCalled();
  });

  it('calls onLoadError when the loaded document is a 404 page', () => {
    const onLoadError = vi.fn();

    render(<Iframe url="https://example.com" title="404 Doc" onLoadError={onLoadError} />);

    const iframe = screen.getByTitle('404 Doc') as HTMLIFrameElement;
    stubContentDocument(iframe, {
      title: '404 Not Found',
      body: { childNodes: [{}], outerHTML: '<body><p>x</p></body>' },
    });
    fireEvent.load(iframe);

    expect(onLoadError).toHaveBeenCalledTimes(1);
  });

  it('calls onLoadSuccess when the loaded document has content', () => {
    const onLoadError = vi.fn();
    const onLoadSuccess = vi.fn();

    render(
      <Iframe
        url="https://example.com"
        title="Filled Doc"
        onLoadError={onLoadError}
        onLoadSuccess={onLoadSuccess}
      />
    );

    const iframe = screen.getByTitle('Filled Doc') as HTMLIFrameElement;
    stubContentDocument(iframe, {
      title: 'A real page',
      body: { childNodes: [{}], outerHTML: '<body><p>content</p></body>' },
    });
    fireEvent.load(iframe);

    expect(onLoadSuccess).toHaveBeenCalledTimes(1);
    expect(onLoadError).not.toHaveBeenCalled();
  });
});
