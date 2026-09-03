import type * as React from 'react';

import type { IconComponent } from '../../types';

/**
 * Modal component props interface
 */
export interface ModalProps {
  /** Whether the modal is open/visible */
  open?: boolean;
  /** Whether to show the header bar */
  showHeader?: boolean;
  /** Whether to show the footer bar */
  showFooter?: boolean;
  /** Whether to show the close button in header */
  showCloseButton?: boolean;
  /** Whether the modal can be closed by clicking overlay */
  closeOnOverlayClick?: boolean;
  /** Whether the modal can be closed by pressing Escape key */
  closeOnEscape?: boolean;
  /** Whether the modal is in loading state */
  loading?: boolean;
  /** Loading message to display */
  loadingMessage?: string;
  /** Global padding for modal content (fallback for individual sections) */
  padding?: string;
  /** Specific padding for header section */
  headerPadding?: string;
  /** Specific padding for content section */
  contentPadding?: string;
  /** Specific padding for footer section */
  footerPadding?: string;
  /** Custom width for modal */
  width?: string;
  /** Custom height for modal */
  height?: string;
  /** CSS position property for the modal overlay */
  position?: 'fixed' | 'absolute';
  /** Additional CSS classes */
  className?: string;
  /** Custom styles for the modal container */
  style?: React.CSSProperties;
  /** Z-index for the modal */
  zIndex?: number;
  /** Background color for overlay */
  overlayColor?: string;
  /** Default header title text */
  title?: string;
  /** Default action button text */
  actionText?: string;
  /** Default cancel button text */
  cancelText?: string;
  /** Header content */
  header?: React.ReactNode;
  /** Main content */
  children?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Custom close button icon */
  closeIcon?: IconComponent;
  /** Event handler for when modal requests to close */
  onOpenChange?: (open: boolean) => void;
  /** Event handler for overlay click */
  onOverlayClick?: () => void;
  /** Event handler for escape key press */
  onEscapeKeyDown?: () => void;
  /** Event handler for default action button click */
  onAction?: () => void;
  /** Event handler for default cancel button click */
  onCancel?: () => void;
}

/**
 * Modal context for compound components
 */
export interface ModalContext {
  open: boolean;
  close: () => void;
}
