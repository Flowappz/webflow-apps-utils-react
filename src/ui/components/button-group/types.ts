export interface ButtonGroupOption {
  /**
   * Display name for the button
   */
  name: string;
  /**
   * Value associated with the button
   */
  value: string;
}

export interface ButtonGroupProps {
  /**
   * Unique identifier for the button group
   */
  id?: string;
  /**
   * Array of button options
   */
  buttons?: ButtonGroupOption[];
  /**
   * Currently selected value.
   *
   * (Was `$bindable` in the Svelte source — the React port keeps an internal
   * selection state seeded/synced from this prop and reports changes through
   * `onselect` / `onSelectedChange`.)
   */
  selected?: string;
  /**
   * Whether the entire button group is disabled
   */
  disabled?: boolean;
  /**
   * Event handler called when a button is selected
   */
  onselect?: (value: string) => void;
  /**
   * Called whenever the internal selection changes (React replacement for the
   * Svelte `bind:selected` two-way binding).
   */
  onSelectedChange?: (value: string) => void;
}
