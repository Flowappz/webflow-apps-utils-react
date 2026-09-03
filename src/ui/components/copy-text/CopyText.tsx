import './CopyText.css';

import copy from 'copy-text-to-clipboard';
import * as React from 'react';
import { useRef, useState } from 'react';

import { trimExtraSpaces } from '../../../utils/helpers';
import { CopyIcon, EyeIcon } from '../../icons';
import type { CopyTextProps } from './types';

export const CopyText = ({
  content,
  title,
  disabled = false,
  raw = false,
  hidden = false,
  comment = '',
  tooltip = 'Click to copy',
  onNotify,
  onCopy,
  onError,
  header,
  footer,
  className = '',
  ...restProps
}: CopyTextProps) => {
  // Component state
  const [isCopied, setIsCopied] = useState(false);
  const isCooldownRef = useRef(false);
  const copyButtonElement = useRef<HTMLDivElement | null>(null);

  function getProcessedContent() {
    if (raw) {
      return comment ? `<!-- ${comment} -->\n${content}` : content;
    }
    return trimExtraSpaces(content) ?? '';
  }

  function getCopyButtonClasses() {
    return [
      'copy-button',
      disabled ? 'copy-button--disabled' : '',
      isCopied ? 'copy-button--copied' : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  /**
   * Handles notifications with cooldown to prevent spam
   */
  const handleNotification = (type: 'Success' | 'Error', message: string) => {
    if (!isCooldownRef.current) {
      onNotify?.({ type, message });
      isCooldownRef.current = true;
      setTimeout(() => {
        isCooldownRef.current = false;
      }, 1000);
    }
  };

  /**
   * Handles copying text to clipboard
   */
  const handleCopy = () => {
    if (disabled) {
      const errorMessage = 'Copy is disabled';
      handleNotification('Error', errorMessage);
      onError?.(errorMessage);
      return;
    }

    const contentToCopy = getProcessedContent();
    const success = copy(contentToCopy);

    if (success) {
      setIsCopied(true);
      handleNotification('Success', 'Copied to clipboard!');
      onCopy?.(contentToCopy);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } else {
      const errorMessage = 'Failed to copy. Please try again.';
      handleNotification('Error', errorMessage);
      onError?.(errorMessage);
    }
  };

  /**
   * Handle keyboard events for accessibility
   */
  const handleKeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCopy();
    }
  };

  if (hidden) return null;

  return (
    <div className="copy-text" {...restProps}>
      {header ? (
        <div className="copy-text__header">{header}</div>
      ) : title ? (
        <div className="copy-text__header">
          <h3 className="copy-text__title">{title}</h3>
        </div>
      ) : null}

      <div
        ref={copyButtonElement}
        className={getCopyButtonClasses()}
        role="button"
        tabIndex={0}
        aria-label={disabled ? 'Copy disabled' : tooltip}
        title={tooltip}
        onClick={handleCopy}
        onKeyDown={handleKeydown}
      >
        <div className="copy-button__content" id="copy-content">
          {getProcessedContent()}
        </div>

        <div className="copy-button__icon" aria-hidden="true">
          {disabled ? <EyeIcon /> : <CopyIcon />}
        </div>
      </div>

      {footer && <div className="copy-text__footer">{footer}</div>}
    </div>
  );
};

export default CopyText;
