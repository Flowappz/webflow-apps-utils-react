import './Divider.css';

import type * as React from 'react';

import type { DividerProps } from './types';

export const Divider = ({
  height = '1px',
  width = '100%',
  background = 'var(--border1)',
  rotate = false,
  className = '',
  style,
  ...restProps
}: DividerProps) => {
  // Computed classes
  const dividerClasses = `divider ${className}`.trim();

  // Computed styles
  const dividerStyles: React.CSSProperties = {
    height,
    width,
    background,
    ...(rotate ? { transform: 'rotate(180deg)' } : {}),
    ...style,
  };

  return (
    <div className={dividerClasses} style={dividerStyles} data-testid="divider" {...restProps} />
  );
};

export default Divider;
