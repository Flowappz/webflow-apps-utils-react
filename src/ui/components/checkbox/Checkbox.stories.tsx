import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from './Checkbox';

const meta = {
  title: 'Ui/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile checkbox component following MUI patterns with support for controlled/uncontrolled usage, checkbox and radio variants, and disabled states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'If true, the component is checked. Use for controlled components.',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'The default checked state. Use when the component is not controlled.',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the component is disabled.',
    },
    variant: {
      control: { type: 'select' },
      options: ['checkbox', 'radio'],
      description: 'The checkbox type variant',
    },
    radioIndicator: {
      control: { type: 'select' },
      options: ['check', 'dot'],
      description: "The radio indicator style. Only applies when variant is 'radio'.",
    },
    onChange: {
      action: 'onChange',
      description: 'Callback fired when the state is changed.',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {},
};

export const DefaultChecked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Controlled: Story = {
  args: {
    checked: true,
  },
};

// Variants
export const CheckboxVariant: Story = {
  args: {
    variant: 'checkbox',
    defaultChecked: true,
  },
};

export const RadioVariant: Story = {
  args: {
    variant: 'radio',
    defaultChecked: true,
  },
};

export const RadioVariantDot: Story = {
  args: {
    variant: 'radio',
    checked: true,
    radioIndicator: 'dot',
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const DisabledRadio: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    variant: 'radio',
  },
};

// Uncontrolled usage (default behavior)
export const Uncontrolled: Story = {
  args: {
    defaultChecked: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uncontrolled component manages its own state. Use defaultChecked to set initial state and onChange to listen for changes.',
      },
    },
  },
};

// Interactive examples
export const Interactive: Story = {
  args: {
    onChange: (checked: boolean) => {
      console.log('Checkbox checked:', checked);
    },
  },
};

export const InteractiveRadio: Story = {
  args: {
    variant: 'radio',
    onChange: (checked: boolean) => {
      console.log('Radio checked:', checked);
    },
  },
};

// Accessibility testing
export const AccessibilityTest: Story = {
  args: {
    defaultChecked: false,
    'aria-label': 'Accept terms and conditions',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates proper ARIA attributes for screen readers. The checkbox can be operated with keyboard (Space or Enter keys).',
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'button-name', enabled: true },
          { id: 'aria-allowed-attr', enabled: true },
        ],
      },
    },
  },
};

// Multiple checkboxes showcase
export const MultipleCheckboxes: Story = {
  render: () => <Checkbox />,
  parameters: {
    docs: {
      description: {
        story: 'Example showing multiple checkboxes in different states.',
      },
    },
  },
};

// Focus demonstration
export const FocusStates: Story = {
  args: {
    defaultChecked: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Click on the checkbox and use Tab to see focus indicators. The component supports keyboard navigation with Space and Enter keys.',
      },
    },
  },
};
