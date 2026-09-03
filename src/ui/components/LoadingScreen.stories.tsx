import type { Meta, StoryObj } from '@storybook/react-vite';

import LoadingScreen from './LoadingScreen';

const meta = {
  title: 'Ui/LoadingScreen',
  component: LoadingScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full-screen loading overlay component with customizable messaging, error states, and support for both fixed and absolute positioning.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'The message to display below the loader or error icon',
    },
    position: {
      control: { type: 'select' },
      options: ['fixed', 'absolute'],
      description: 'CSS position property for the loading screen',
    },
    active: {
      control: 'boolean',
      description: 'Controls visibility of the loading screen',
    },
    error: {
      control: 'boolean',
      description: 'If true, displays error state with warning icon',
    },
    raw: {
      control: 'boolean',
      description: 'If true, renders HTML in the message (use with caution)',
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color of the overlay',
    },
    spinnerSize: {
      control: { type: 'range', min: 24, max: 120, step: 4 },
      description: 'Size of the spinner in pixels',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class for the main loader container',
    },
  },
} satisfies Meta<typeof LoadingScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    active: true,
    message: 'Loading...',
  },
};

export const WithCustomMessage: Story = {
  args: {
    active: true,
    message: 'Please wait while we fetch your data',
  },
};

export const LongMessage: Story = {
  args: {
    active: true,
    message: 'This might take a few moments. Please do not close this window or navigate away.',
  },
};

export const NoMessage: Story = {
  args: {
    active: true,
    message: '',
  },
};

// Spinner sizes
export const SmallSpinner: Story = {
  args: {
    active: true,
    message: 'Loading...',
    spinnerSize: 30,
  },
};

export const LargeSpinner: Story = {
  args: {
    active: true,
    message: 'Loading...',
    spinnerSize: 80,
  },
};

// Position variants
export const FixedPosition: Story = {
  args: {
    active: true,
    message: 'Fixed position loading screen',
    position: 'fixed',
  },
  parameters: {
    docs: {
      description: {
        story: 'Fixed positioning covers the entire viewport regardless of scroll position',
      },
    },
  },
};

export const AbsolutePosition: Story = {
  args: {
    active: true,
    message: 'Absolute position loading screen',
    position: 'absolute',
  },
  parameters: {
    docs: {
      description: {
        story: 'Absolute positioning is relative to the nearest positioned ancestor',
      },
    },
  },
};

// Error states
export const ErrorState: Story = {
  args: {
    active: true,
    error: true,
    message: 'Something went wrong while loading your data.',
  },
};

export const ErrorWithDetails: Story = {
  args: {
    active: true,
    error: true,
    message: 'Failed to connect to the server. Please check your internet connection and try again.',
  },
};

export const ErrorMinimal: Story = {
  args: {
    active: true,
    error: true,
    message: 'An error occurred.',
  },
};

// Background colors
export const LightBackground: Story = {
  args: {
    active: true,
    message: 'Loading with light background',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
};

export const DarkBackground: Story = {
  args: {
    active: true,
    message: 'Loading with dark background',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
};

export const SemiTransparent: Story = {
  args: {
    active: true,
    message: 'Semi-transparent overlay',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
  },
};

export const ColoredBackground: Story = {
  args: {
    active: true,
    message: 'Custom colored background',
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
  },
};

// HTML message with raw prop
export const RawHTMLMessage: Story = {
  args: {
    active: true,
    raw: true,
    message: 'Loading <strong>important</strong> data<br/>Please wait...',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Using raw=true to render HTML in the message. Use with caution and only with trusted content.',
      },
    },
  },
};

// Inactive (hidden)
export const Inactive: Story = {
  args: {
    active: false,
    message: 'This should not be visible',
  },
  parameters: {
    docs: {
      description: {
        story: 'When active is false, the loading screen is hidden',
      },
    },
  },
};

// Use cases
export const InitialPageLoad: Story = {
  args: {
    active: true,
    message: 'Initializing application...',
    spinnerSize: 60,
  },
};

export const DataFetch: Story = {
  args: {
    active: true,
    message: 'Fetching data from server...',
    spinnerSize: 50,
  },
};

export const FileUpload: Story = {
  args: {
    active: true,
    message: 'Uploading files... This may take a moment.',
    spinnerSize: 50,
  },
};

export const Processing: Story = {
  args: {
    active: true,
    message: 'Processing your request...',
    spinnerSize: 50,
  },
};

export const NetworkError: Story = {
  args: {
    active: true,
    error: true,
    message: 'Unable to connect to the server. Please check your network connection.',
  },
};

export const ServerError: Story = {
  args: {
    active: true,
    error: true,
    message: 'The server encountered an error. Our team has been notified.',
  },
};
