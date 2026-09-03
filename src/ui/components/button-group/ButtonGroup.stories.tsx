import type { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonGroup } from './ButtonGroup';

const meta = {
  title: 'Ui/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A button group component that allows users to select one option from multiple choices. Provides keyboard navigation and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    buttons: {
      control: 'object',
      description: 'Array of button options with name and value properties',
    },
    selected: {
      control: 'text',
      description: 'Currently selected value',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire button group is disabled',
    },
    id: {
      control: 'text',
      description: 'Unique identifier for the button group',
    },
    onselect: {
      action: 'onselect',
      description: 'Event handler called when a button is selected',
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    buttons: [
      { name: 'Option 1', value: 'option1' },
      { name: 'Option 2', value: 'option2' },
    ],
    selected: 'option1',
  },
};

export const WithoutSelection: Story = {
  args: {
    buttons: [
      { name: 'Left', value: 'left' },
      { name: 'Center', value: 'center' },
      { name: 'Right', value: 'right' },
    ],
  },
};

export const Disabled: Story = {
  args: {
    buttons: [
      { name: 'Edit', value: 'edit' },
      { name: 'Preview', value: 'preview' },
      { name: 'Publish', value: 'publish' },
    ],
    selected: 'edit',
    disabled: true,
  },
};

export const LongLabels: Story = {
  args: {
    buttons: [
      { name: 'Short', value: 'short' },
      { name: 'Medium Length', value: 'medium' },
      { name: 'Very Long Button Label', value: 'long' },
    ],
    selected: 'medium',
  },
};

export const ManyOptions: Story = {
  args: {
    buttons: [
      { name: 'XS', value: 'xs' },
      { name: 'SM', value: 'sm' },
      { name: 'MD', value: 'md' },
      { name: 'LG', value: 'lg' },
      { name: 'XL', value: 'xl' },
      { name: 'XXL', value: 'xxl' },
    ],
    selected: 'md',
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    buttons: [
      { name: 'Grid', value: 'grid' },
      { name: 'List', value: 'list' },
      { name: 'Card', value: 'card' },
    ],
    selected: 'grid',
    onselect: (value: string) => {
      console.log('Selected:', value);
    },
  },
};
