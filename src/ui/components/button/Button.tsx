import './Button.css';

import * as React from 'react';
import { useRef } from 'react';

import { Loader } from '../Loader';
import { Tooltip } from '../tooltip';
import type { ButtonProps } from './types';

export const Button = ({
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  text = '',
  icon,
  rightIcon,
  iconColor = 'currentColor',
  iconSize = '16px',
  padding,
  className = '',
  loadingText = 'Please wait',
  fullWidth = false,
  tooltip,
  invalid = false,
  style,
  ariaLabel,
  children,
  onclick,
  ...restProps
}: ButtonProps) => {
  // Assign to capitalized variables for component usage
  const LeftIcon = icon;
  const RightIcon = rightIcon;

  // State for button element
  const buttonElementRef = useRef<HTMLButtonElement | null>(null);

  // Computed properties
  const isDisabled = disabled || loading || invalid;
  const hasLeftIcon = !!icon;
  const hasRightIcon = !!rightIcon;
  const hasText = !!text;
  const currentText = loading ? loadingText : text;
  const shouldShowTooltip = !!tooltip?.message || !!tooltip?.tooltip;

  // Default styling (no size variations)
  const computedPadding = padding || '4px 8px';
  const computedIconSize = iconSize;

  // Computed classes
  const buttonClasses = (() => {
    const classes = ['button', `button--${variant}`];

    if (fullWidth) classes.push('button--full-width');
    if (loading) classes.push('button--loading');
    if (className) classes.push(className);

    return classes.join(' ');
  })();

  // Computed styles
  const buttonStyles: React.CSSProperties = {
    padding: computedPadding,
    ...style,
  };

  const buttonElement = (
    <button
      ref={buttonElementRef}
      type={type}
      disabled={isDisabled}
      className={buttonClasses}
      style={buttonStyles}
      aria-label={ariaLabel}
      aria-busy={loading}
      onClick={onclick}
      {...restProps}
    >
      {children ? (
        children
      ) : loading ? (
        <div className="button__content">
          <Loader size={parseInt(computedIconSize)} color="currentColor" />
          {currentText ? <span className="button__text">{currentText}</span> : null}
        </div>
      ) : (
        <div className="button__content">
          {hasLeftIcon && LeftIcon ? (
            <div
              className="button__icon button__icon--left"
              style={{ color: iconColor, width: computedIconSize, height: computedIconSize }}
            >
              <LeftIcon />
            </div>
          ) : null}

          {hasText ? <span className="button__text">{currentText}</span> : null}

          {hasRightIcon && RightIcon ? (
            <div
              className="button__icon button__icon--right"
              style={{ color: iconColor, width: computedIconSize, height: computedIconSize }}
            >
              <RightIcon />
            </div>
          ) : null}
        </div>
      )}
    </button>
  );

  if (shouldShowTooltip) {
    return <Tooltip {...tooltip} stopPropagation={false} target={buttonElement} />;
  }

  return buttonElement;
};
