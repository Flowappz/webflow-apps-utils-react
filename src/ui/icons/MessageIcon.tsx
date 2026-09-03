import type { IconProps } from '../types';

export const MessageIcon = (props: IconProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="100%"
		height="100%"
		viewBox="-2 -2 18 18"
		fill="none"
	 {...props}>
		<path d="M3.9375 6.125H10.0625V5.25H3.9375V6.125Z" fill="currentColor" />
		<path d="M3.9375 8.75H7V7.875H3.9375V8.75Z" fill="currentColor" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7.4375 0C3.81313 0 0.875 2.93813 0.875 6.5625V11.8125C0.875 12.5374 1.46263 13.125 2.1875 13.125H7.4375C11.0619 13.125 14 10.1869 14 6.5625C14 2.93813 11.0619 0 7.4375 0ZM1.75 6.5625C1.75 3.42138 4.29638 0.875 7.4375 0.875C10.5786 0.875 13.125 3.42138 13.125 6.5625C13.125 9.70362 10.5786 12.25 7.4375 12.25H2.1875C1.94588 12.25 1.75 12.0541 1.75 11.8125V6.5625Z"
			fill="currentColor"
		/>
	</svg>
);
