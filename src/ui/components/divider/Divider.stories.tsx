import type { Meta, StoryObj } from '@storybook/react-vite';

import { Divider } from './Divider';

const meta = {
  title: 'Ui/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A simple divider component for creating visual separation between content sections. Supports customizable dimensions, colors, and orientation.',
      },
    },
  },
  argTypes: {
    height: {
      control: 'text',
      description: 'Height of the divider',
      table: {
        defaultValue: { summary: '1px' },
      },
    },
    width: {
      control: 'text',
      description: 'Width of the divider',
      table: {
        defaultValue: { summary: '100%' },
      },
    },
    background: {
      control: 'color',
      description: 'Background color of the divider',
      table: {
        defaultValue: { summary: 'var(--border1)' },
      },
    },
    rotate: {
      control: 'boolean',
      description: 'Rotates the divider 90 degrees for vertical orientation',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Thick: Story = {
  args: {
    height: '4px',
  },
};

export const CustomColor: Story = {
  name: 'Custom Color',
  args: {
    background: '#007bff',
    height: '2px',
  },
};

export const ShortDivider: Story = {
  name: 'Short Divider',
  args: {
    width: '50%',
    height: '2px',
  },
};

export const Vertical: Story = {
  args: {
    rotate: true,
    height: '100px',
    width: '2px',
  },
};

export const Success: Story = {
  args: {
    background: 'var(--greenIcon)',
    height: '3px',
  },
};

export const Warning: Story = {
  args: {
    background: 'var(--yellowBorder)',
    height: '3px',
  },
};

export const Error: Story = {
  args: {
    background: 'var(--redBorder)',
    height: '3px',
  },
};

export const InContent: Story = {
  name: 'In Content',
  render: () => (
    <div style={{ padding: '20px', background: 'var(--background1)', borderRadius: '8px' }}>
      <p style={{ margin: '0 0 16px 0', color: 'var(--text1)' }}>Content above divider</p>
      <Divider height="1px" background="var(--border1)" />
      <p style={{ margin: '16px 0 0 0', color: 'var(--text1)' }}>Content below divider</p>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    height: '2px',
    width: '100%',
    background: '#007bff',
    rotate: false,
  },
};
