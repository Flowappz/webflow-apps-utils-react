import type { Meta, StoryObj } from '@storybook/react-vite';

import { Loader } from './Loader';

const meta = {
  title: 'Ui/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable loading spinner component with proportional sizing, configurable colors, and adjustable animation speed.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'range', min: 16, max: 200, step: 4 },
      description: 'The size of the loader in pixels',
    },
    color: {
      control: 'color',
      description: 'The color of the spinning arc',
    },
    speed: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.1 },
      description: 'Animation speed in seconds (lower is faster)',
    },
    margin: {
      control: 'text',
      description: 'CSS margin value for the loader wrapper',
    },
    trackColor: {
      control: 'color',
      description: 'The color of the background track circle',
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = { args: {} };
export const Small: Story = { args: { size: 24 } };
export const Medium: Story = { args: { size: 48 } };
export const Large: Story = { args: { size: 96 } };
export const ExtraLarge: Story = { args: { size: 150 } };

// Color variants
export const Primary: Story = { args: { color: '#3b82f6', size: 64 } };
export const Success: Story = { args: { color: '#22c55e', size: 64 } };
export const Warning: Story = { args: { color: '#f59e0b', size: 64 } };
export const Error: Story = { args: { color: '#ef4444', size: 64 } };
export const CustomColors: Story = { args: { color: '#8b5cf6', trackColor: '#c084fc', size: 64 } };

// Speed variants
export const Slow: Story = {
  args: { speed: 2, size: 64 },
  parameters: {
    docs: { description: { story: 'Slower animation speed (2 seconds per rotation)' } },
  },
};
export const Fast: Story = {
  args: { speed: 0.5, size: 64 },
  parameters: {
    docs: { description: { story: 'Faster animation speed (0.5 seconds per rotation)' } },
  },
};

// With margin
export const WithMargin: Story = { args: { margin: '20px', size: 64 } };

// Dark background showcase
export const OnDarkBackground: Story = {
  args: { color: 'white', trackColor: 'rgba(255, 255, 255, 0.2)', size: 64 },
  parameters: { backgrounds: { default: 'dark' } },
};

// Light background showcase
export const OnLightBackground: Story = {
  args: { color: '#1e293b', trackColor: 'rgba(30, 41, 59, 0.2)', size: 64 },
  parameters: { backgrounds: { default: 'light' } },
};

// Multiple sizes comparison
export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {[24, 48, 96, 150].map((size) => (
        <Loader key={size} size={size} />
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Visual comparison of different loader sizes' } },
  },
};
