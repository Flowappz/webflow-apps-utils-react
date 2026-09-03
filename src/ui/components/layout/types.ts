import type * as React from 'react';

import type { IconComponent } from '../../types';

export interface LayoutTab {
  path: string;
  name: string;
  icon: IconComponent;
  isActive: boolean;
  hidden?: boolean;
}

export interface LayoutNotification {
  path: string;
  success: boolean;
  message: string;
  showNotification: boolean;
}

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab: string;
  switchTab: (tab: string) => void;
  tabs: LayoutTab[];
  main?: React.ReactNode;
  sidebar?: React.ReactNode;
  previewBar?: React.ReactNode;
  footer?: React.ReactNode;
  formKey: string;
  editMode?: boolean;
  showFooter?: boolean;
  showSidebar?: boolean;
  showTabs?: boolean;
  showPreviewBar?: boolean;
  sidebarWidth?: string;
  componentName?: string;
  instanceName?: string;
  containerMode?: boolean;
  footerSize?: 'normal' | 'large';
  notifications?: LayoutNotification[];
}

export interface LayoutRoute {
  path: string;
  name: string;
  icon: IconComponent;
  hidden?: boolean;
}

export interface LayoutEvents {
  tabSwitch: {
    detail: string;
  };
  sidebarToggle: {
    detail: boolean;
  };
}
