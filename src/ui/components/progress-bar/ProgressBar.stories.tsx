import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ProgressBar } from './ProgressBar';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    max: {
      control: { type: 'number' },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error'],
    },
    easing: {
      control: { type: 'select' },
      options: ['linear', 'cubicIn', 'cubicOut', 'cubicInOut', 'quartOut'],
    },
    animated: {
      control: { type: 'boolean' },
    },
    duration: {
      control: { type: 'range', min: 100, max: 2000, step: 100 },
    },
    showPercentage: {
      control: { type: 'boolean' },
    },
    showStatus: {
      control: { type: 'boolean' },
    },
    showSpinner: {
      control: { type: 'boolean' },
    },
    completed: {
      control: { type: 'boolean' },
    },
    height: {
      control: { type: 'range', min: 2, max: 20, step: 1 },
    },
    statusText: {
      control: { type: 'text' },
    },
    onComplete: { action: 'completed' },
  },
  args: {
    onComplete: fn(),
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 45,
    showPercentage: true,
  },
};

export const WithStatus: Story = {
  name: 'With Status',
  args: {
    value: 60,
    showStatus: true,
    showPercentage: true,
    statusText: 'Processing files...',
  },
};

export const WithSpinner: Story = {
  name: 'With Spinner',
  args: {
    value: 35,
    showStatus: true,
    showPercentage: true,
    showSpinner: true,
    statusText: 'Uploading data...',
  },
};

export const CompletedState: Story = {
  name: 'Completed State',
  args: {
    value: 100,
    completed: true,
    showStatus: true,
    showPercentage: true,
    statusText: 'Processing completed',
  },
};

export const SuccessVariant: Story = {
  name: 'Success Variant',
  args: {
    value: 80,
    variant: 'success',
    showStatus: true,
    showPercentage: true,
    statusText: 'Successfully processing...',
  },
};

export const WarningVariant: Story = {
  name: 'Warning Variant',
  args: {
    value: 65,
    variant: 'warning',
    showStatus: true,
    showPercentage: true,
    statusText: 'Warning: Slow connection detected',
  },
};

export const ErrorVariant: Story = {
  name: 'Error Variant',
  args: {
    value: 25,
    variant: 'error',
    showStatus: true,
    showPercentage: true,
    statusText: 'Error: Connection failed',
  },
};

export const NoAnimation: Story = {
  name: 'No Animation',
  args: {
    value: 70,
    animated: false,
    showPercentage: true,
    showStatus: true,
    statusText: 'Instant progress',
  },
};

export const SlowAnimation: Story = {
  name: 'Slow Animation',
  args: {
    value: 85,
    duration: 2000,
    easing: 'quartOut',
    showPercentage: true,
    showStatus: true,
    statusText: 'Slow, smooth progress...',
  },
};

export const CustomHeight: Story = {
  name: 'Custom Height',
  args: {
    value: 55,
    height: 8,
    showPercentage: true,
    showStatus: true,
    statusText: 'Thick progress bar',
  },
};

export const Minimal: Story = {
  args: {
    value: 40,
    showPercentage: false,
    showStatus: false,
  },
};

export const ScanProgressSimulation: Story = {
  name: 'Scan Progress Simulation',
  args: {
    value: 73,
    showStatus: true,
    showPercentage: true,
    showSpinner: true,
    statusText: 'Scanning: 73/100 pages',
    height: 4,
  },
};
