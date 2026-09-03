export interface SwitchChangeEvent {
  checked: boolean;
  id?: string;
}

export type SwitchChangeHandler = (event: SwitchChangeEvent) => void;

export interface SwitchProps {
  /**
   * Whether the switch is checked.
   *
   * (Was `$bindable` in the Svelte source — the React port keeps an internal
   * checked state seeded/synced from this prop and reports changes through
   * `onchange` / `onCheckedChange`.)
   */
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
  className?: string;
  required?: boolean;
  name?: string;
  onchange?: SwitchChangeHandler;
  /**
   * Called whenever the internal checked state changes (React replacement for
   * the Svelte `bind:checked` two-way binding).
   */
  onCheckedChange?: (checked: boolean) => void;
}

export interface SwitchState {
  checked: boolean;
  disabled: boolean;
  focused: boolean;
}

export interface SwitchAccessibilityConfig {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: string;
}

export interface SwitchAnimationConfig {
  duration: number;
  easing: string;
  enabled: boolean;
}

export interface SwitchThemeConfig {
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'success' | 'warning' | 'danger';
  customColors?: {
    background?: string;
    checkedBackground?: string;
    border?: string;
    checkedBorder?: string;
    handle?: string;
  };
}

export interface SwitchEvents {
  change: SwitchChangeEvent;
  focus: FocusEvent;
  blur: FocusEvent;
}
