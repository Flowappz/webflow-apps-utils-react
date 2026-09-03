import type { Placement } from '@floating-ui/dom';
import type * as React from 'react';

import type { IconComponent } from '../../types';

export type AlertType = 'error' | 'success' | 'info' | 'warning';

export interface AlertConfig {
  type: AlertType;
  message: string;
}

export type SelectValue = string & {
  readonly brand: unique symbol;
};

export type SelectClassName = string & {
  readonly brand: unique symbol;
};

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  labelIcon?: IconComponent;
  descriptionTitle?: string;
  isDisabled?: boolean;
  className?: string;
}

export interface SelectChangeEvent {
  value: string | null;
}

export type SelectChangeHandler = (event: SelectChangeEvent) => void;

export interface SelectFooterProps {
  close: () => void;
}

export interface SelectProps {
  id?: string;
  defaultText?: string;
  label?: string;
  dialog?: boolean;
  hide?: boolean;
  enableSearch?: boolean;
  tooltipMessage?: string;
  ref?: string;
  width?: string;
  tooltipWidth?: string;
  dropdownWidth?: string;
  dropdownHeight?: string;
  options: SelectOption[];
  selected?: string | null;
  /**
   * Callback fired when the selected value changes (React replacement for
   * Svelte's `bind:selected`)
   */
  onSelectedChange?: (value: string | null) => void;
  preventNoSelection?: boolean;
  disabled?: boolean;
  placement?: Placement;
  /**
   * Alert configuration for showing validation messages
   */
  alert?: AlertConfig | null;
  /**
   * If true, the dropdown will close when the Escape key is pressed
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * If true, the dropdown will close when clicking outside the component
   * @default true
   */
  closeOnClickOutside?: boolean;
  /**
   * If true, the select will be invalid
   */
  invalid?: boolean;
  className?: string;
  /**
   * Callback fired when the dropdown opens
   */
  onOpen?: () => void;
  /**
   * When true, disables all dropdown items and search input.
   * Useful for showing a loading/refreshing state while items are being updated.
   */
  itemsDisabled?: boolean;
  /**
   * Message displayed as an overlay when itemsDisabled is true.
   * Helps communicate to users why items are unavailable (e.g. "Refreshing...").
   */
  itemsDisabledMessage?: string;
  onchange?: SelectChangeHandler;
  children?: React.ReactNode;
  /**
   * Footer render function for custom actions at the bottom of the dropdown.
   * Receives { close } function to close the dropdown.
   */
  footer?: (props: SelectFooterProps) => React.ReactNode;
}

export interface SelectState {
  isOpen: boolean;
  isFocused: boolean;
  isHovered: boolean;
  hasError: boolean;
  showConfirmDialog: boolean;
  selectedLabel: string;
  lastHoveredItem: HTMLElement | null;
  activeElement: HTMLElement | null;
}

export interface DropdownInstance {
  toggle: HTMLElement;
  tooltip: HTMLElement;
  cleanup: () => void;
}

export interface DropdownConfig {
  placement: Placement;
  width: string;
  height: string;
  enableSearch: boolean;
  preventNoSelection: boolean;
}

export interface SelectStyles {
  borderRadius?: string;
  background?: string;
  boxShadow?: string;
  border?: string;
  opacity?: string;
}

export type NavigationKey = 'ArrowDown' | 'ArrowUp' | 'Enter' | 'Escape';

export interface KeyboardNavigationEvent {
  key: NavigationKey;
  currentIndex: number;
  items: HTMLElement[];
}

export interface SearchConfig {
  enabled: boolean;
  debounceMs: number;
  placeholder: string;
}

export type FilterFunction = (options: SelectOption[], searchTerm: string) => SelectOption[];

export interface SelectElementRefs {
  confirmDialogElement?: HTMLElement;
  dropdownWrapper?: HTMLElement;
  target?: HTMLDivElement;
  dropdownItems?: HTMLDivElement;
}

export interface SelectInstanceManager {
  result: DropdownInstance[];
  destroy(): void;
}
