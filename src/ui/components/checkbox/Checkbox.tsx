import './Checkbox.css';

import { useRef, useState } from 'react';

import { SquareCheckIcon } from '../../icons';
import { RadioDotIcon } from './RadioDotIcon';
import type { CheckboxProps } from './types';

export const Checkbox = ({
  checked,
  defaultChecked = false,
  disabled = false,
  variant = 'checkbox',
  onChange,
  className = '',
  radioIndicator = 'check',
  ...restProps
}: CheckboxProps) => {
  // Component state
  const checkboxElementRef = useRef<HTMLDivElement | null>(null);

  // Internal state for uncontrolled usage (intentionally captures initial value)
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  // Determine if component is controlled (checked prop is provided)
  const isControlled = checked !== undefined;

  // Current checked state - use controlled value if provided, otherwise internal state
  const isChecked = isControlled ? checked : internalChecked;
  const isDisabled = disabled;

  // CSS class computation
  const checkboxClasses = `
		checkbox
		checkbox--${variant}
		${isChecked ? 'checkbox--checked' : ''}
		${isDisabled ? 'checkbox--disabled' : ''}
		${className}
	`
    .trim()
    .replace(/\s+/g, ' ');

  /**
   * Handles click events on the checkbox
   */
  const handleClick = (): void => {
    if (isDisabled) return;

    const newChecked = !isChecked;

    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    // Always call onChange callback
    onChange?.(newChecked);
  };

  /**
   * Handles keyboard events for accessibility
   */
  const handleKeydown = (event: React.KeyboardEvent): void => {
    if (isDisabled) return;

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      ref={checkboxElementRef}
      className={checkboxClasses}
      onClick={handleClick}
      onKeyDown={handleKeydown}
      role="checkbox"
      tabIndex={isDisabled ? -1 : 0}
      aria-checked={isChecked}
      aria-disabled={isDisabled}
      {...restProps}
    >
      {isChecked ? (
        variant === 'radio' && radioIndicator === 'dot' ? (
          <RadioDotIcon />
        ) : (
          <SquareCheckIcon />
        )
      ) : null}
    </div>
  );
};
