import type * as React from 'react';

import type { TooltipProps } from '../tooltip/types';

export type BorderPosition = 'top' | 'right' | 'bottom' | 'left';

export interface SectionProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onClick' | 'onKeyDown' | 'onMouseOver' | 'onMouseLeave' | 'onFocus' | 'onBlur'
  > {
  /**
   * Whether to hide the section completely
   */
  hide?: boolean;
  /**
   * Array of border positions to apply
   */
  borders?: BorderPosition[];
  /**
   * Whether the section is in active state
   */
  active?: boolean;
  /**
   * Whether the section should be clickable with keyboard support
   */
  clickable?: boolean;
  /**
   * Whether the section is disabled
   */
  disabled?: boolean;
  /**
   * Whether the section content should be scrollable (native browser scrolling)
   */
  scrollable?: boolean;
  /**
   * Width of the section (CSS value)
   */
  width?: string;
  /**
   * Height of the section (CSS value)
   */
  height?: string;
  /**
   * Background color of the section (CSS color value)
   */
  backgroundColor?: string;
  /**
   * Padding of the section (CSS value) - defaults to var(--Spacing-12, 12px)
   */
  padding?: string;
  /**
   * Gap between child elements (CSS value) - defaults to var(--Spacing-8, 8px)
   */
  gap?: string;
  /**
   * Additional CSS classes to apply
   */
  className?: string;
  /**
   * Tooltip configuration
   */
  tooltip?: TooltipProps;
  /**
   * Message to show when section is disabled in edit mode
   */
  disabledMessage?: string;
  /**
   * Width of the disabled tooltip
   */
  disabledTooltipWidth?: string;
  /**
   * Content to render inside the section
   */
  children?: React.ReactNode;
  /**
   * Click event handler
   */
  onclick?: (event: MouseEvent) => void;
  /**
   * Keydown event handler
   */
  onkeydown?: (event: KeyboardEvent) => void;
  /**
   * Mouse over event handler
   */
  onmouseover?: (event: MouseEvent) => void;
  /**
   * Mouse leave event handler
   */
  onmouseleave?: (event: MouseEvent) => void;
  /**
   * Focus event handler
   */
  onfocus?: (event: FocusEvent) => void;
  /**
   * Blur event handler
   */
  onblur?: (event: FocusEvent) => void;
}

export interface SectionEvents {
  click: {
    detail: MouseEvent;
  };
  keydown: {
    detail: KeyboardEvent;
  };
  mouseover: {
    detail: MouseEvent;
  };
  mouseleave: {
    detail: MouseEvent;
  };
  focus: {
    detail: FocusEvent;
  };
  blur: {
    detail: FocusEvent;
  };
}
