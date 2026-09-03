import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import ColorPicker from './ColorPicker';
import type { ColorObject } from './ColorSelect';

const controlledColor = '#00ff00';
const handleFullColorChange = (fullColor: ColorObject) => {
  console.log('Full color object:', fullColor);
};

const meta = {
  title: 'UI/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'color' },
      description: 'Selected color (hex string or writable store)',
    },
    oncolorchange: { action: 'fullColorChanged' },
  },
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  args: {
    color: '#ff0000',
    oncolorchange: fn(),
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { oncolorchange: fn(handleFullColorChange) } };

export const WithInitialColor: Story = {
  name: 'With Initial Color',
  args: { color: '#00ff00', oncolorchange: fn(handleFullColorChange) },
};

export const EdgeInvalidColor: Story = {
  name: 'Edge: Invalid Color',
  args: { color: '#xyzxyz', oncolorchange: fn(handleFullColorChange) },
};

export const EdgeNoColor: Story = {
  name: 'Edge: No Color',
  args: { color: undefined, oncolorchange: fn(handleFullColorChange) },
};

export const DisabledPicker: Story = {
  name: 'Disabled Picker',
  args: { color: '#ebebeb', disabled: true, oncolorchange: fn(handleFullColorChange) },
};

export const FullColorObjectDemo: Story = {
  name: 'Full Color Object Demo',
  args: { color: '#ff6600', oncolorchange: fn(handleFullColorChange) },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the full color object callback. Open the color picker and interact with it to see the complete color object with hex, rgb, rgba, hsb, and alpha values in the Actions panel.',
      },
    },
  },
};

export const AlphaChannelDemo: Story = {
  name: 'Alpha Channel Demo',
  args: {
    color: '#ff0000',
    oncolorchange: fn(handleFullColorChange),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows how alpha channel values are handled, oncolorchange now receive the same hex value with alpha channel when alpha < 100%. Check the console to see both callbacks receiving consistent values.',
      },
    },
  },
};

export const ControlledComponent: Story = {
  name: 'Controlled Component',
  args: { color: controlledColor, oncolorchange: fn(handleFullColorChange) },
  parameters: {
    docs: {
      description: {
        story:
          'A controlled component example that demonstrates oncolorchange callback working together.',
      },
    },
  },
};
