import type * as React from 'react';

/**
 * A renderable icon/component prop — React equivalent of Svelte's `Component` type
 * used across the source package for `icon`, `rightIcon`, `tooltipIcon`, etc.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconComponent = React.ComponentType<any>;

/** Props shared by all generated SVG icon components. */
export type IconProps = React.SVGProps<SVGSVGElement>;
