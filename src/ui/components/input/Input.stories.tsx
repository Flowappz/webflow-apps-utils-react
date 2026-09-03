import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input';

const meta = {
  title: 'Ui/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile input component with support for various states, validation alerts, pill styling, and units display.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Input field value',
    },
    placeholder: {
      control: 'text',
      description: 'Input field placeholder text',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input field type',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input field',
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the input field read-only',
    },
    invalid: {
      control: 'boolean',
      description: 'Applies invalid styling to the input',
    },
    autofocus: {
      control: 'boolean',
      description: 'Focuses the input when component mounts',
    },
    units: {
      control: 'text',
      description: 'Units display text (e.g., "px", "em", "%")',
    },
    pill: {
      control: { type: 'select' },
      options: [null, 'blue', 'gray'],
      description: 'Pill background variant',
    },
    fontSize: {
      control: 'text',
      description: 'Custom font size',
    },
    width: {
      control: 'text',
      description: 'Input width',
    },
    height: {
      control: 'text',
      description: 'Input height',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum input length',
    },
    minLength: {
      control: 'number',
      description: 'Minimum input length',
    },
    showSteppers: {
      control: 'boolean',
      description: 'Shows increment/decrement buttons for number inputs (requires type="number")',
    },
    step: {
      control: 'number',
      description: 'Step value for increment/decrement (default: 1)',
    },
    min: {
      control: 'number',
      description: 'Minimum value for number input',
    },
    max: {
      control: 'number',
      description: 'Maximum value for number input',
    },
    debounce: {
      control: 'number',
      description: 'Debounce delay in milliseconds for input events (0 = no debounce)',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Sample text',
    placeholder: 'Enter text...',
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Type something here...',
  },
};

// Input types
export const EmailInput: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email...',
  },
};

export const PasswordInput: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number...',
  },
};

// Stepper functionality
export const NumberWithSteppers: Story = {
  args: {
    type: 'number',
    showSteppers: true,
    value: '10',
    placeholder: 'Enter a number...',
  },
};

export const SteppersWithCustomStep: Story = {
  args: {
    type: 'number',
    showSteppers: true,
    value: '5',
    step: 5,
    placeholder: 'Increments by 5...',
  },
};

export const SteppersWithMinMax: Story = {
  args: {
    type: 'number',
    showSteppers: true,
    value: '50',
    min: 0,
    max: 100,
    step: 10,
    placeholder: 'Range: 0-100, Step: 10',
  },
};

export const SteppersWithDecimals: Story = {
  args: {
    type: 'number',
    showSteppers: true,
    value: '1.5',
    step: 0.5,
    min: 0,
    max: 10,
    placeholder: 'Decimal steps...',
  },
};

export const SteppersAtMinValue: Story = {
  args: {
    type: 'number',
    showSteppers: true,
    value: '0',
    min: 0,
    max: 100,
    step: 1,
    placeholder: 'At minimum value',
  },
};

export const SteppersAtMaxValue: Story = {
  args: {
    type: 'number',
    showSteppers: true,
    value: '100',
    min: 0,
    max: 100,
    step: 1,
    placeholder: 'At maximum value',
  },
};

export const SteppersDisabled: Story = {
  args: {
    type: 'number',
    showSteppers: true,
    value: '25',
    disabled: true,
    step: 5,
    placeholder: 'Disabled with steppers',
  },
};

export const SteppersReadonly: Story = {
  args: {
    type: 'number',
    showSteppers: true,
    value: '75',
    readonly: true,
    step: 5,
    placeholder: 'Readonly with steppers',
  },
};

// States
export const Disabled: Story = {
  args: {
    value: 'Disabled input',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    value: 'Read-only input',
    readonly: true,
  },
};

export const Invalid: Story = {
  args: {
    value: 'Invalid input',
    invalid: true,
  },
};

export const Autofocus: Story = {
  args: {
    autofocus: true,
    placeholder: 'This input has autofocus',
  },
};

// With units
export const WithPixelUnits: Story = {
  args: {
    value: '20',
    units: 'px',
    placeholder: 'Enter pixels...',
  },
};

export const WithPercentageUnits: Story = {
  args: {
    value: '50',
    units: '%',
    placeholder: 'Enter percentage...',
  },
};

export const WithEmUnits: Story = {
  args: {
    value: '1.5',
    units: 'em',
    placeholder: 'Enter em value...',
  },
};

// Pills
export const BluePill: Story = {
  args: {
    value: 'Blue pill text',
    pill: 'blue',
  },
};

export const GrayPill: Story = {
  args: {
    value: 'Gray pill text',
    pill: 'gray',
  },
};

export const PillWithUnits: Story = {
  args: {
    value: '100',
    pill: 'blue',
    units: 'px',
  },
};

// Alert states (now using Tooltip component)
export const ErrorAlert: Story = {
  args: {
    value: 'Input with error',
    invalid: true,
    alert: {
      type: 'error',
      message: 'This field contains an error',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with error state. Hover over the input to see the error tooltip.',
      },
    },
  },
};

export const SuccessAlert: Story = {
  args: {
    value: 'Valid input',
    alert: {
      type: 'success',
      message: 'Input is valid!',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with success state. Hover to see the success tooltip.',
      },
    },
  },
};

export const InfoAlert: Story = {
  args: {
    value: 'Info message',
    alert: {
      type: 'info',
      message: 'Additional information about this field',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with info state. Hover to see the info tooltip.',
      },
    },
  },
};

export const WarningAlert: Story = {
  args: {
    value: 'Warning input',
    alert: {
      type: 'warning',
      message: 'Please review this input',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with warning state. Hover to see the warning tooltip.',
      },
    },
  },
};

export const LongErrorMessage: Story = {
  args: {
    value: 'Invalid email format',
    invalid: true,
    alert: {
      type: 'error',
      message: 'Please enter a valid email address. The format should be user@domain.com',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Input with a longer error message. The tooltip automatically adjusts to fit the content.',
      },
    },
  },
};

// Sizing
export const CustomSize: Story = {
  args: {
    placeholder: 'Custom sized input',
    width: '300px',
    height: '40px',
    fontSize: '16px',
  },
};

export const SmallInput: Story = {
  args: {
    placeholder: 'Small input',
    width: '150px',
    height: '28px',
    fontSize: '12px',
  },
};

export const LargeInput: Story = {
  args: {
    placeholder: 'Large input',
    width: '400px',
    height: '48px',
    fontSize: '18px',
  },
};

// Length constraints
export const WithMaxLength: Story = {
  args: {
    placeholder: 'Max 10 characters',
    maxLength: 10,
  },
};

export const WithMinLength: Story = {
  args: {
    placeholder: 'Min 5 characters',
    minLength: 5,
  },
};

// Interactive examples
export const InteractiveExample: Story = {
  args: {
    placeholder: 'Type to see events',
    oninput: (value: string) => console.log('Input event:', value),
    onblur: (value: string) => console.log('Blur event:', value),
    onfocus: (event) => console.log('Focus event:', event),
    onkeydown: (event) => console.log('Keydown event:', event),
  },
};

// Complex combinations
export const ComplexExample: Story = {
  args: {
    value: '42',
    pill: 'blue',
    units: 'px',
    maxLength: 4,
    type: 'number',
    width: '200px',
    alert: {
      type: 'info',
      message: 'Enter a pixel value',
    },
  },
};

export const FormFieldExample: Story = {
  args: {
    id: 'email-field',
    type: 'email',
    placeholder: 'your.email@example.com',
    width: '300px',
    alert: {
      type: 'error',
      message: 'Please enter a valid email address',
    },
    invalid: true,
  },
};

// Debounce examples
export const WithDebounce: Story = {
  args: {
    placeholder: 'Type fast to see debouncing...',
    debounce: 300,
    oninput: (value: string) => console.log('Debounced input:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Input with 300ms debounce. The oninput event will only fire after you stop typing for 300ms. Check the console to see the difference.',
      },
    },
  },
};

export const FastDebounce: Story = {
  args: {
    placeholder: 'Fast debounce (100ms)',
    debounce: 100,
    oninput: (value: string) => console.log('Fast debounced input:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Input with a faster 100ms debounce for more responsive but still controlled input handling.',
      },
    },
  },
};

export const SlowDebounce: Story = {
  args: {
    placeholder: 'Slow debounce (1000ms)',
    debounce: 1000,
    oninput: (value: string) => console.log('Slow debounced input:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Input with a slower 1000ms debounce for heavy operations that should only run after the user has finished typing.',
      },
    },
  },
};

export const NoDebounce: Story = {
  args: {
    placeholder: 'No debounce (immediate)',
    debounce: 0,
    oninput: (value: string) => console.log('Immediate input:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Input with no debouncing (debounce: 0). Events fire immediately on every keystroke.',
      },
    },
  },
};

export const DebounceWithSteppers: Story = {
  args: {
    type: 'number',
    showSteppers: true,
    value: '10',
    debounce: 500,
    placeholder: 'Debounced number input',
    oninput: (value: string) => console.log('Debounced stepper input:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Number input with steppers and debouncing. Both typing and stepper clicks are debounced.',
      },
    },
  },
};
