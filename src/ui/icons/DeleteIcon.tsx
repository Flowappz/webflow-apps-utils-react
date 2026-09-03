import type { IconProps } from '../types';

export const DeleteIcon = (props: IconProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="100%"
		height="100%"
		viewBox="2.25 1.5 8.25 8.25"
		fill="none"
	 {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M5.25 1.5C4.83579 1.5 4.5 1.83579 4.5 2.25V3H2.25V3.75H3V8.625C3 9.24632 3.50368 9.75 4.125 9.75H8.625C9.24632 9.75 9.75 9.24632 9.75 8.625V3.75H10.5V3H8.25V2.25C8.25 1.83579 7.91421 1.5 7.5 1.5H5.25ZM7.5 3V2.25H5.25V3H7.5ZM3.75 8.625V3.75H9V8.625C9 8.83211 8.83211 9 8.625 9H4.125C3.91789 9 3.75 8.83211 3.75 8.625Z"
			fill="currentColor"
		/>
	</svg>
);
