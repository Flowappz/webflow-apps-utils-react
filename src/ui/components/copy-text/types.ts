import type * as React from 'react';

/**
 * Notification function type for copy operations
 */
export interface NotificationFunction {
  (options: { type: 'Success' | 'Error'; message: string }): void;
}

/**
 * Props for the CopyText component
 */
export interface CopyTextProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'className' | 'title' | 'hidden' | 'content' | 'onCopy' | 'onError'
  > {
  /** The content to be copied to clipboard */
  content: string;
  /** Optional title/heading text to display above the copy area */
  title?: string;
  /** Whether the copy functionality is disabled */
  disabled?: boolean;
  /** Whether to show the content in raw format (with HTML) or cleaned */
  raw?: boolean;
  /** Whether the component is in a hidden state */
  hidden?: boolean;
  /** Optional comment to prepend to copied content when in raw mode */
  comment?: string;
  /** Custom tooltip text for the copy button */
  tooltip?: string;
  /** Optional notification function to call on copy success/error */
  onNotify?: NotificationFunction;
  /** Callback fired when content is successfully copied */
  onCopy?: (content: string) => void;
  /** Callback fired when copy fails */
  onError?: (error: string) => void;
  /** Optional node for custom header content */
  header?: React.ReactNode;
  /** Optional node for additional content below the copy area */
  footer?: React.ReactNode;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Event types for clipboard operations
 */
export interface CopyEvent {
  text: string;
  clearSelection: () => void;
}

export interface CopyErrorEvent {
  message: string;
}
