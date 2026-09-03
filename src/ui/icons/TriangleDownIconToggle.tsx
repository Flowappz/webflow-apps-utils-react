import './TriangleDownIconToggle.css';

import type { IconProps } from '../types';

export interface TriangleDownIconToggleProps extends Omit<IconProps, 'rotate'> {
	rotate?: boolean;
}

export const TriangleDownIconToggle = ({
	rotate = false,
	className,
	...props
}: TriangleDownIconToggleProps) => (
	<svg
		className={['fs-triangle-down-icon-toggle', rotate ? 'rotate' : '', className]
			.filter(Boolean)
			.join(' ')}
		width="100%"
		height="100%"
		viewBox="0 0 7 5"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path d="M3.5 4.5L0.468911 0.75L6.53109 0.75L3.5 4.5Z" fill="currentColor" />
	</svg>
);
