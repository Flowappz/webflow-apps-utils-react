import type { IconProps } from '../types';

export const CopyIcon = (props: IconProps) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="3 2 11 11" fill="none" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6 3C6 2.44772 6.44772 2 7 2H13C13.5523 2 14 2.44772 14 3V9C14 9.55228 13.5523 10 13 10H7C6.44772 10 6 9.55228 6 9V3ZM7 3H13V9H7V3Z"
			fill="currentColor"
		/>
		<path d="M3 5V12C3 12.5523 3.44772 13 4 13H11V12H4V5H3Z" fill="currentColor" />
	</svg>
);
