import './Modal.css';

import * as React from 'react';
import { useEffect, useRef } from 'react';

import { TimesIcon } from '../../icons';
import { Button } from '../button';
import { LoadingScreen } from '../LoadingScreen';
import { Text } from '../text';
import type { ModalProps } from './types';

export const Modal = ({
  open = false,
  showHeader = true,
  showFooter = true,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  loading = false,
  loadingMessage = 'Loading content...',
  padding = '8px 12px',
  headerPadding,
  contentPadding,
  footerPadding,
  width = '28em',
  height = 'auto',
  position = 'fixed',
  className = '',
  style: customStyle,
  zIndex = 99999999997,
  overlayColor = 'rgba(0, 0, 0, 0.4)',
  title = 'Modal',
  actionText = 'Action',
  cancelText = 'Cancel',
  header,
  children,
  footer,
  closeIcon = TimesIcon,
  onOpenChange,
  onOverlayClick,
  onEscapeKeyDown,
  onAction,
  onCancel,
  ...restProps
}: ModalProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>) => {
  // Component state
  const modalElement = useRef<HTMLDivElement | null>(null);
  const overlayElement = useRef<HTMLDivElement | null>(null);
  const closeButtonElement = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Icon component binding
  const CloseIconComponent = closeIcon;

  // Computed CSS classes
  const overlayClasses = (() => {
    const classes = ['modal-overlay'];
    if (!closeOnOverlayClick) classes.push('prevent-overlay-close');
    if (className) classes.push(className);
    return classes.join(' ');
  })();

  // Computed CSS styles for modal container
  const modalStyles: React.CSSProperties = { width, height, ...customStyle };

  // Computed padding styles for each section
  const headerStyles: React.CSSProperties = { padding: headerPadding || padding };
  const contentStyles: React.CSSProperties = { padding: contentPadding || padding };
  const footerStyles: React.CSSProperties = { padding: footerPadding || padding };

  // Computed overlay styles
  const overlayStyles: React.CSSProperties = {
    position,
    background: overlayColor,
    zIndex,
  };

  /**
   * Promotes the modal overlay to the browser top-layer via the Popover API.
   * This escapes ancestor clipping from overflow/z-index/transform (WebKit Bug 160953).
   * Falls back gracefully when the API is unavailable.
   */
  useEffect(() => {
    const node = overlayElement.current;
    if (!open || !node) return;

    if (typeof node.showPopover === 'function') {
      node.showPopover();
    } else {
      // jsdom fallback: override its [popover] { display: none } UA style
      node.style.display = 'flex';
    }

    return () => {
      if (typeof node.hidePopover === 'function') {
        try {
          node.hidePopover();
        } catch {
          // ignore - popover may already be closed/disconnected
        }
      }
    };
  }, [open]);

  // Focus management - Store the previously focused element when modal opens,
  // restore it when the modal closes
  useEffect(() => {
    if (open) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      return () => {
        previouslyFocusedElement.current?.focus();
      };
    }
  }, [open]);

  // Body scroll lock effect
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Focus the close button when modal opens
  useEffect(() => {
    if (open && closeButtonElement.current) {
      closeButtonElement.current.focus();
    }
  }, [open]);

  /**
   * Close the modal
   */
  function closeModal() {
    onOpenChange?.(false);
  }

  /**
   * Handle overlay click
   */
  function handleOverlayClick() {
    onOverlayClick?.();

    if (closeOnOverlayClick) {
      closeModal();
    }
  }

  /**
   * Handle escape key press
   */
  function handleEscapeKey() {
    onEscapeKeyDown?.();

    if (closeOnEscape) {
      closeModal();
    }
  }

  /**
   * Handle keydown events for modal
   */
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleEscapeKey();
    }
  }

  /**
   * Focus trap implementation
   */
  function trapFocus(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!modalElement.current || event.key !== 'Tab') return;

    const focusableElements = modalElement.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }

  if (!open) return null;

  return (
    <div
      popover="manual"
      className={overlayClasses}
      ref={overlayElement}
      style={overlayStyles}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby={showHeader ? 'modal-header' : undefined}
      {...restProps}
    >
      <div
        className="modal-content"
        ref={modalElement}
        style={modalStyles}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={trapFocus}
        role="banner"
      >
        {loading && (
          <LoadingScreen message={loadingMessage} active={true} spinnerSize={20} position="absolute" />
        )}

        {showHeader && (
          <div className="header-bar" id="modal-header" style={headerStyles}>
            {header ?? <Text label={title} fontWeight="600" />}

            {showCloseButton && (
              <button
                className="modal-close-button"
                ref={closeButtonElement}
                onClick={closeModal}
                aria-label="Close modal"
                type="button"
              >
                <CloseIconComponent />
              </button>
            )}
          </div>
        )}

        <div className="modal-body" style={contentStyles}>
          {children}
        </div>

        {showFooter && (
          <div className="modal-footer" style={footerStyles}>
            {footer ?? (
              <div className="footer-buttons">
                <Button variant="secondary" onclick={onCancel}>
                  {cancelText}
                </Button>
                <Button variant="primary" onclick={onAction}>
                  {actionText}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
