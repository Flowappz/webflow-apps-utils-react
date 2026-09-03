import type * as React from 'react';

import type { AlertConfig } from '../input/types';

export interface TagsInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'width' | 'height' | 'children' | 'className'
  > {
  /**
   * Array of tag values
   */
  value?: string[];
  /**
   * Placeholder text when no tags and input is empty
   */
  placeholder?: string;
  /**
   * Input field id
   */
  id?: string;
  /**
   * If true, the input field will be disabled
   */
  disabled?: boolean;
  /**
   * If true, the component will show loading state
   */
  loading?: boolean;
  /**
   * If true, the input field will be invalid
   */
  invalid?: boolean;
  /**
   * If true, the input field will be readonly (no adding/removing tags)
   */
  readonly?: boolean;
  /**
   * Defines the alert message to show
   */
  alert?: AlertConfig | null;
  /**
   * Maximum number of tags allowed
   */
  maxTags?: number | null;
  /**
   * Minimum number of tags required (for validation display)
   */
  minTags?: number | null;
  /**
   * Maximum length of each tag
   */
  maxTagLength?: number | null;
  /**
   * Separator keys to trigger tag creation (default: ['Enter', ','])
   */
  separatorKeys?: string[];
  /**
   * Whether to allow duplicate tags (default: false)
   */
  allowDuplicates?: boolean;
  /**
   * Custom validation function for tags
   * Return true if valid, false or error message string if invalid
   */
  validateTag?: (tag: string) => boolean | string;
  /**
   * Whether to trim whitespace from tags (default: true)
   */
  trimTags?: boolean;
  /**
   * When true, pasting HTML (clipboard `text/html` or plain text containing markup) will add one tag
   * per non-empty `src` on `script`, `iframe`, and `img` elements instead of pasting raw markup into the field.
   */
  parseSrcFromHtmlPaste?: boolean;
  /**
   * Whether to always show the remove icon on tags (default: false)
   * When true: remove button is inline, 4px gap, no padding on close button
   * When false: remove button is absolute positioned, appears on hover
   */
  showRemoveIcon?: boolean;
  /**
   * Whether clicking a tag expands it to show full content (default: false)
   * When true: clicking a tag removes ellipsis and shows full text
   * When false: long tags are always truncated with ellipsis
   */
  expandOnClick?: boolean;
  /**
   * Custom width for the component
   */
  width?: string;
  /**
   * Custom height for the component
   */
  height?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Event handler for value changes
   */
  onValueChange?: (tags: string[]) => void;
  /**
   * Event handler for individual tag addition
   */
  onTagAdd?: (tag: string) => void;
  /**
   * Event handler for individual tag removal
   */
  onTagRemove?: (tag: string, index: number) => void;
  /**
   * Event handler for invalid tag attempt
   */
  onInvalidTag?: (tag: string, reason: string) => void;
  /**
   * Event handler for focus events
   */
  onfocus?: (event: FocusEvent) => void;
  /**
   * Event handler for blur events
   */
  onblur?: (event: FocusEvent) => void;
  /**
   * Event handler for keydown events
   */
  onkeydown?: (event: KeyboardEvent) => void;
  /**
   * Event handler for paste events on the input (runs only when default paste is not replaced by HTML src extraction)
   */
  onpaste?: (event: ClipboardEvent) => void;
  /**
   * Children content (if any)
   */
  children?: React.ReactNode;
}

export interface TagAddEvent {
  tag: string;
}

export interface TagRemoveEvent {
  tag: string;
  index: number;
}

export interface InvalidTagEvent {
  tag: string;
  reason: string;
}

export interface TagsValueChangeEvent {
  tags: string[];
}
