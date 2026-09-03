import type * as React from 'react';

export interface IframeProps
  extends Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, 'src' | 'title' | 'onLoad'> {
  /**
   * The URL to load in the iframe
   */
  url: string;
  /**
   * Accessible title for the iframe content
   */
  title: string;
  /**
   * Width of the iframe
   * @default '100%'
   */
  width?: string;
  /**
   * Height of the iframe
   * @default '100%'
   */
  height?: string;
  /**
   * Whether to use the Finsweet reverse proxy for CORS
   * @default true
   */
  useProxy?: boolean;
  /**
   * Event handler called when iframe loads successfully
   */
  onLoadSuccess?: () => void;
  /**
   * Event handler called when iframe fails to load
   */
  onLoadError?: () => void;
  /**
   * Custom CSS class name
   */
  className?: string;
}
