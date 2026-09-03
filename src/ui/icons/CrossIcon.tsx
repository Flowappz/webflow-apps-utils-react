import type { IconProps } from '../types';

export const CrossIcon = (props: IconProps) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none" {...props}>
		<path d="M4 4L12 12" stroke="currentColor" />
		<path d="M12 4L4 12" stroke="currentColor" />
	</svg>
);
