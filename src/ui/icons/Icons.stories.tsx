import type { Meta, StoryObj } from '@storybook/react-vite';

import { IconsShowcase } from './IconsShowcase';

const meta = {
	title: 'Ui/Icons',
	component: IconsShowcase,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A comprehensive showcase of all available icons. Use the controls to adjust size and color. Icons use `width="100%"` and `height="100%"` with proper viewBox, so they scale to fill their container.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: { type: 'range', min: 8, max: 128, step: 1 },
			description: 'Icon size in pixels',
		},
		color: {
			control: 'color',
			description: 'Icon color (uses currentColor by default)',
		},
	},
} satisfies Meta<typeof IconsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		size: 24,
		color: '#ffffff',
	},
};

export const Small: Story = {
	args: {
		size: 16,
		color: '#ffffff',
	},
};

export const Large: Story = {
	args: {
		size: 48,
		color: '#ffffff',
	},
};

export const Colored: Story = {
	args: {
		size: 24,
		color: '#6366f1',
	},
};

export const ExtraLarge: Story = {
	args: {
		size: 64,
		color: '#22c55e',
	},
};
