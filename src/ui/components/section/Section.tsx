import './Section.css';

import * as React from 'react';
import { useRef, useState } from 'react';

import { WarningCircleOutlineIcon } from '../../icons';
import { Tooltip } from '../tooltip';
import type { SectionProps } from './types';

export const Section = ({
  hide = false,
  borders = [],
  active = false,
  clickable = false,
  disabled = false,
  scrollable = false,
  width,
  height,
  backgroundColor,
  padding = 'var(--Spacing-12, 12px)',
  gap = 'var(--Spacing-8, 8px)',
  className = '',
  tooltip,
  disabledMessage,
  disabledTooltipWidth = '249px',
  children,
  onclick,
  onkeydown,
  onmouseover,
  onmouseleave,
  onfocus,
  onblur,
  style,
  ...restProps
}: SectionProps) => {
  // Generate unique ID (stable across renders)
  const [uniqueId] = useState(() => crypto.randomUUID());

  // Component state
  const sectionElement = useRef<HTMLDivElement | null>(null);

  // Handle click events
  function handleClick(event: MouseEvent) {
    if (disabled || !clickable) return;
    onclick?.(event);
  }

  // Handle keyboard events
  function handleKeydown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled || !clickable) return;

    // Activate on Enter or Space
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Call the click handler directly for better test compatibility
      handleClick(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }

    onkeydown?.(event.nativeEvent);
  }

  // Handle other events
  function handleMouseOver(event: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    onmouseover?.(event.nativeEvent);
  }

  function handleMouseLeave(event: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    onmouseleave?.(event.nativeEvent);
  }

  function handleFocus(event: React.FocusEvent<HTMLDivElement>) {
    if (disabled) return;
    onfocus?.(event.nativeEvent);
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (disabled) return;
    onblur?.(event.nativeEvent);
  }

  // Computed classes
  const classes = ['section-wrap'];
  if (active) classes.push('active');
  if (clickable) classes.push('clickable');
  if (disabled || disabledMessage) classes.push('disabled');
  if (scrollable) classes.push('scrollable');
  if (disabledMessage) classes.push('disabled-in-edit-mode');
  if (className) classes.push(className);
  // Add border classes
  borders.forEach((border) => {
    classes.push(`border-${border}`);
  });
  const computedClasses = classes.join(' ');

  // Computed inline styles
  const computedStyles: React.CSSProperties = {};
  if (width) computedStyles.width = width;
  if (height) computedStyles.height = height;
  if (backgroundColor) computedStyles.backgroundColor = backgroundColor;
  if (padding) computedStyles.padding = padding;
  if (gap) computedStyles.gap = gap;

  // Determine accessibility attributes based on clickable state
  const role = clickable ? 'button' : undefined;
  const tabindex = clickable ? (disabled ? -1 : 0) : undefined;
  const ariaDisabled = clickable ? disabled : undefined;

  // Determine tooltip configuration
  const shouldShowTooltip = !!tooltip?.message || !!tooltip?.tooltip;
  const shouldShowDisabledTooltip = !!disabledMessage;

  // Default disabled message
  const defaultDisabledMessage =
    disabledMessage ||
    `This option is disabled in edit mode. If you want to change it, please generate a new Component.`;

  const sectionContent = (
    <div
      ref={sectionElement}
      id={uniqueId}
      className={computedClasses}
      style={
        Object.keys(computedStyles).length > 0 || style
          ? { ...computedStyles, ...style }
          : undefined
      }
      role={role}
      {...(clickable ? { tabIndex: tabindex } : {})}
      aria-disabled={ariaDisabled}
      onClick={(e) => handleClick(e.nativeEvent)}
      onKeyDown={handleKeydown}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...restProps}
    >
      {scrollable ? <div className="scrollable-content">{children}</div> : children}
    </div>
  );

  if (hide) return null;

  if (shouldShowDisabledTooltip) {
    return (
      <Tooltip
        tooltipIcon={WarningCircleOutlineIcon}
        tooltipIconColor="var(--yellowText)"
        message={defaultDisabledMessage}
        width={disabledTooltipWidth}
        className="not-allowed"
        stopPropagation={false}
        target={sectionContent}
      />
    );
  }

  if (shouldShowTooltip) {
    return <Tooltip {...tooltip} stopPropagation={false} target={sectionContent} />;
  }

  return sectionContent;
};

export default Section;
