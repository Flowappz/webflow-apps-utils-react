import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import ColorSelect, { type ColorObject } from './ColorSelect';

const meta = {
  title: 'UI/ColorSelect',
  component: ColorSelect,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'color' },
      description: 'Initial color value (hex)',
    },
    oncolorchange: { action: 'fullColorChanged' },
  },
  args: {
    color: '#ff0000',
    oncolorchange: fn(),
  },
} satisfies Meta<typeof ColorSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const WithInitialColor: Story = {
  name: 'With Initial Color',
  args: { color: '#00ff00' },
};

export const AlphaChannel: Story = {
  name: 'Alpha Channel',
  args: {
    color: '#0000ff',
    oncolorchange: fn((fullColor: ColorObject) => console.log('Full color object:', fullColor)),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows alpha slider and allows changing opacity. Both callbacks receive consistent hex values with alpha channel when alpha < 100%.',
      },
    },
  },
};

export const HsbRgbToggle: Story = {
  name: 'HSB/RGB Toggle',
  args: { color: '#ff00ff' },
  parameters: {
    docs: { description: { story: 'Toggle between HSB and RGB modes using the mode switch.' } },
  },
};

export const WithEyeDropper: Story = {
  name: 'With EyeDropper',
  args: { color: '#123456' },
  parameters: {
    docs: {
      description: {
        story: 'Use the EyeDropper button to pick a color from the screen (if supported).',
      },
    },
  },
};

export const FullColorObjectDemo: Story = {
  name: 'Full Color Object Demo',
  args: { color: '#ff6600' },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the full color object callback with hex, rgb, rgba, hsb, and alpha values. Check the Actions panel to see the complete color object structure.',
      },
    },
  },
};
