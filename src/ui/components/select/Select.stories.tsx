import type { Meta, StoryObj } from '@storybook/react-vite';

import { CheckIcon, UndoIcon } from '../../icons';
import { Select } from './Select';
import { SelectItemsDisabledStory } from './SelectItemsDisabledStory';
import { SelectWithFooterStory } from './SelectWithFooterStory';
import type { SelectOption } from './types';

// Mock options for stories
const basicOptions: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' },
  { label: 'Option 5', value: 'option5' },
];

const optionsWithDescriptions: SelectOption[] = [
  {
    label: 'Basic Plan',
    value: 'basic',
    description: 'Perfect for individuals and small teams',
    descriptionTitle: 'Free',
  },
  {
    label: 'Pro Plan',
    value: 'pro',
    description: 'Advanced features for growing businesses',
    descriptionTitle: '$29/month',
  },
  {
    label: 'Enterprise Plan',
    value: 'enterprise',
    description: 'Full-scale solution for large organizations',
    descriptionTitle: 'Custom pricing',
  },
];

const optionsWithIcons: SelectOption[] = [
  {
    label: 'Approved',
    value: 'approved',
    labelIcon: CheckIcon,
    description: 'Item has been approved',
  },
  {
    label: 'Reset',
    value: 'reset',
    labelIcon: UndoIcon,
    description: 'Reset to default state',
  },
];

const mixedOptions: SelectOption[] = [
  { label: 'Simple Option', value: 'simple' },
  { label: 'Disabled Option', value: 'disabled', isDisabled: true },
  {
    label: 'Complex Option',
    value: 'complex',
    description: 'This option has both description and custom styling',
    descriptionTitle: 'Pro Feature',
    className: 'custom-option-class',
  },
];

const meta = {
  title: 'Ui/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible dropdown select component with search, keyboard navigation, and rich option formatting.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of selectable options with labels and values',
    },
    selected: {
      control: 'text',
      description: 'Currently selected value (bindable)',
    },
    defaultText: {
      control: 'text',
      description: 'Text to display when no option is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    enableSearch: {
      control: 'boolean',
      description: 'Enable search/filter functionality',
    },
    preventNoSelection: {
      control: 'boolean',
      description: 'Prevent deselection of the current value',
    },
    width: {
      control: 'text',
      description: 'Width of the select button',
    },
    dropdownWidth: {
      control: 'text',
      description: 'Width of the dropdown menu',
    },
    dropdownHeight: {
      control: 'text',
      description: 'Maximum height of the dropdown menu',
    },
    placement: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Placement of the dropdown relative to the trigger',
    },
    hide: {
      control: 'boolean',
      description: 'Whether to hide the component',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    alert: {
      control: 'object',
      description: 'Alert configuration for validation messages',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the select is in an invalid state',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether the dropdown closes when pressing the Escape key',
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'Whether the dropdown closes when clicking outside the component',
    },
    onOpen: {
      action: 'onOpen',
      description: 'Callback fired when the dropdown opens',
    },
    itemsDisabled: {
      control: 'boolean',
      description: 'Disables all dropdown items and search while the dropdown remains open',
    },
    itemsDisabledMessage: {
      control: 'text',
      description: 'Overlay message shown when itemsDisabled is true',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    options: basicOptions,
    defaultText: 'Select an option',
  },
};

export const WithSelection: Story = {
  args: {
    options: basicOptions,
    selected: 'option2',
    defaultText: 'Select an option',
  },
};

export const Disabled: Story = {
  args: {
    options: basicOptions,
    disabled: true,
    defaultText: 'Disabled select',
  },
};

// Search functionality
export const WithSearch: Story = {
  args: {
    options: basicOptions,
    enableSearch: true,
    defaultText: 'Searchable select',
  },
  parameters: {
    docs: {
      description: {
        story: 'Enable search functionality to filter options by typing.',
      },
    },
  },
};

// Rich content options
export const WithDescriptions: Story = {
  args: {
    options: optionsWithDescriptions,
    defaultText: 'Choose a plan',
    dropdownWidth: '300px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Options can include descriptions and titles for rich content display.',
      },
    },
  },
};

export const WithIcons: Story = {
  args: {
    options: optionsWithIcons,
    defaultText: 'Select status',
    dropdownWidth: '250px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Options can include icons alongside labels and descriptions.',
      },
    },
  },
};

// Different sizes and layouts
export const CustomDimensions: Story = {
  args: {
    options: basicOptions,
    width: '300px',
    dropdownWidth: '350px',
    dropdownHeight: '150px',
    defaultText: 'Custom sized select',
  },
  parameters: {
    docs: {
      description: {
        story: 'Customize the width and height of both the select button and dropdown.',
      },
    },
  },
};

export const CompactSelect: Story = {
  args: {
    options: basicOptions,
    width: '120px',
    dropdownWidth: '120px',
    defaultText: 'Compact',
  },
};

export const WideSelect: Story = {
  args: {
    options: basicOptions,
    width: '400px',
    dropdownWidth: '400px',
    defaultText: 'Wide selection field',
  },
};

// Behavioral variants
export const PreventDeselection: Story = {
  args: {
    options: basicOptions,
    selected: 'option1',
    preventNoSelection: true,
    defaultText: 'Cannot deselect',
  },
  parameters: {
    docs: {
      description: {
        story: 'Prevent users from deselecting the current option by clicking it again.',
      },
    },
  },
};

export const DisableEscapeClose: Story = {
  args: {
    options: basicOptions,
    defaultText: 'Press Escape (disabled)',
    closeOnEscape: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Prevents the dropdown from closing when the Escape key is pressed. Users must select an option or click the button again to close.',
      },
    },
  },
};

export const DisableClickOutsideClose: Story = {
  args: {
    options: basicOptions,
    defaultText: 'Click outside (disabled)',
    closeOnClickOutside: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Prevents the dropdown from closing when clicking outside the component. Users must select an option or click the button again to close.',
      },
    },
  },
};

export const DisableAllCloseBehaviors: Story = {
  args: {
    options: basicOptions,
    defaultText: 'Must select to close',
    closeOnEscape: false,
    closeOnClickOutside: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disables both Escape key and click outside behaviors. The dropdown can only be closed by selecting an option or clicking the select button. Useful for modal-like contexts where you want to force a selection.',
      },
    },
  },
};

export const MixedOptions: Story = {
  args: {
    options: mixedOptions,
    defaultText: 'Mixed option types',
    dropdownWidth: '280px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates a mix of simple, disabled, and complex options with various features.',
      },
    },
  },
};

// Placement variations
export const TopPlacement: Story = {
  args: {
    options: basicOptions,
    placement: 'top',
    defaultText: 'Dropdown opens above',
  },
  parameters: {
    docs: {
      description: {
        story: 'Configure dropdown placement relative to the trigger button.',
      },
    },
  },
};

export const LeftPlacement: Story = {
  args: {
    options: basicOptions,
    placement: 'left',
    defaultText: 'Opens to left',
  },
};

export const RightPlacement: Story = {
  args: {
    options: basicOptions,
    placement: 'right',
    defaultText: 'Opens to right',
  },
};

// Interactive examples
export const InteractiveExample: Story = {
  render: (args) => (
    <Select
      {...args}
      onchange={(event) => {
        console.log('Selection changed:', event.value);
        // In a real app, you might update some state here
        alert(`Selected: ${event.value || 'None'}`);
      }}
    />
  ),
  args: {
    options: basicOptions,
    defaultText: 'Click to see change event',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the change event handler that fires when selection changes.',
      },
    },
  },
};

// Edge cases and error states
export const EmptyOptions: Story = {
  args: {
    options: [],
    defaultText: 'No options available',
  },
  parameters: {
    docs: {
      description: {
        story: 'Handles the case when no options are provided.',
      },
    },
  },
};

export const SingleOption: Story = {
  args: {
    options: [{ label: 'Only Option', value: 'only' }],
    defaultText: 'Single option',
  },
};

export const LongOptions: Story = {
  args: {
    options: [
      {
        label: 'This is a very long option label that might overflow',
        value: 'long1',
        description:
          'And this is an even longer description that explains the purpose of this particular option in great detail',
      },
      {
        label: 'Another extremely long option with lots of text',
        value: 'long2',
        description: 'Short desc',
      },
      {
        label: 'Short',
        value: 'short',
        description:
          'But this description is much longer than the label and contains a lot of explanatory text about what this option does',
      },
    ],
    dropdownWidth: '300px',
    defaultText: 'Long content handling',
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests how the component handles long labels and descriptions with text wrapping.',
      },
    },
  },
};

// Accessibility testing
export const AccessibilityTest: Story = {
  args: {
    options: basicOptions,
    defaultText: 'Accessibility test',
    id: 'accessible-select',
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests accessibility features like ARIA attributes and keyboard navigation.',
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'select-name', enabled: true },
          { id: 'aria-valid-attr-value', enabled: true },
        ],
      },
    },
  },
};

// Performance testing with many options
export const ManyOptions: Story = {
  args: {
    options: Array.from({ length: 100 }, (_, i) => ({
      label: `Option ${i + 1}`,
      value: `option${i + 1}`,
      ...(i % 10 === 0 ? { description: `Description for option ${i + 1}` } : {}),
      ...(i % 15 === 0 ? { isDisabled: true } : {}),
    })),
    enableSearch: true,
    defaultText: '100 options with search',
    dropdownHeight: '200px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance test with many options. Search functionality helps manage large lists.',
      },
    },
  },
};

// Validation and error states
export const WithErrorAlert: Story = {
  args: {
    options: basicOptions,
    defaultText: 'Select a required option',
    alert: {
      type: 'error',
      message: 'This field is required. Please select an option.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows an error alert with a validation message. Hover over the select to see the tooltip.',
      },
    },
  },
};

export const WithWarningAlert: Story = {
  args: {
    options: basicOptions,
    selected: 'option3',
    defaultText: 'Select an option',
    alert: {
      type: 'warning',
      message: 'This option may affect performance. Consider choosing a different option.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning alert to inform users about potential issues with their selection.',
      },
    },
  },
};

export const WithSuccessAlert: Story = {
  args: {
    options: basicOptions,
    selected: 'option1',
    defaultText: 'Select an option',
    alert: {
      type: 'success',
      message: 'Great choice! This option is optimized for your use case.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Success alert to confirm a good selection or provide positive feedback.',
      },
    },
  },
};

export const WithInfoAlert: Story = {
  args: {
    options: basicOptions,
    defaultText: 'Select configuration',
    alert: {
      type: 'info',
      message: 'Tip: You can change this setting later in your preferences.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Info alert to provide additional context or helpful information.',
      },
    },
  },
};

export const InvalidState: Story = {
  args: {
    options: basicOptions,
    defaultText: 'Invalid selection',
    invalid: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the select in an invalid state with red outline styling.',
      },
    },
  },
};

export const InvalidWithAlert: Story = {
  args: {
    options: basicOptions,
    defaultText: 'Select a value',
    invalid: true,
    alert: {
      type: 'error',
      message: 'Please select a valid option to continue.',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Combines invalid state styling with an error alert message for comprehensive validation feedback.',
      },
    },
  },
};

export const ValidationStates: Story = {
  args: {
    options: [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' },
    ],
    defaultText: 'Validation example',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic validation state. See other validation stories (WithErrorAlert, WithWarningAlert, etc.) for different alert types and invalid states.',
      },
    },
  },
};

// Form validation example
export const FormValidationExample: Story = {
  render: (args) => (
    <Select
      {...args}
      onchange={(event) => {
        // Simulate form validation
        const value = event.value;
        if (!value) {
          // Update to show required field error
          console.log('Validation: Field is required');
        } else if (value === 'option3') {
          // Show warning for specific option
          console.log('Validation: Warning for option 3');
        } else {
          // Valid selection
          console.log('Validation: Valid selection');
        }
      }}
    />
  ),
  args: {
    options: [
      { label: 'Valid Option 1', value: 'option1' },
      { label: 'Valid Option 2', value: 'option2' },
      { label: 'Problematic Option', value: 'option3' },
      { label: 'Another Valid Option', value: 'option4' },
    ],
    defaultText: 'Choose wisely...',
    alert: {
      type: 'info',
      message: 'Select an option to see validation feedback',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example showing how validation states might change based on user selection in a real form.',
      },
    },
  },
};

// Items disabled
export const ItemsDisabled: Story = {
  args: {
    options: basicOptions,
    itemsDisabled: true,
    itemsDisabledMessage: 'Items are currently unavailable',
    defaultText: 'Items disabled',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disables all dropdown items and search input. The dropdown still opens and closes normally, but no selection or filtering can occur.',
      },
    },
  },
};

export const ItemsDisabledWithSearch: Story = {
  args: {
    options: basicOptions,
    itemsDisabled: true,
    enableSearch: true,
    defaultText: 'Search disabled too',
  },
  parameters: {
    docs: {
      description: {
        story: 'When itemsDisabled is true, the search input is also disabled along with all items.',
      },
    },
  },
};

// Async refresh on open example
export const AsyncRefreshOnOpen: Story = {
  render: () => (
    <SelectItemsDisabledStory
      options={basicOptions}
      defaultText="Open to refresh"
      dropdownWidth="250px"
      dropdownHeight="200px"
      enableSearch={true}
    />
  ),
  args: {
    options: basicOptions,
    defaultText: 'Open to refresh',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the `onOpen` + `itemsDisabled` pattern: opening the dropdown triggers a simulated 2s async refresh. Items and search are disabled during the refresh, then re-enabled with fresh data.',
      },
    },
  },
};

// Footer example
const providerOptions: SelectOption[] = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Google', value: 'google' },
  { label: 'Cloudflare', value: 'cloudflare' },
  { label: 'Youtube', value: 'youtube' },
  { label: 'Swiper', value: 'swiper' },
  { label: 'GSAP', value: 'gsap' },
];

export const WithFooter: Story = {
  render: () => (
    <SelectWithFooterStory
      options={providerOptions}
      defaultText="Providers"
      dropdownWidth="250px"
      dropdownHeight="200px"
      selected="facebook"
    />
  ),
  args: {
    options: providerOptions,
    defaultText: 'Providers',
    dropdownWidth: '250px',
    dropdownHeight: '200px',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Select with a sticky footer action. The footer stays visible while scrolling through options. Click the footer to trigger a custom action and close the dropdown.',
      },
    },
  },
};
