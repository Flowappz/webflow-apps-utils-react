import type * as React from 'react';

import { CheckCircleOutlinedIcon, WarningCircleOutlineIcon } from '../../icons';

import { Section } from '../section';
import { Tooltip } from '../tooltip';
import { EditModeMessage } from './common';
import type { LayoutTab } from './types';

import './Layout.css';

export interface LayoutComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The currently active tab path */
  activeTab: string;
  /** Array of available tabs to display in the navbar */
  tabs: LayoutTab[];
  /** Function to handle tab switching */
  switchTab: (tab: string) => void;
  /** Unique key for the form context */
  formKey: string;
  /** Whether to show the edit mode message banner */
  showEditModeMessage?: boolean;
  /** Whether to display the footer section */
  showFooter?: boolean;
  /** Whether to display the sidebar */
  showSidebar?: boolean;
  /** Whether to display the tab navigation bar */
  showTabs?: boolean;
  /** The height at which the main content area becomes scrollable */
  mainContentScrollableAt?: number;
  /** Whether to display the preview bar */
  showPreviewBar?: boolean;
  /** Width of the sidebar (CSS value) */
  sidebarWidth?: string;
  /** Whether to use container mode (100% dimensions) instead of viewport mode */
  containerMode?: boolean;
  /** Size variant for the footer */
  footerSize?: 'normal' | 'large';
  /** Padding for the main content container (CSS value) */
  mainContentPadding?: string;
  /** Array of notification objects for tab status indicators */
  notifications?: Array<{
    /** Tab path this notification applies to */
    path: string;
    /** Whether the notification indicates success */
    success: boolean;
    /** Notification message content */
    message: string;
    /** Whether to show the notification badge */
    showNotification: boolean;
  }>;
  /** Sidebar content */
  sidebar?: React.ReactNode;
  /** Main content area */
  main?: React.ReactNode;
  /** Preview bar content */
  previewBar?: React.ReactNode;
  /** Custom tabs content to override default tab rendering */
  customTabs?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
}

export const Layout = ({
  activeTab,
  tabs,
  switchTab,
  formKey,
  mainContentScrollableAt,
  showEditModeMessage = false,
  showFooter = true,
  showSidebar = true,
  showTabs = true,
  customTabs,
  showPreviewBar = true,
  sidebarWidth = '274px',
  containerMode = false,
  footerSize = 'normal',
  mainContentPadding = 'var(--Spacing-24, 24px)',
  notifications = [],
  sidebar,
  main,
  previewBar,
  footer,
  className = '',
  ...restProps
}: LayoutComponentProps) => {
  void formKey;

  // Derived states
  const containerStyles: React.CSSProperties = containerMode
    ? { height: '100%', width: '100%' }
    : { height: '100vh', width: '100vw' };
  const footerHeight = footerSize === 'large' ? '50px' : '40px';

  // Grid template areas based on visibility
  const gridTemplateAreas = (() => {
    const areas = [];

    // Handle navbar row - navbar can exist independently and spans correctly
    if (showTabs) {
      if (showSidebar && showPreviewBar) {
        areas.push('"navbar preview-bar"');
      } else if (showSidebar) {
        areas.push('"navbar navbar"');
      } else {
        areas.push('"navbar"');
      }
    } else if (showPreviewBar && showSidebar) {
      // If tabs are hidden but preview bar is shown with sidebar
      areas.push('"preview-bar preview-bar"');
    }

    // Handle main content row
    if (showSidebar) {
      areas.push('"sidebar main"');
    } else {
      areas.push('"main"');
    }

    // Handle footer row
    if (showFooter && footer) {
      if (showSidebar) {
        areas.push('"sidebar footer"');
      } else {
        areas.push('"footer"');
      }
    }

    return areas.join(' ');
  })();

  // Grid template columns
  const gridTemplateColumns = showSidebar ? `${sidebarWidth} 1fr` : '1fr';

  // Grid template rows
  const gridTemplateRows = (() => {
    const rows = [];

    // Add row for navbar/preview-bar if either is shown
    if (showTabs || (showPreviewBar && showSidebar)) {
      rows.push('40px');
    }

    rows.push('1fr'); // main content area takes remaining space

    if (showFooter && footer) {
      rows.push(footerHeight);
    }

    return rows.join(' ');
  })();

  // Get notification for a specific tab
  function getNotification(tabPath: string) {
    return notifications.find((n) => n.path === tabPath);
  }

  return (
    <div
      className={`layout-grid ${className}`}
      style={
        {
          ...containerStyles,
          '--grid-template-areas': gridTemplateAreas,
          '--grid-template-columns': gridTemplateColumns,
          '--grid-template-rows': gridTemplateRows,
        } as React.CSSProperties
      }
      {...restProps}
    >
      {showTabs && (
        <>
          <div className="navbar" data-area="navbar">
            {customTabs
              ? customTabs
              : tabs.map((tab) => {
                  const Icon = tab.icon;
                  const notification = getNotification(tab.path);
                  return (
                    <button
                      className={[
                        'tab',
                        activeTab === tab.path ? 'isActive' : '',
                        notification && !notification?.success ? 'warning' : '',
                        notification && notification?.success ? 'success' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => switchTab(tab.path)}
                      key={tab.path}
                    >
                      <Icon />
                      <span
                        className="tab-text"
                        style={{
                          color:
                            activeTab !== tab.path ? 'var(--text2)' : 'var(--actionPrimaryText)',
                        }}
                      >
                        {tab.name}
                      </span>

                      {notification?.showNotification &&
                        (notification?.success ? (
                          <span className="notification-pill success">
                            <CheckCircleOutlinedIcon />
                          </span>
                        ) : (
                          <Tooltip
                            message={notification?.message}
                            placement="right"
                            offsetVal={8}
                            position="fixed"
                            width="max-content"
                            target={
                              <div className="notification-pill warning-tooltip">
                                <WarningCircleOutlineIcon />
                              </div>
                            }
                          />
                        ))}
                    </button>
                  );
                })}
          </div>

          {showPreviewBar && showSidebar && (
            <div className="preview-bar" data-area="preview-bar">
              {previewBar ? (
                previewBar
              ) : (
                <div className="preview-bar-content">
                  <span>Preview: {activeTab} tab content</span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showSidebar && (
        <div className="sidebar" data-area="sidebar">
          {sidebar ? (
            sidebar
          ) : (
            <div className="sidebar-content">
              <div className="sidebar-placeholder">
                <h3>Sidebar Content</h3>
                <p>Tab: {activeTab}</p>
                <p>This is placeholder content for the sidebar area.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="main-content" data-area="main">
        {main ? (
          <div className="main-content-container" style={{ padding: mainContentPadding }}>
            {showEditModeMessage && <EditModeMessage />}
            {mainContentScrollableAt ? (
              <Section height={`${mainContentScrollableAt}px`} scrollable padding="0">
                {main}
              </Section>
            ) : (
              main
            )}
          </div>
        ) : (
          <div className="main-placeholder">
            <h2>Main Content Area</h2>
            <p>
              Active Tab: <strong>{activeTab}</strong>
            </p>
            <p>This is placeholder content for the main content area.</p>
            <div className="placeholder-details">
              <h3>Layout State:</h3>
              <ul>
                <li>Show Sidebar: {String(showSidebar)}</li>
                <li>Show Tabs: {String(showTabs)}</li>
                <li>Show Preview Bar: {String(showPreviewBar)}</li>
                <li>Show Footer: {String(showFooter)}</li>
                <li>Edit Mode: {String(showEditModeMessage)}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {showFooter && footer && (
        <div className="footer" data-area="footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Layout;
