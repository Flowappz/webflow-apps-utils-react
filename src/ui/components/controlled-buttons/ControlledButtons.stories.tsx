import type { Meta, StoryObj } from '@storybook/react-vite';

import { ControlledButtons } from './ControlledButtons';

const meta = {
  title: 'UI/ControlledButtons',
  component: ControlledButtons,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A controlled buttons component that renders multiple buttons with various configurations including tooltips, popups, and different variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    buttons: {
      control: 'object',
      description: 'Array of button configurations to render',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the component',
    },
  },
} satisfies Meta<typeof ControlledButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic buttons
export const Primary: Story = {
  args: {
    buttons: [
      {
        id: 'save',
        text: 'Save',
        variant: 'primary',
        onClick: () => console.log('Save clicked'),
      },
      {
        id: 'cancel',
        text: 'Cancel',
        variant: 'secondary',
        onClick: () => console.log('Cancel clicked'),
      },
    ],
  },
};

// Buttons with loading states
export const WithLoading: Story = {
  args: {
    buttons: [
      {
        id: 'save',
        text: 'Saving...',
        variant: 'primary',
        loading: true,
        onClick: () => console.log('Save clicked'),
      },
      {
        id: 'cancel',
        text: 'Cancel',
        variant: 'secondary',
        disabled: true,
        onClick: () => console.log('Cancel clicked'),
      },
    ],
  },
};

// Button with tooltip
export const WithTooltip: Story = {
  args: {
    buttons: [
      {
        id: 'save',
        text: 'Save',
        variant: 'primary',
        onClick: () => console.log('Save clicked'),
        tooltip: {
          content: 'Save your changes to the project',
          placement: 'top',
          showArrow: true,
        },
      },
    ],
  },
};

// Button with popup menu
export const WithPopup: Story = {
  args: {
    buttons: [
      {
        id: 'actions',
        text: 'Actions',
        variant: 'primary',
        popupButtons: [
          {
            text: 'Edit',
            description: 'Edit the current item',
            onClick: () => console.log('Edit clicked'),
          },
          {
            text: 'Delete',
            description: 'Remove the current item',
            onClick: () => console.log('Delete clicked'),
          },
          {
            text: 'Duplicate',
            description: 'Create a copy of the item',
            onClick: () => console.log('Duplicate clicked'),
          },
        ],
      },
    ],
  },
};

// Mixed button types
export const Mixed: Story = {
  args: {
    buttons: [
      {
        id: 'save',
        text: 'Save',
        variant: 'primary',
        onClick: () => console.log('Save clicked'),
        tooltip: {
          content: 'Save your changes',
          placement: 'top',
        },
      },
      {
        id: 'actions',
        text: 'More Actions',
        variant: 'secondary',
        popupButtons: [
          {
            text: 'Export',
            description: 'Export data to file',
            onClick: () => console.log('Export clicked'),
          },
          {
            text: 'Import',
            description: 'Import data from file',
            onClick: () => console.log('Import clicked'),
          },
        ],
      },
      {
        id: 'cancel',
        text: 'Cancel',
        variant: 'secondary',
        onClick: () => console.log('Cancel clicked'),
      },
    ],
  },
};
