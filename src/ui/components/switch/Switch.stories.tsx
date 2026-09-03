import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Switch } from './Switch';
import type { SwitchChangeEvent } from './types';

const meta = {
  title: 'Ui/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modern toggle switch component for binary choices. Features two-way binding, keyboard navigation, and comprehensive accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is in the on/checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    id: {
      control: 'text',
      description: 'Unique identifier for the switch',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for screen readers',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    required: {
      control: 'boolean',
      description: 'Whether the switch is required in forms',
    },
    name: {
      control: 'text',
      description: 'Name attribute for form submission',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic states
export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

// With labels and accessibility
export const WithAriaLabel: Story = {
  args: {
    checked: false,
    ariaLabel: 'Enable notifications',
  },
  parameters: {
    docs: {
      description: {
        story: 'Switch with an accessible label for screen readers.',
      },
    },
  },
};

export const Required: Story = {
  args: {
    checked: false,
    required: true,
    ariaLabel: 'Accept terms and conditions (required)',
  },
  parameters: {
    docs: {
      description: {
        story: 'Switch that is required in form contexts.',
      },
    },
  },
};

// Interactive examples
export const InteractiveExample: Story = {
  render: (args) => (
    <Switch
      {...args}
      onchange={(event: SwitchChangeEvent) => {
        console.log('Switch toggled:', event);
        alert(`Switch is now ${event.checked ? 'ON' : 'OFF'}`);
      }}
    />
  ),
  args: {
    checked: false,
    ariaLabel: 'Click to see change event',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive switch that demonstrates the modern onchange event handler.',
      },
    },
  },
};

// Form integration
export const InForm: Story = {
  render: (args) => <Switch {...args} name="user-preferences" id="notifications-toggle" />,
  args: {
    checked: false,
    ariaLabel: 'Enable email notifications',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Switch configured for use in forms with proper name and id attributes.',
      },
    },
  },
};

// Two-way binding example
export const TwoWayBinding: Story = {
  render: () => {
    const TwoWayBindingExample = () => {
      const [isEnabled, setIsEnabled] = useState(false);

      return (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}
        >
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            ariaLabel="Toggle feature"
          />
          <p>
            Feature is currently: <strong>{isEnabled ? 'ENABLED' : 'DISABLED'}</strong>
          </p>
          <button onClick={() => setIsEnabled((v) => !v)}>
            {isEnabled ? 'Disable' : 'Enable'} via button
          </button>
        </div>
      );
    };

    return <TwoWayBindingExample />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates two-way binding (React equivalent of the Svelte bind:checked directive).',
      },
    },
  },
};

// Accessibility testing
export const AccessibilityTest: Story = {
  args: {
    checked: false,
    ariaLabel: 'Accessibility test switch',
    id: 'a11y-test-switch',
  },
  parameters: {
    docs: {
      description: {
        story: 'Switch configured for accessibility testing with proper ARIA attributes.',
      },
    },
  },
};

// Keyboard navigation demo
export const KeyboardNavigationDemo: Story = {
  args: {
    checked: false,
    ariaLabel: 'Use Tab to focus, Space or Enter to toggle',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates keyboard navigation. Use Tab to focus, then Space or Enter to toggle.',
      },
    },
  },
};
