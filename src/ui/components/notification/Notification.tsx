import './Notification.css';

import * as React from 'react';

import { TimesIcon, WarningCircleOutlineIcon } from '../../icons';
import { Text } from '../text';
import type { NotificationProps } from './types';

export const Notification = ({
  className = '',
  message = '',
  href = '',
  title = '',
  titleFontWeight = 600,
  linkText = '',
  showCloseButton = true,
  icon = WarningCircleOutlineIcon,
  linkIcon = null,
  variant = 'warning',
  richTextMessage = false,
  richTextTitle = false,
  showBorder = true,
  actions,
  onClose,
  ...restProps
}: NotificationProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'title'>) => {
  // Computed colors based on variant
  const colors = (() => {
    switch (variant) {
      case 'warning':
        return {
          icon: 'var(--yellowIcon)',
          border: 'var(--yellowBorder)',
        };
      case 'error':
        return {
          icon: 'var(--redIcon)',
          border: 'var(--redBorder)',
        };
      case 'success':
        return {
          icon: 'var(--greenIcon)',
          border: 'var(--greenBorder)',
        };
      case 'info':
        return {
          icon: 'var(--blueIcon)',
          border: 'var(--blueBorder)',
        };
      default:
        // Custom color string
        return {
          icon: variant,
          border: variant,
        };
    }
  })();

  // Computed wrapper classes
  const centered = !message && !href && !linkText && !actions;
  const wrapperClasses = `fs-notification wrapper ${centered ? 'centered ' : ''}${className}`.trim();

  // Computed border style
  const borderStyle: React.CSSProperties = showBorder
    ? { borderLeft: `2px solid ${colors.border}` }
    : {};

  // Computed default icon component
  const DefaultIcon = icon;

  const LinkIcon = linkIcon;

  /**
   * Handle close button click
   */
  function handleCloseClick() {
    onClose?.();
  }

  /**
   * Handle close button keydown
   */
  function handleCloseKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCloseClick();
    }
  }

  return (
    <div className={wrapperClasses} style={borderStyle} data-testid="notification" {...restProps}>
      <span className="icon" style={{ color: colors.icon }}>
        <DefaultIcon />
      </span>

      <div className="notification-content">
        {title && (
          <Text
            label={title}
            fontSize="normal"
            fontWeight={titleFontWeight.toString()}
            raw={richTextTitle}
          />
        )}

        {(message || href || linkText) && (
          <div className="message">
            {message && <Text label={message} fontColor="var(--text2)" raw={richTextMessage} />}

            {href && linkText && (
              <a href={href} className="link" target="_blank" rel="noopener noreferrer">
                <span>{linkText}</span>
                {LinkIcon && <LinkIcon />}
              </a>
            )}
          </div>
        )}

        {actions}
      </div>

      {showCloseButton && (
        <button
          className="close-button"
          onClick={handleCloseClick}
          onKeyDown={handleCloseKeyDown}
          aria-label="Close notification"
          type="button"
        >
          <TimesIcon />
        </button>
      )}
    </div>
  );
};

export default Notification;
