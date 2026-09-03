import './Input.css';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Text } from '../text';
import { Tooltip } from '../tooltip';
import type { InputProps } from './types';

export const Input = ({
  value = '',
  placeholder = '',
  id = 'webflow-input',
  fontSize = 'var(--font-size-small)',
  color = '',
  units = '',
  height = '24px',
  width = 'auto',
  autofocus = false,
  disabled = false,
  invalid = false,
  maxLength = null,
  minLength = null,
  readonly = false,
  type = 'text',
  alert = null,
  pill = null,
  showSteppers = false,
  step = 1,
  min = undefined,
  max = undefined,
  debounce = 0,
  oninput,
  onblur,
  onfocus,
  onkeydown,
  onValueChange,
  className = '',
  children,
  ...restProps
}: InputProps) => {
  // Validation: showSteppers can only be used with type="number"
  if (showSteppers && type !== 'number') {
    throw new Error('showSteppers can only be used when type="number"');
  }

  // Validation: showSteppers and units cannot be used together
  if (showSteppers && units) {
    throw new Error('showSteppers and units cannot be used together');
  }

  // Component state
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  const pillElementRef = useRef<HTMLSpanElement | null>(null);
  const [pillWidth, setPillWidth] = useState(0);

  // Internal reactive state for input value that updates with steppers
  const [internalValue, setInternalValue] = useState(value);

  // Track HTML5 validation state
  const [isValidationInvalid, setIsValidationInvalid] = useState(false);

  // Debounce timer for input events
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use internal value for reactive state management
  const currInputValue = internalValue;
  const computedColor = currInputValue ? 'var(--actionPrimaryText)' : 'var(--text3)';

  const hasPill = currInputValue && pill;
  const hasAlert = alert?.message;

  // Parse numeric value for stepper operations
  const numericValue = (() => {
    if (!showSteppers || !currInputValue) return 0;
    const parsed = parseFloat(currInputValue);
    return isNaN(parsed) ? 0 : parsed;
  })();

  // Check if increment/decrement buttons should be disabled
  const canIncrement = (() => {
    if (!showSteppers || disabled || readonly) return false;
    if (max !== undefined) return numericValue < max;
    return true;
  })();

  const canDecrement = (() => {
    if (!showSteppers || disabled || readonly) return false;
    if (min !== undefined) return numericValue > min;
    return true;
  })();

  // Sync external value prop changes to internal state
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const wrapperClasses = `
		webflow-input-wrapper
		${units ? 'units' : ''}
		${showSteppers ? 'steppers' : ''}
		${disabled ? 'disabled' : ''}
		${invalid || hasAlert || isValidationInvalid ? 'invalid' : ''}
		${className}
	`
    .trim()
    .replace(/\s+/g, ' ');

  const inputClasses = `
		webflow-input
		${hasPill ? 'has-pill' : ''}
	`
    .trim()
    .replace(/\s+/g, ' ');

  /**
   * Updates the pill position and width based on the current input value
   */
  const updatePillPosition = () => {
    const inputElement = inputElementRef.current;
    const pillElement = pillElementRef.current;
    if (inputElement && pillElement && internalValueRef.current) {
      // Create a temporary span to measure text width
      const temp = document.createElement('span');
      temp.style.display = 'inline-block';
      temp.style.font = window.getComputedStyle(inputElement).font;
      temp.style.visibility = 'hidden';
      temp.style.position = 'absolute';
      temp.textContent = internalValueRef.current;
      document.body.appendChild(temp);

      const textWidth = temp.offsetWidth;
      document.body.removeChild(temp);

      const wrapperWidth = inputElement.parentElement?.clientWidth || 0;
      const maxPillWidth = wrapperWidth - 8;

      const calculatedWidth = Math.min(Math.max(textWidth, 4) + 8, maxPillWidth);
      pillElement.style.width = `${calculatedWidth}px`;
    }
  };

  // Latest value, readable from imperative helpers
  const internalValueRef = useRef(internalValue);
  internalValueRef.current = internalValue;

  /**
   * Measures the pill width using canvas for more accurate text measurement
   */
  const measurePillWidth = (text: string) => {
    if (!text) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    const inputElement = inputElementRef.current;
    if (inputElement) {
      context.font = window.getComputedStyle(inputElement).font;
    } else {
      context.font = `normal ${fontSize} Inter`;
    }

    const metrics = context.measureText(text);
    setPillWidth(Math.max(metrics.width, 4) + 8);
  };

  /**
   * Updates validation state based on HTML5 input validity
   */
  const updateValidationState = () => {
    const inputElement = inputElementRef.current;
    if (inputElement && type === 'number') {
      // Check if the input has any validation errors
      setIsValidationInvalid(!inputElement.validity.valid);
    } else {
      setIsValidationInvalid(false);
    }
  };

  // Update pill position when value changes
  useEffect(() => {
    if (pill && internalValue) {
      updatePillPosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pill, internalValue]);

  // Focus management (Svelte onMount)
  useEffect(() => {
    if (autofocus && inputElementRef.current) {
      inputElementRef.current.focus();
    }
    updatePillPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update pill width when value changes
  useEffect(() => {
    if (pill && internalValue) {
      measurePillWidth(internalValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pill, internalValue]);

  // Update validation state when input value changes
  useEffect(() => {
    if (inputElementRef.current) {
      // Use setTimeout to ensure the input element has been updated
      const timeout = setTimeout(updateValidationState, 0);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalValue]);

  // Listen for form reset events to update internal state
  useEffect(() => {
    const inputElement = inputElementRef.current;
    if (inputElement) {
      const form = inputElement.closest('form');
      if (form) {
        const handleFormReset = () => {
          // Use setTimeout to allow the form reset to complete first
          setTimeout(() => {
            if (inputElementRef.current) {
              const resetValue = inputElementRef.current.value;
              setInternalValue(resetValue);
              updateValidationState();
            }
          }, 0);
        };

        form.addEventListener('reset', handleFormReset);

        return () => {
          form.removeEventListener('reset', handleFormReset);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup debounce timer on component destruction
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  /**
   * Debounced oninput handler
   */
  const debouncedOninput = (inputValue: string) => {
    if (debounce > 0) {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        oninput?.(inputValue);
        debounceTimerRef.current = null;
      }, debounce);
    } else {
      // No debouncing, call immediately
      oninput?.(inputValue);
    }
  };

  /**
   * Handles input events
   */
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const inputValue = target?.value?.trim() || '';

    // Update internal state for reactivity
    setInternalValue(inputValue);
    internalValueRef.current = inputValue;

    if (pill) {
      setTimeout(updatePillPosition, 0);
    }

    // Call numeric value change handler for any number input when value is numeric
    if (type === 'number' && inputValue) {
      const parsed = parseFloat(inputValue);
      if (!isNaN(parsed)) {
        onValueChange?.(parsed);
      }
    }

    // Update validation state for real-time feedback
    updateValidationState();

    // Call debounced oninput handler
    debouncedOninput(inputValue);
  };

  /**
   * Handles blur events
   */
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const target = event.target;
    const inputValue = target?.value?.trim() || '';

    onblur?.(inputValue);
  };

  /**
   * Handles focus events
   */
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    onfocus?.(event);
  };

  /**
   * Handles keydown events
   */
  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle arrow key increments/decrements when steppers are enabled
    if (showSteppers && !disabled && !readonly) {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        handleIncrement();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        handleDecrement();
      }
    }

    onkeydown?.(event);
  };

  /**
   * Handles increment button click
   */
  const handleIncrement = () => {
    if (!canIncrement) return;

    const currentNum = numericValue;
    let newValue = currentNum + step;

    // Apply max constraint
    if (max !== undefined && newValue > max) {
      newValue = max;
    }

    const newStringValue = newValue.toString();

    // Update internal state for reactivity
    setInternalValue(newStringValue);
    internalValueRef.current = newStringValue;

    // Trigger change events
    onValueChange?.(newValue);
    debouncedOninput(newStringValue);
  };

  /**
   * Handles decrement button click
   */
  const handleDecrement = () => {
    if (!canDecrement) return;

    const currentNum = numericValue;
    let newValue = currentNum - step;

    // Apply min constraint
    if (min !== undefined && newValue < min) {
      newValue = min;
    }

    const newStringValue = newValue.toString();

    // Update internal state for reactivity
    setInternalValue(newStringValue);
    internalValueRef.current = newStringValue;

    // Trigger change events
    onValueChange?.(newValue);
    debouncedOninput(newStringValue);
  };

  /**
   * Gets the tooltip background color based on alert type
   */
  const getTooltipColor = (alertType: string) => {
    switch (alertType) {
      case 'error':
        return 'var(--redBackground, #ff4d4d)';
      case 'warning':
        return 'var(--orangeBackground, #ff9933)';
      case 'success':
        return 'var(--greenBackground, #00cc66)';
      case 'info':
      default:
        return 'var(--actionPrimaryBackground, #4d9fff)';
    }
  };

  const inputWrapper = (
    <div className={wrapperClasses} style={{ height, width }} role="group">
      {currInputValue && pill ? (
        <span
          className={`pill ${pill === 'blue' ? 'blue' : ''} ${pill === 'gray' ? 'gray' : ''}`.trim()}
          ref={pillElementRef}
          style={{ width: `${pillWidth}px` }}
        ></span>
      ) : null}

      <input
        ref={inputElementRef}
        id={id}
        className={inputClasses}
        placeholder={placeholder}
        readOnly={readonly}
        disabled={disabled}
        type={type}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength ?? undefined}
        minLength={minLength ?? undefined}
        value={currInputValue}
        onChange={handleInput}
        onFocus={handleFocus}
        onKeyDown={handleKeydown}
        onBlur={handleBlur}
        style={{ fontSize, color: computedColor }}
        {...restProps}
      />

      {units && !showSteppers ? <div className="input-units-steppers">{units}</div> : null}

      {showSteppers && !units ? (
        <div className="input-units-steppers steppers">
          <button
            type="button"
            className="stepper-button stepper-up"
            disabled={!canIncrement}
            onClick={handleIncrement}
            aria-label="Increment value"
          >
            <span className="stepper-button-icon">&#8963;</span>
          </button>
          <button
            type="button"
            className="stepper-button stepper-down"
            disabled={!canDecrement}
            onClick={handleDecrement}
            aria-label="Decrement value"
          >
            <span className="stepper-button-icon">&#8963;</span>
          </button>
        </div>
      ) : null}

      {children}
    </div>
  );

  return (
    <Tooltip
      message={hasAlert ? alert?.message || '' : ''}
      placement="top"
      listener="hover"
      listenerout="hover"
      showArrow={true}
      hidden={!hasAlert}
      disabled={!hasAlert || !alert?.message}
      fontColor="var(--actionPrimaryText)"
      width="max-content"
      padding="6px"
      bgColor={getTooltipColor(alert?.type || 'info')}
      className="input-tooltip"
      target={inputWrapper}
    />
  );
};
