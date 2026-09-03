import { useEffect, useState } from 'react';

import { Text } from '../text';
import { Switch } from '../switch';
import type { SwitchChangeEvent } from '../switch/types';
import { breakpointOptions } from './breakpointOptions';

import './BreakpointItem.css';

export interface BreakpointItemChangeEvent {
  breakpoint: keyof typeof breakpointOptions;
  enabled: boolean;
}

export interface BreakpointItemProps {
  breakpoint: keyof typeof breakpointOptions;
  enabled?: boolean;
  disabled?: boolean;
  /** Fired when the switch toggles (Svelte `on:change` equivalent). */
  onchange?: (event: BreakpointItemChangeEvent) => void;
  children?: React.ReactNode;
}

export const BreakpointItem = ({
  breakpoint,
  enabled: enabledProp = false,
  disabled = false,
  onchange,
  children,
}: BreakpointItemProps) => {
  const [enabled, setEnabled] = useState(enabledProp);

  useEffect(() => {
    setEnabled(enabledProp);
  }, [enabledProp]);

  const { label, description, icon } = breakpointOptions[breakpoint];

  const handleSwitchChange = (event: SwitchChangeEvent) => {
    setEnabled(event.checked);
    onchange?.({ breakpoint, enabled: event.checked });
  };

  return (
    <div className="breakpoint-item">
      <div className="breakpoint-row">
        <div className="device-info">
          <Text label={label} tooltip={{ message: description }} icon={icon} className="bp-icon-wrapper" />
        </div>

        <Switch disabled={disabled} checked={enabled} onchange={handleSwitchChange} />
      </div>

      <div className="breakpoint-content" style={{ display: enabled ? 'flex' : 'none' }}>
        {children}
      </div>
    </div>
  );
};

export default BreakpointItem;
