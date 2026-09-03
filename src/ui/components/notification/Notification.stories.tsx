import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import {
  ArrowIcon,
  CheckCircleIcon,
  CloseCircleIcon,
  InfoIcon,
  WarningTriangleIcon,
} from '../../icons';
import { Notification } from './Notification';

const meta = {
  title: 'UI/Notification',
  component: Notification,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['warning', 'error', 'success', 'info'],
      description: 'The type of notification or custom color string',
    },
    message: {
      control: 'text',
      description: 'The main message content to display',
    },
    title: {
      control: 'text',
      description: 'The title/heading of the notification',
    },
    href: {
      control: 'text',
      description: 'External link URL',
    },
    linkText: {
      control: 'text',
      description: 'Text for the link button',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button',
    },
    showBorder: {
      control: 'boolean',
      description: 'Whether to show the colored left border',
    },
    richTextMessage: {
      control: 'boolean',
      description: 'Whether to render message as rich text/HTML',
    },
    richTextTitle: {
      control: 'boolean',
      description: 'Whether to render title as rich text/HTML',
    },
    titleFontWeight: {
      control: { type: 'number', min: 100, max: 900, step: 100 },
      description: 'Font weight for the title text',
    },
    onClose: { action: 'close' },
  },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning Notification',
    message: 'This is a warning message that requires your attention.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error Notification',
    message: 'An error occurred while processing your request. Please try again.',
    icon: CloseCircleIcon,
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success Notification',
    message: 'Your action was completed successfully!',
    icon: CheckCircleIcon,
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information Notification',
    message: 'Here is some important information you should know.',
    icon: InfoIcon,
  },
};

export const MessageOnly: Story = {
  name: 'Message Only',
  args: {
    variant: 'warning',
    message: 'This notification only has a message without a title.',
  },
};

export const TitleOnly: Story = {
  name: 'Title Only',
  args: {
    variant: 'error',
    title: 'This notification only has a title',
  },
};

export const WithLink: Story = {
  name: 'With Link',
  args: {
    variant: 'warning',
    title: 'Update Available',
    message: 'A new version of the application is available.',
    href: 'https://example.com/download',
    linkText: 'Download Now',
    linkIcon: ArrowIcon,
  },
};

export const Interactive: Story = {
  args: {
    variant: 'warning',
    title: 'Interactive Notification',
    message: 'Click the close button to dismiss this notification.',
  },
};

export const CustomColor: Story = {
  name: 'Custom Color',
  args: {
    variant: '#9333EA',
    title: 'Custom Color',
    message: 'This notification uses a custom purple color.',
    icon: WarningTriangleIcon,
  },
};

export const WithoutCloseButton: Story = {
  name: 'Without Close Button',
  args: {
    variant: 'warning',
    title: 'Persistent Notification',
    message: 'This notification cannot be dismissed by the user.',
    showCloseButton: false,
  },
};

export const WithoutBorder: Story = {
  name: 'Without Border',
  args: {
    variant: 'success',
    title: 'No Border',
    message: 'This notification does not have a colored left border.',
    showBorder: false,
  },
};

export const RichTextContent: Story = {
  name: 'Rich Text Content',
  args: {
    variant: 'warning',
    title: '<strong>Rich Text Title</strong>',
    message: 'This message supports <em>HTML</em> and <strong>rich text</strong> formatting.',
    richTextTitle: true,
    richTextMessage: true,
  },
};

export const LongContent: Story = {
  name: 'Long Content',
  args: {
    variant: 'error',
    title: 'Very Long Notification Title That Might Wrap to Multiple Lines',
    message:
      'This is a very long message that demonstrates how the notification component handles extensive content. It should wrap gracefully and maintain proper spacing and alignment throughout the entire notification area.',
    href: 'https://example.com/help',
    linkText: 'Learn More',
  },
};

export const AccessibilityTest: Story = {
  name: 'Accessibility Test',
  args: {
    variant: 'error',
    title: 'Accessibility Test',
    message: 'This notification tests accessibility features.',
    href: 'https://example.com',
    linkText: 'Accessible Link',
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'link-name', enabled: true },
          { id: 'button-name', enabled: true },
        ],
      },
    },
  },
};

export const CustomActionsSupport: Story = {
  name: 'Custom Actions Support',
  args: {
    variant: 'warning',
    title: 'Custom Actions Available',
    message:
      'This component supports custom action buttons via the actions snippet prop. See component tests and documentation for implementation examples.',
  },
};
