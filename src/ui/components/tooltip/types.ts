import type { Placement } from '@floating-ui/dom';
import type * as React from 'react';

import type { IconComponent } from '../../types';

export type TooltipListener = 'click' | 'hover';

export interface TooltipHandle {
  /** Shows the tooltip imperatively */
  show: () => void;
  /** Hides the tooltip imperatively */
  hide: () => void;
  /** Ignores the next document click (useful after drag operations) */
  ignoreNextClickEvent: () => void;
}

export interface TooltipProps {
  /**
   * Event handler for tooltip show
   */
  onshow?: (event: boolean) => void;
  /**
   * Event handler for tooltip show
   */
  onclose?: (event: boolean) => void;
  /**
   * The tooltip message content
   */
  message?: string;
  /**
   * How the tooltip is triggered
   */
  listener?: TooltipListener;
  /**
   * How the tooltip is dismissed
   */
  listenerout?: TooltipListener;
  /**
   * Tooltip placement position
   */
  placement?: Placement;
  /**
   * CSS position property
   */
  position?: string;
  /**
   * Whether to show arrow pointer
   */
  showArrow?: boolean;
  /**
   * Offset distance from target
   */
  offsetVal?: number;
  /**
   * Whether tooltip is hidden.
   *
   * (Was `$bindable` in the Svelte source — the component never writes it back,
   * so in React it is a plain one-way prop: setting it to `true` hides the tooltip.)
   */
  hidden?: boolean;
  /**
   * Whether tooltip is disabled
   */
  disabled?: boolean;
  /**
   * Icon component to display
   */
  tooltipIcon?: IconComponent | null;
  /**
   * Color for the tooltip icon
   */
  tooltipIconColor?: string;
  /**
   * Tooltip width
   */
  width?: string;
  /**
   * Tooltip padding
   */
  padding?: string;
  /**
   * Whether to render message as raw HTML, it means message may contain HTML tags that needs to be renderd
   */
  raw?: boolean;
  /**
   * Whether tooltip is currently active.
   *
   * (Was `$bindable` in the Svelte source — in React the component manages the
   * active state internally and reports changes through `onIsActiveChange`.)
   */
  isActive?: boolean;
  /**
   * Called whenever the internal active state changes (React replacement for
   * the Svelte `bind:isActive` two-way binding).
   */
  onIsActiveChange?: (isActive: boolean) => void;
  /**
   * Fallback placements if primary placement doesn't fit
   */
  fallbackPlacements?: Placement[];
  /**
   * Whether to stop event propagation
   */
  stopPropagation?: boolean;
  /**
   * Font color for tooltip text
   */
  fontColor?: string;
  /**
   * Target element class name
   */
  targetClassName?: string;
  /**
   * Target element (what triggers the tooltip)
   */
  target?: React.ReactNode;
  /**
   * Tooltip content (custom tooltip content)
   */
  tooltip?: React.ReactNode;
  /**
   * Default target text when no target snippet is provided (for Storybook compatibility)
   *
   * If not provided, the text will be automatically generated based on the trigger configuration:
   * - Click trigger: "Click me!"
   * - Hover trigger: "Hover me!"
   * - Mixed triggers: Descriptive text based on the combination
   */
  targetText?: string;
  /**
   * Additional CSS classes to apply to the tooltip
   */
  className?: string;
  /**
   * Background color for the tooltip and arrow
   */
  bgColor?: string;
  /**
   * Imperative handle exposing `show`/`hide`/`ignoreNextClickEvent`
   * (React replacement for the Svelte component's exported functions).
   */
  ref?: React.Ref<TooltipHandle>;
}

export interface TooltipInstance {
  toggle: HTMLElement;
  tooltip: HTMLElement;
  arrowElement?: HTMLElement;
  cleanup: () => void;
  showTooltip: () => void;
  hideTooltip: () => void;
}

export interface TooltipEvents {
  show: boolean;
  close: boolean;
}
