import type { Meta, StoryObj } from '@storybook/react-vite';

import { SelectInModalStory } from './SelectInModalStory';

const meta = {
  title: 'Ui/Select/InModal',
  component: SelectInModalStory,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Testing Modal with Select component to ensure proper event handling',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectInModalStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
