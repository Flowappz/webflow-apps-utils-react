import type * as React from 'react';

import type { IconComponent } from '../../types';
import type { TooltipProps } from '../tooltip/types';

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'cms';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'style' | 'children'> {
  /**
   * Button type for form submission
   */
  type?: ButtonType;
  /**
   * Visual variant of the button
   */
  variant?: ButtonVariant;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show loading state
   */
  loading?: boolean;
  /**
   * Button text content
   */
  text?: string;
  /**
   * Left icon component
   */
  icon?: IconComponent | null;
  /**
   * Right icon component
   */
  rightIcon?: IconComponent | null;
  /**
   * Icon color (defaults to currentColor)
   */
  iconColor?: string;
  /**
   * Icon size
   */
  iconSize?: string;
  /**
   * Custom padding override
   */
  padding?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Loading text override
   */
  loadingText?: string;
  /**
   * Whether button should take full width
   */
  fullWidth?: boolean;
  /**
   * Tooltip configuration object with all tooltip props
   */
  tooltip?: Partial<TooltipProps>;
  /**
   * Whether button is in invalid state
   */
  invalid?: boolean;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
  /**
   * Custom content
   */
  children?: React.ReactNode;
  /**
   * Click event handler
   */
  onclick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
