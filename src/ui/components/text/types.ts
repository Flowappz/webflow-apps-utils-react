import type * as React from 'react';

import type { IconComponent } from '../../types';
import type { TooltipProps } from '../tooltip/types';

export type TEXT_SIZES = 'normal' | 'large';
export type TEXT_WEIGHTS = 'normal' | 'bold';

export interface TextClickEvent {
  detail: MouseEvent;
}

export interface TextPopupActionEvent {
  detail: boolean;
}

export interface PopupConfig {
  /** Whether the popup functionality is disabled */
  disabled?: boolean;
  /** Title text for the popup */
  title?: string;
  /** Subtitle text for the popup */
  subtitle?: string;
  /** Description text for the popup */
  description?: string;
  /** Icon component for the popup */
  icon?: IconComponent | null;
  /** Whether the popup trigger is currently active */
  active?: boolean;
  /** Event handler for popup action */
  onclick?: () => void;
}

export interface TextProps {
  /** The text content to display */
  label?: string;
  /** Additional CSS classes to apply to the component */
  className?: string;
  /** Whether to render the label as HTML instead of plain text */
  raw?: boolean;
  /** Whether to capitalize the first letter of the text */
  capitalize?: boolean;
  /** Whether the component is disabled and non-interactive */
  disabled?: boolean;
  /** HTML title attribute for accessibility and hover tooltip */
  title?: string;
  /** Text wrapping behavior - 'nowrap' prevents wrapping, 'normal' allows wrapping */
  wrap?: 'nowrap' | 'normal';
  /** Horizontal alignment of the text content */
  textAlign?: 'left' | 'center' | 'right';
  /** Font size - use predefined sizes or custom CSS value */
  fontSize?: TEXT_SIZES | string;
  /** Font weight - use predefined weights or custom CSS value */
  fontWeight?: TEXT_WEIGHTS | string;
  /** Text color as any valid CSS color value */
  fontColor?: string;
  /** Fixed height for the component container */
  height?: string;
  /** Width at which text will be truncated with ellipsis */
  ellipsisOnWidth?: string;
  /** Tooltip configuration object with all tooltip-related settings */
  tooltip?: Partial<TooltipProps>;
  /** Specifies whether to show tooltip on the text or icon. Requires icon prop when set to 'icon' */
  tooltipTarget?: 'text' | 'icon';
  /** Configuration for action popup functionality (delete, reset, etc.) */
  popup?: PopupConfig;
  /** Icon component to display alongside the text */
  icon?: IconComponent | null;
  /** Whether to show loading spinner instead of icon */
  loading?: boolean;
  /** Whether to style the text as a clickable link with pointer cursor */
  link?: boolean;
  /** Whether to show hover background effect when link is true (default: true) */
  linkHover?: boolean;
  /** Custom content to render instead of the label text */
  children?: React.ReactNode;
  /** Additional pill/badge content to display */
  pill?: React.ReactNode;
}
