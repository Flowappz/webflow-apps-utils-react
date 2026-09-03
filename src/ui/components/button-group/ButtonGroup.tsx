import './ButtonGroup.css';

import { useEffect, useState } from 'react';

import type { ButtonGroupProps } from './types';

export const ButtonGroup = ({
  id,
  buttons = [],
  selected,
  disabled = false,
  onselect,
  onSelectedChange,
}: ButtonGroupProps) => {
  // Internal selection state (React replacement for the Svelte `$bindable`).
  const [internalSelected, setInternalSelected] = useState<string | undefined>(selected);

  // Keep internal state in sync when the parent changes the prop.
  useEffect(() => {
    setInternalSelected(selected);
  }, [selected]);

  /**
   * Sets selected value and dispatches the select event.
   * @param value
   */
  const selectButton = (value: string) => {
    if (disabled) return;
    setInternalSelected(value);
    onSelectedChange?.(value);
    onselect?.(value);
  };

  /**
   * Handles the keydown event for the button.
   * @param event
   * @param value
   */
  const handleKeydown = (event: React.KeyboardEvent, value: string) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      selectButton(value);
      event.preventDefault();
    }
  };

  return (
    <div className="btn-group">
      {buttons.map(({ name, value }, index) => (
        <div
          key={index}
          id={id}
          className={`btn ${internalSelected === value ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => selectButton(value)}
          onKeyDown={(event) => handleKeydown(event, value)}
          aria-disabled={disabled}
        >
          {name}
        </div>
      ))}
    </div>
  );
};
