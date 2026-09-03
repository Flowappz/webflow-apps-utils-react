import type { Placement } from '@floating-ui/dom';

import type { IconComponent } from '../../types';

/**
 * Controlled button item properties
 */
export interface ControlledButtonItem {
  id?: string;
  text: string;
  escapeValidation?: boolean;
  variant?: 'primary' | 'secondary' | 'cms';
  disabled?: boolean;
  loading?: boolean;
  type?: 'library' | 'component' | 'popup';
  onClick?: () => void;
  show?: boolean;
  popupButtons?: ControlledButtonItem[];
  popupTrigger?: 'click' | 'hover';
  icon?: IconComponent;
  description?: string;
  tooltip?: {
    content: string;
    className?: string;
    width?: string;
    placement?: Placement;
    showArrow?: boolean;
    icon?: IconComponent;
  };
}

/**
 * Controlled buttons props
 */
export interface ControlledButtonsProps {
  buttons: ControlledButtonItem[];
  className?: string;
}
