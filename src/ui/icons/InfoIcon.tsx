import type { IconProps } from '../types';

export const InfoIcon = (props: IconProps) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="2 1 13 13" fill="none" {...props}>
		<path
			opacity="0.4"
			fillRule="evenodd"
			clipRule="evenodd"
			d="M8.5 2C5.46243 2 3 4.46243 3 7.5C3 10.5376 5.46243 13 8.5 13C11.5376 13 14 10.5376 14 7.5C14 4.46243 11.5376 2 8.5 2ZM2 7.5C2 3.91015 4.91015 1 8.5 1C12.0899 1 15 3.91015 15 7.5C15 11.0899 12.0899 14 8.5 14C4.91015 14 2 11.0899 2 7.5Z"
			fill="currentColor"
		/>
		<path
			d="M8.5 6C9.05228 6 9.5 5.55228 9.5 5C9.5 4.44772 9.05228 4 8.5 4C7.94772 4 7.5 4.44772 7.5 5C7.5 5.55228 7.94772 6 8.5 6Z"
			fill="currentColor"
		/>
		<path d="M8.5 7H7V8H8V11H9V7.5C9 7.22386 8.77614 7 8.5 7Z" fill="currentColor" />
	</svg>
);
