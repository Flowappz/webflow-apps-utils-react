import type { Meta, StoryObj } from '@storybook/react-vite';

import { Example } from './Example';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'UI/Modal',
  component: Example,
  tags: ['autodocs'],
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Examples: Story = {
  render: () => <Example />,
};
