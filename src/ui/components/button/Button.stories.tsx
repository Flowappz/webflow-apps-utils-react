import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import {
  ArrowIcon,
  CheckIcon,
  DeleteIcon,
  InfoIcon,
  PlayIcon,
  PlusIcon,
  RefreshIcon,
  SaveIcon,
  SearchIcon,
} from '../../icons';
import { Button } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'cms'],
    },

    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
    invalid: {
      control: { type: 'boolean' },
    },
    text: {
      control: { type: 'text' },
    },
    tooltip: {
      control: { type: 'object' },
    },
    onclick: { action: 'clicked' },
  },
  args: {
    onclick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    text: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    text: 'Secondary Button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    text: 'Delete Item',
  },
};

export const CMS: Story = {
  args: {
    variant: 'cms',
    text: 'CMS Action',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    text: 'Save Changes',
    loadingText: 'Saving...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    text: 'Disabled Button',
  },
};

export const FullWidth: Story = {
  name: 'Full Width',
  args: {
    fullWidth: true,
    text: 'Full Width Button',
  },
};

export const WithIconLeft: Story = {
  name: 'With Icon Left',
  args: {
    text: 'Save Changes',
    icon: SaveIcon,
  },
};

export const WithIconRight: Story = {
  name: 'With Icon Right',
  args: {
    text: 'Next Step',
    rightIcon: ArrowIcon,
  },
};

export const IconOnly: Story = {
  name: 'Icon Only',
  args: {
    icon: PlusIcon,
    ariaLabel: 'Add item',
  },
};

export const PlayButton: Story = {
  name: 'Play Button',
  args: {
    variant: 'primary',
    text: 'Play Video',
    icon: PlayIcon,
  },
};

export const SearchButton: Story = {
  name: 'Search Button',
  args: {
    variant: 'secondary',
    text: 'Search',
    icon: SearchIcon,
  },
};

export const DeleteButton: Story = {
  name: 'Delete Button',
  args: {
    variant: 'danger',
    text: 'Delete',
    icon: DeleteIcon,
  },
};

export const SuccessButton: Story = {
  name: 'Success Button',
  args: {
    variant: 'primary',
    text: 'Completed',
    disabled: true,
    icon: CheckIcon,
  },
};

export const RefreshButton: Story = {
  name: 'Refresh Button',
  args: {
    variant: 'secondary',
    ariaLabel: 'Refresh data',
    icon: RefreshIcon,
  },
};

export const LoadingWithIcon: Story = {
  name: 'Loading with Icon',
  args: {
    variant: 'primary',
    text: 'Processing',
    loading: true,
    loadingText: 'Processing...',
    icon: SaveIcon,
  },
};

export const InvalidState: Story = {
  name: 'Invalid State',
  args: {
    variant: 'primary',
    text: 'Submit Form',
    invalid: true,
    tooltip: {
      message: 'Please fix the validation errors before submitting',
      placement: 'top',
      listener: 'hover',
      listenerout: 'hover',
    },
  },
};

export const BasicTooltip: Story = {
  name: 'Basic Tooltip',
  args: {
    variant: 'primary',
    text: 'Hover me',
    tooltip: {
      message: 'I am a basic tooltip',
      placement: 'top',
    },
  },
};

export const ClickTooltip: Story = {
  name: 'Click Tooltip',
  args: {
    variant: 'secondary',
    text: 'Click me',
    tooltip: {
      message: 'This tooltip appears on click!',
      placement: 'bottom',
      listener: 'click',
      listenerout: 'click',
    },
  },
};

export const TooltipWithIcon: Story = {
  name: 'Tooltip with Icon',
  args: {
    variant: 'primary',
    text: 'Info Button',
    icon: InfoIcon,
    tooltip: {
      message: 'This is an informational tooltip with custom styling',
      placement: 'right',
      showArrow: true,
      width: '200px',
      fontColor: '#ffffff',
    },
  },
};

export const CustomTooltipStyle: Story = {
  name: 'Custom Tooltip Style',
  args: {
    variant: 'danger',
    text: 'Warning',
    tooltip: {
      message: 'This is a warning message with custom width and padding',
      placement: 'left',
      width: '250px',
      padding: '12px',
      fontColor: '#ffcc00',
    },
  },
};
