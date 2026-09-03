import type { Meta, StoryObj } from '@storybook/react-vite';

import { InfoIcon, WarningTriangleIcon } from '../../icons';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    message: { control: { type: 'text' } },
    placement: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
    },
    listener: {
      control: { type: 'select' },
      options: ['hover', 'click'],
    },
    listenerout: {
      control: { type: 'select' },
      options: ['hover', 'click'],
    },
    showArrow: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    width: { control: { type: 'text' } },
    targetText: { control: { type: 'text' } },
    bgColor: { control: { type: 'color' } },
    fontColor: { control: { type: 'color' } },
  },
  args: {
    message: 'This is a tooltip!',
    listener: 'hover',
    listenerout: 'hover',
    showArrow: true,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'This tooltip appears on hover',
  },
};

export const ClickTrigger: Story = {
  name: 'Click Trigger',
  args: {
    message: 'Click to show, click outside to hide',
    listener: 'click',
    listenerout: 'click',
  },
};

export const TopPlacement: Story = {
  name: 'Top Placement',
  args: {
    message: 'Positioned on top',
    placement: 'top',
  },
};

export const NoArrow: Story = {
  name: 'No Arrow',
  args: {
    message: 'Clean tooltip without arrow',
    showArrow: false,
  },
};

export const CustomWidth: Story = {
  name: 'Custom Width',
  args: {
    message: 'This is a wider tooltip with custom width',
    width: '250px',
  },
};

export const WithIcon: Story = {
  name: 'With Icon',
  args: {
    message: 'Information tooltip with icon',
    tooltipIcon: InfoIcon,
    tooltipIconColor: '#2196F3',
  },
};

export const ErrorState: Story = {
  name: 'Error State',
  args: {
    message: 'This field is required',
    fontColor: '#f44336',
    tooltipIcon: WarningTriangleIcon,
    tooltipIconColor: '#f44336',
  },
};

export const Disabled: Story = {
  args: {
    message: 'This tooltip is disabled',
    disabled: true,
    targetText: 'Disabled (no tooltip)',
  },
};

export const CustomBackgroundColor: Story = {
  name: 'Custom Background Color',
  args: {
    message: 'Custom colored tooltip with matching arrow',
    bgColor: '#007bff',
    fontColor: '#ffffff',
    width: '220px',
  },
};

export const DarkTheme: Story = {
  name: 'Dark Theme',
  args: {
    message: 'Dark themed tooltip',
    bgColor: '#1a1a1a',
    fontColor: '#ffffff',
    showArrow: true,
  },
};
