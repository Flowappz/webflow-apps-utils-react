import type * as React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Height of the divider
   */
  height?: string;
  /**
   * Width of the divider
   */
  width?: string;
  /**
   * Background color of the divider
   */
  background?: string;
  /**
   * Orientation of the divider - when true, rotates the divider 90 degrees
   */
  rotate?: boolean;
  /**
   * Additional CSS classes to apply
   */
  className?: string;
}
