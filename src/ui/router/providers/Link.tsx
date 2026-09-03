/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';

import { useStore } from '../../stores/store';
import { RouterContext } from '../hooks';
import './Link.css';

interface Props {
  /** The path to navigate to */
  to: string;
  /** Whether to replace current history entry (default: false) */
  replace?: boolean;
  /** CSS class to apply when link is active */
  activeClass?: string;
  /** Whether to match exactly for active state (default: false) */
  exact?: boolean;
  /** Whether the link is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Additional state to pass with navigation */
  state?: any;
  /** HTML element to render (default: 'a') */
  element?: 'a' | 'button';
  /** Children */
  children?: React.ReactNode;
  /** Custom click handler (called before navigation) */
  onclick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  /** Additional attributes to pass to the element */
  [key: string]: any;
}

export function Link({
  to,
  replace = false,
  activeClass = '',
  exact = false,
  disabled = false,
  className = '',
  state,
  element = 'a',
  children,
  onclick,
  ...restProps
}: Props) {
  // Get router from context
  const router = useContext(RouterContext);

  if (!router) {
    throw new Error('Link component must be used within a Router component');
  }

  // Reactive state - explicitly depends on router location
  useStore(router.locationStore);
  const isActive = router.isActive(to, exact);

  // Handle click event
  function handleClick(event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    // Call custom onclick handler if provided
    if (onclick) {
      onclick(event);
    }

    // Don't navigate if event was prevented or link is disabled
    if (event.defaultPrevented || disabled) {
      return;
    }

    // Don't navigate if it's a modified click (ctrl, cmd, etc.)
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    // Don't navigate if middle click or right click
    if (event.button !== 0) {
      return;
    }

    // Prevent default navigation
    event.preventDefault();

    // Navigate using router
    if (!router) return;
    router.navigate(to, { replace, state });
  }

  // Generate proper href including app version path
  const href = (() => {
    if (!router || !to) return '#';
    const appVersionPath = router.getAppVersionPath();
    if (appVersionPath) {
      return to === '/' ? appVersionPath : appVersionPath + to;
    }
    return to;
  })();

  const classes = ['router-link', className, isActive ? 'active' : '']
    .filter(Boolean)
    .join(' ');

  if (element === 'a') {
    return (
      <a
        href={href}
        className={classes}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      aria-current={isActive ? 'page' : undefined}
      disabled={disabled}
      onClick={handleClick}
      {...restProps}
    >
      {children}
    </button>
  );
}
