import type { Meta, StoryObj } from '@storybook/react-vite';

import { Wrapper } from './examples';

const meta = {
  title: 'UI/Layout',
  component: Wrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible layout component with sidebar, main content area, tabs, and footer. This demo includes a built-in configurator to test different layout options.',
      },
    },
  },
} satisfies Meta<typeof Wrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Wrapper />,
};
