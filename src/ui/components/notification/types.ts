import type * as React from 'react';

import type { IconComponent } from '../../types';

export type NotificationType = 'warning' | 'error' | 'success' | 'info';

export interface NotificationProps {
  /**
   * Additional CSS classes to apply
   */
  className?: string;
  /**
   * The main message content to display
   */
  message?: string;
  /**
   * External link URL
   */
  href?: string;
  /**
   * The title/heading of the notification
   */
  title?: string;
  /**
   * Font weight for the title text
   */
  titleFontWeight?: number;
  /**
   * Text for the link button
   */
  linkText?: string;
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  /**
   * Custom icon component to display
   */
  icon?: IconComponent;
  /**
   * Icon component for the link
   */
  linkIcon?: IconComponent | null;
  /**
   * Notification type or custom color string
   */
  variant?: NotificationType | string;
  /**
   * Whether to render message as rich text/HTML
   */
  richTextMessage?: boolean;
  /**
   * Whether to render title as rich text/HTML
   */
  richTextTitle?: boolean;
  /**
   * Whether to show the colored left border
   */
  showBorder?: boolean;
  /**
   * Custom action content
   */
  actions?: React.ReactNode;
  /**
   * Event handler for close button click
   */
  onClose?: () => void;
}

export interface NotificationColors {
  icon: string;
  border: string;
}
