import type * as React from 'react';

export type AlertType = 'error' | 'success' | 'info' | 'warning';
export type PillVariant = 'blue' | 'gray' | null;

export interface AlertConfig {
  type: AlertType;
  message: string;
}

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'onInput'
    | 'onBlur'
    | 'onFocus'
    | 'onKeyDown'
    | 'onChange'
    | 'height'
    | 'width'
    | 'color'
    | 'maxLength'
    | 'minLength'
    | 'step'
    | 'min'
    | 'max'
    | 'children'
  > {
  /**
   * Input field value
   */
  value?: string;
  /**
   * Input field placeholder
   */
  placeholder?: string;
  /**
   * Input field id
   */
  id?: string;
  /**
   * Input field font size
   */
  fontSize?: string;
  /**
   * Input field font color
   */
  color?: string;
  /**
   * Optional: If set it will add an element to the right of the input field and show the unit.
   * Cannot be used together with showSteppers
   */
  units?: string;
  /**
   * Input field height, default is auto
   */
  height?: string;
  /**
   * Input field width, default is auto
   */
  width?: string;
  /**
   * If true, the input field will be focused when the component is mounted
   */
  autofocus?: boolean;
  /**
   * If true, the input field will be disabled
   */
  disabled?: boolean;
  /**
   * If true, the input field will be invalid
   */
  invalid?: boolean;
  /**
   * Defines the maximum length of the input field
   */
  maxLength?: number | null;
  /**
   * Defines the minimum length of the input field
   */
  minLength?: number | null;
  /**
   * If true, the input field will be readonly
   */
  readonly?: boolean;
  /**
   * Defines the type of the input field
   */
  type?: string;
  /**
   * Defines the message to show
   */
  alert?: AlertConfig | null;
  /**
   * If set, wraps the input value with a pill background
   * Possible values: 'blue', 'gray', or null/undefined for no pill
   */
  pill?: PillVariant;
  /**
   * Shows increment/decrement buttons for number inputs.
   * Only available when type="number"
   */
  showSteppers?: boolean;
  /**
   * Step value for increment/decrement buttons.
   */
  step?: number;
  /**
   * Minimum value for number input.
   */
  min?: number;
  /**
   * Maximum value for number input.
   */
  max?: number;
  /**
   * Debounce delay in milliseconds for input events.
   * When set, oninput will be debounced by this amount.
   * Default is no debouncing (0).
   */
  debounce?: number;
  /**
   * Event handler for input changes - receives the trimmed string value
   */
  oninput?: (value: string) => void;
  /**
   * Event handler for blur events - receives the trimmed string value
   */
  onblur?: (value: string) => void;
  /**
   * Event handler for focus events - receives the standard FocusEvent
   */
  onfocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Event handler for keydown events - receives the standard KeyboardEvent
   */
  onkeydown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Event handler for numeric value changes - receives the numeric value
   * Only called when showSteppers is true and value is a valid number
   */
  onValueChange?: (value: number) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Children content (if any)
   */
  children?: React.ReactNode;
}

export interface InputEvent {
  value: string;
}

export interface BlurEvent {
  value: string;
}

export interface NumericValueChangeEvent {
  value: number;
}
