import type * as React from 'react';

export type CheckboxVariant = 'checkbox' | 'radio';

export interface CheckboxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'onChange'> {
  /**
   * If true, the component is checked.
   */
  checked?: boolean;
  /**
   * The default checked state. Use when the component is not controlled.
   */
  defaultChecked?: boolean;
  /**
   * If true, the component is disabled.
   */
  disabled?: boolean;
  /**
   * The checkbox type variant.
   */
  variant?: CheckboxVariant;
  /**
   * Callback fired when the state is changed.
   * @param checked - The new checked state
   */
  onChange?: (checked: boolean) => void;
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * The indicator style for the radio variant.
   * Only applies when `variant` is `'radio'`.
   * @default 'check'
   */
  radioIndicator?: 'check' | 'dot';
}

export interface CheckboxChangeEvent {
  checked: boolean;
}
