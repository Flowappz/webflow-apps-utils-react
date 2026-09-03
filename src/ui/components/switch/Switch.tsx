import './Switch.css';

import { useEffect, useMemo, useState } from 'react';

import type { SwitchChangeEvent, SwitchProps } from './types';

export const Switch = ({
  checked = false,
  disabled = false,
  id = '',
  ariaLabel,
  className = '',
  required = false,
  name,
  onchange,
  onCheckedChange,
}: SwitchProps) => {
  // Generate unique ID if not provided
  const switchId = useMemo(() => id || `switch-${Math.random().toString(36).substr(2, 9)}`, [id]);

  // Internal checked state (React replacement for the Svelte `$bindable`).
  const [internalChecked, setInternalChecked] = useState(checked);

  // Keep internal state in sync when the parent changes the prop.
  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  // State for tracking focus
  const [isFocused, setIsFocused] = useState(false);

  // Computed values
  const isDisabled = disabled;
  const isChecked = internalChecked;

  const setChecked = (newChecked: boolean) => {
    setInternalChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  /**
   * Handles input events on the toggle checkbox
   */
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (isDisabled) return;

    const target = event.target;
    const newChecked = target.checked;

    // Update internal state
    setChecked(newChecked);

    // Create event object
    const changeEvent: SwitchChangeEvent = {
      checked: newChecked,
      id: switchId,
    };

    // Call event handler
    onchange?.(changeEvent);
  };

  /**
   * Handle focus events
   */
  const handleFocus = (): void => {
    if (isDisabled) return;
    setIsFocused(true);
  };

  /**
   * Handle blur events
   */
  const handleBlur = (): void => {
    setIsFocused(false);
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeydown = (event: React.KeyboardEvent): void => {
    if (isDisabled) return;

    // Space or Enter toggles the switch
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      const newChecked = !internalChecked;
      setChecked(newChecked);

      const changeEvent: SwitchChangeEvent = {
        checked: newChecked,
        id: switchId,
      };

      onchange?.(changeEvent);
    }
  };

  // Computed classes for styling
  const labelClasses = (() => {
    const classes = ['switch'];
    if (isDisabled) classes.push('switch--disabled');
    if (isFocused) classes.push('switch--focused');
    if (className) classes.push(className);
    return classes.join(' ');
  })();

  return (
    <label className={labelClasses} htmlFor={switchId}>
      <input
        className="switch__input"
        type="checkbox"
        id={switchId}
        name={name || switchId}
        checked={internalChecked}
        disabled={isDisabled}
        required={required}
        aria-label={ariaLabel}
        aria-checked={isChecked}
        role="switch"
        tabIndex={isDisabled ? -1 : 0}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInput}
        onKeyDown={handleKeydown}
      />
      <div className="switch__track">
        <div className="switch__handle"></div>
      </div>
    </label>
  );
};
