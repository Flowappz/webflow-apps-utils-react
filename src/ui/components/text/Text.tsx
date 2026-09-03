import './Text.css';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { DeleteIcon } from '../../icons';
import { Loader } from '../Loader';
import { Tooltip } from '../tooltip/Tooltip';
import type { TEXT_SIZES, TEXT_WEIGHTS, TextClickEvent, TextPopupActionEvent, TextProps } from './types';

// Text size and weight mappings
const textFontSizes: Record<TEXT_SIZES, string> = {
  normal: '11.5px',
  large: '12.5px',
};

const textFontWeights: Record<TEXT_WEIGHTS, string> = {
  normal: '400',
  bold: '600',
};

export const Text = ({
  // Basic text properties
  label = '',
  className = '',
  raw = false,
  capitalize = false,
  disabled = false,
  title = '',
  wrap = 'normal',
  textAlign = 'left',
  fontSize = 'normal',
  fontWeight = 'normal',
  fontColor = 'var(--actionPrimaryText)',
  height = '',
  ellipsisOnWidth = '',

  // Tooltip configuration - pass any tooltip props
  tooltip,
  tooltipTarget = 'icon',

  // Popup configuration - for action popups (reset, delete, etc.)
  popup,

  // Icon and loading
  icon = null,
  loading = false,

  // Link behavior
  link = false,
  linkHover = true,

  // Event handlers
  onclick,

  // Children / pill content
  children,
  pill,

  ...restProps
}: TextProps & {
  onclick?: (event: MouseEvent) => void;
} & Record<string, unknown>) => {
  // Derived computed values
  const computedFontSize = () => {
    const fontSizeKey = fontSize as keyof typeof textFontSizes;
    return textFontSizes[fontSizeKey] || fontSize;
  };

  const computedFontWeight = () => {
    const fontWeightKey = fontWeight as keyof typeof textFontWeights;
    return textFontWeights[fontWeightKey] || fontWeight;
  };

  // State for popup functionality
  const [isPopupHidden, setIsPopupHidden] = useState(true);
  const wrapperElementRef = useRef<HTMLDivElement | null>(null);
  const popupElementRef = useRef<HTMLDivElement | null>(null);

  // Computed popup configuration with defaults
  const popupConfig = {
    disabled: popup?.disabled ?? false,
    title: popup?.title ?? 'Remove',
    subtitle: popup?.subtitle ?? 'Alt + click',
    onclick: popup?.onclick ?? null,
    description: popup?.description ?? 'This action will remove the current selection.',
    icon: popup?.icon ?? DeleteIcon,
    active: popup?.active ?? false,
  };

  // Dynamic component assignments
  const IconComponent = icon;
  const PopupIconComponent = popupConfig.icon;

  // Check if popup should be enabled (only when popup prop has content and is active)
  const hasPopup =
    !!popup && Object.keys(popup).length > 0 && !popup.disabled && popup.active === true;

  /**
   * Handles the popup action functionality
   */
  function handlePopupAction(): void {
    const actionEvent: TextPopupActionEvent = {
      detail: true,
    };

    // Dispatch action event
    if (wrapperElementRef.current) {
      wrapperElementRef.current.dispatchEvent(new CustomEvent('popupAction', actionEvent));
    }

    popup?.onclick?.();

    setIsPopupHidden(true);
  }

  /**
   * Handle click events
   */
  function handleClick(event: React.MouseEvent): void {
    if (disabled || loading) return;

    const clickEvent: TextClickEvent = {
      detail: event.nativeEvent,
    };

    onclick?.(event.nativeEvent);

    // Dispatch custom click event
    if (wrapperElementRef.current) {
      wrapperElementRef.current.dispatchEvent(new CustomEvent('textClick', clickEvent));
    }
  }

  /**
   * Handle popup toggle
   */
  function handlePopupToggle(event: React.SyntheticEvent): void {
    event.stopPropagation();
    setIsPopupHidden(false);
  }

  /**
   * Handle click outside the popup
   */
  const handleClickOutsideRef = useRef((event: Event) => {
    if (popupElementRef.current && !popupElementRef.current.contains(event.target as Node)) {
      setIsPopupHidden(true);
    }
  });

  /**
   * Handle popup click
   */
  function handlePopupClick(event: React.MouseEvent): void {
    event.stopPropagation();
    handlePopupAction();
  }

  /**
   * Handle popup keyboard interaction
   */
  function handlePopupKeydown(event: React.KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.stopPropagation();
      handlePopupAction();
    }
  }

  // Effect for setting up Alt+Enter listener when popup is open
  const handlePopupActionRef = useRef(handlePopupAction);
  handlePopupActionRef.current = handlePopupAction;

  useEffect(() => {
    const wrapperElement = wrapperElementRef.current;
    if (!isPopupHidden && wrapperElement) {
      const handleAltEnter = (event: KeyboardEvent): void => {
        if (event.altKey && event.code === 'Enter') {
          handlePopupActionRef.current();
        }
      };

      wrapperElement.addEventListener('keydown', handleAltEnter);
      wrapperElement.focus();

      return () => {
        wrapperElement.removeEventListener('keydown', handleAltEnter);
      };
    }
  }, [isPopupHidden]);

  // Effect for handling click outside to close popup
  useEffect(() => {
    if (!isPopupHidden) {
      const handleClickOutside = handleClickOutsideRef.current;
      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isPopupHidden]);

  // Computed CSS classes
  const labelClasses = () => {
    const classes = ['labels'];
    if (disabled) classes.push('disabled');
    if (link) classes.push('link');
    if (link && linkHover) classes.push('link-hover');
    if (loading) classes.push('is-busy');
    if (hasPopup && popupConfig.active) classes.push('active');
    classes.push(className);
    return classes.join(' ');
  };

  // Determine if this should be interactive (button-like)
  const isInteractive = !!onclick || link || hasPopup || !!tooltip;

  const textClasses = () => {
    const classes = ['text'];
    if (ellipsisOnWidth && !icon && !loading) {
      classes.push('ellipsis');
    }
    return classes.join(' ');
  };

  const textStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      fontWeight: computedFontWeight(),
      fontSize: computedFontSize(),
      color: fontColor,
      wordBreak: 'normal',
    };

    if (capitalize) styles.textTransform = 'capitalize';
    if (height) styles.height = height;

    // Handle ellipsis - different behavior for text-only vs text-with-icons
    if (ellipsisOnWidth && !(icon || loading)) {
      // Text-only ellipsis: use block display with text-align for proper ellipsis
      styles.width = ellipsisOnWidth;
      styles.whiteSpace = 'nowrap';
      styles.overflow = 'hidden';
      styles.textOverflow = 'ellipsis';
      styles.display = 'block';
      styles.textAlign = textAlign;
    } else if (ellipsisOnWidth && (icon || loading)) {
      // Text-with-icons ellipsis: just apply ellipsis, width is handled by container
      styles.whiteSpace = 'nowrap';
      styles.overflow = 'hidden';
      styles.textOverflow = 'ellipsis';
      styles.flex = '1';
      styles.minWidth = 0;
    } else {
      // Normal wrapping behavior
      styles.whiteSpace = wrap;
      styles.display = 'flex';
      styles.alignItems = 'center';
      styles.gap = '4px';
      styles.textAlign = textAlign;
      // Add justify-content for alignment
      if (textAlign === 'center') styles.justifyContent = 'center';
      else if (textAlign === 'right') styles.justifyContent = 'flex-end';
      else styles.justifyContent = 'flex-start';
    }

    return styles;
  };

  const labelStyles = (): React.CSSProperties | undefined => {
    // Container styles if needed
    return undefined;
  };

  // Show tooltip logic - hide tooltip when popup is showing (popup takes priority)
  const shouldShowTooltip =
    !!tooltip &&
    Object.keys(tooltip).length > 0 &&
    (tooltip.message || tooltip.tooltip) &&
    !disabled &&
    (isPopupHidden || !hasPopup);

  // Validate tooltipTarget - if 'icon' is specified, icon must be present and not loading
  const isValidTooltipTarget =
    tooltipTarget === 'text' || (tooltipTarget === 'icon' && !!icon && !loading);

  // Determine if tooltip should show on text (default behavior or when explicitly set to 'text')
  const shouldShowTooltipOnText =
    shouldShowTooltip && isValidTooltipTarget && tooltipTarget === 'text';

  // Determine if tooltip should show on icon (when explicitly set to 'icon' and icon is present)
  const shouldShowTooltipOnIcon =
    shouldShowTooltip && isValidTooltipTarget && tooltipTarget === 'icon' && !!icon && !loading;

  if (!(label || tooltip || icon || children)) return null;

  /** The label / raw HTML / children body of the text element. */
  const renderBody = () =>
    children ? (
      children
    ) : raw ? (
      <span dangerouslySetInnerHTML={{ __html: label }} />
    ) : (
      label
    );

  /** The icon (or loader), optionally wrapped in its own tooltip. */
  const renderIconPart = (flexShrink: boolean, iconWithTooltip: boolean) => {
    if (!(icon || loading)) return null;

    const style: React.CSSProperties | undefined = flexShrink ? { flexShrink: 0 } : undefined;

    if (loading) {
      return (
        <div className="loading" style={style}>
          <Loader size={16} />
        </div>
      );
    }

    if (IconComponent) {
      if (iconWithTooltip) {
        return <Tooltip {...tooltip} target={<IconComponent style={style} />} />;
      }
      return <IconComponent style={style} />;
    }

    return null;
  };

  /**
   * The main label element. The Svelte source repeats this markup in every
   * branch; here it is factored into a single builder producing identical DOM.
   */
  const renderLabelDiv = (iconWithTooltip: boolean) => (
    <div
      className={labelClasses()}
      data-component="Text"
      {...(isInteractive ? { tabIndex: 0 } : {})}
      role={isInteractive ? 'button' : undefined}
      onClick={handleClick}
      title={title}
      style={labelStyles()}
      {...(restProps as React.HTMLAttributes<HTMLDivElement>)}
    >
      {label?.trim() || icon || children ? (
        ellipsisOnWidth && (icon || loading) ? (
          <div
            className="text-with-icon"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              width: ellipsisOnWidth,
              justifyContent:
                textAlign === 'center'
                  ? 'center'
                  : textAlign === 'right'
                    ? 'flex-end'
                    : 'flex-start',
            }}
          >
            {renderIconPart(true, iconWithTooltip)}
            <div className={textClasses()} style={textStyles()}>
              {renderBody()}
            </div>
          </div>
        ) : (
          <div className={textClasses()} style={textStyles()}>
            {renderIconPart(false, iconWithTooltip)}
            {renderBody()}
          </div>
        )
      ) : null}

      {pill}
    </div>
  );

  if (!hasPopup && shouldShowTooltipOnText) {
    return <Tooltip {...tooltip} target={renderLabelDiv(false)} />;
  }

  if (!hasPopup && shouldShowTooltipOnIcon) {
    return renderLabelDiv(true);
  }

  if (!hasPopup) {
    return renderLabelDiv(false);
  }

  return (
    <div
      className={`label-popup ${disabled ? 'disabled' : ''}`}
      onClick={handlePopupToggle}
      onKeyDown={(e) => e.key === 'Enter' && handlePopupToggle(e)}
      ref={wrapperElementRef}
      role="button"
      tabIndex={-1}
    >
      <Tooltip
        position="fixed"
        offsetVal={0}
        padding="0"
        width="200px"
        showArrow={false}
        hidden={isPopupHidden}
        listener="click"
        listenerout="click"
        stopPropagation={false}
        target={
          <span className={`dropdown-label item ${popupConfig.active ? 'active' : ''}`}>
            {shouldShowTooltipOnText ? (
              <Tooltip {...tooltip} target={renderLabelDiv(false)} />
            ) : shouldShowTooltipOnIcon ? (
              renderLabelDiv(true)
            ) : (
              renderLabelDiv(false)
            )}
          </span>
        }
        tooltip={
          <div
            className="popup-wrapper"
            style={!popupConfig.active ? { display: 'none' } : undefined}
            ref={popupElementRef}
          >
            <div
              className="popup-header"
              role="button"
              tabIndex={0}
              onClick={handlePopupClick}
              onKeyDown={handlePopupKeydown}
            >
              {PopupIconComponent ? <PopupIconComponent /> : null}
              <span className="popup-title">{popupConfig.title}</span>
              <span className="popup-subtitle">{popupConfig.subtitle}</span>
            </div>
            <div className="popup-description">
              <span>{popupConfig.description}</span>
            </div>
          </div>
        }
      />
    </div>
  );
};
