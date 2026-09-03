import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Section } from './Section';

const meta = {
  title: 'UI/Section',
  component: Section,
  tags: ['autodocs'],
  argTypes: {
    hide: {
      control: 'boolean',
      description: 'Whether to hide the section',
    },
    borders: {
      control: 'check',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Which borders to show on the section',
    },
    active: {
      control: 'boolean',
      description: 'Whether to show an active state',
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the section is clickable (enables hover effects and interaction)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the section is disabled',
    },
    scrollable: {
      control: 'boolean',
      description: 'Enable scrollable content with native browser scrollbars',
    },
    className: {
      control: 'text',
      description: 'Custom CSS class names',
    },
    disabledMessage: {
      control: 'text',
      description: 'Message to show in disabled tooltip (enables edit mode warning)',
    },
    disabledTooltipWidth: {
      control: 'text',
      description: 'Width of the disabled tooltip',
    },
    onclick: { action: 'clicked' },
  },
  args: {
    onclick: fn(),
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  backgroundColor: 'black',
  color: 'white',
  width: '400px',
  height: '300px',
};

const scrollableArgs = {
  backgroundColor: 'black',
  color: 'white',
  width: '400px',
  height: '200px',
};
void scrollableArgs;

export const Default: Story = {
  args: {
    ...defaultArgs,
    children: 'Default section content',
  },
};

export const WithBorders: Story = {
  name: 'With Borders',
  args: {
    borders: ['top', 'bottom'],
    ...defaultArgs,
    children: 'Section with top and bottom borders',
  },
};

export const AllBorders: Story = {
  name: 'All Borders',
  args: {
    borders: ['top', 'bottom', 'left', 'right'],
    ...defaultArgs,
    children: 'Section with all borders',
  },
};

export const Active: Story = {
  args: {
    active: true,
    ...defaultArgs,
    children: 'Active section',
  },
};

export const Clickable: Story = {
  args: {
    clickable: true,
    ...defaultArgs,
    children: 'Clickable section - try clicking or using keyboard',
  },
};

export const DisabledClickable: Story = {
  name: 'Disabled Clickable',
  args: {
    clickable: true,
    disabled: true,
    ...defaultArgs,
    children: 'Disabled clickable section',
  },
};

export const Scrollable: Story = {
  args: {
    scrollable: true,
    ...defaultArgs,
    children: (
      <div style={{ width: '100%' }}>
        <h3 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '16px' }}>
          Scrollable Content Test
        </h3>
        <p style={{ margin: '8px 0', color: '#ccc', lineHeight: 1.4 }}>
          This is scrollable content that should overflow the container.
        </p>
        {Array.from({ length: 18 }, (_, i) => (
          <p key={i} style={{ margin: '8px 0', color: '#ccc', lineHeight: 1.4 }}>
            Line {i + 2} of content
          </p>
        ))}
        <p style={{ margin: '8px 0', color: '#ccc', lineHeight: 1.4 }}>
          This should be scrollable! 🎯
        </p>
      </div>
    ),
  },
};

export const WithTooltip: Story = {
  name: 'With Tooltip',
  args: {
    // Source spread `defaultArgs` inside the tooltip config (a bug); the sizing
    // args are applied to the section itself here so the story still typechecks.
    tooltip: {
      message: 'This is a helpful tooltip message',
      placement: 'top',
    },
    ...defaultArgs,
    children: 'Section with custom tooltip - hover to see',
  },
};

export const DisabledInEditMode: Story = {
  name: 'Disabled in Edit Mode',
  args: {
    disabledMessage:
      'This option is disabled in edit mode. If you want to change it, please generate a new Component.',
    ...defaultArgs,
    children: 'Section disabled in edit mode - hover to see warning',
  },
};

export const CombinedFeatures: Story = {
  name: 'Combined Features',
  args: {
    clickable: true,
    active: true,
    borders: ['top', 'bottom'],
    scrollable: true,
    width: '400px',
    height: '120px', // Small height to force scrolling
    backgroundColor: 'black',
    children: (
      <div style={{ padding: '12px' }}>
        <p style={{ margin: '4px 0', color: 'white' }}>
          Combined features: clickable, active, bordered, and scrollable
        </p>
        <p style={{ margin: '4px 0', color: '#ccc' }}>More content to scroll through</p>
        <p style={{ margin: '4px 0', color: '#ccc' }}>Even more content here</p>
        <p style={{ margin: '4px 0', color: '#ccc' }}>Additional line of text</p>
        <p style={{ margin: '4px 0', color: '#ccc' }}>Last line of content</p>
      </div>
    ),
  },
};

export const ComplexLayout: Story = {
  name: 'Complex Layout',
  args: {
    ...defaultArgs,
    children: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Complex Content</h3>
        <p>This section contains various UI elements:</p>
        <button className="px-3 py-1 bg-blue-500 text-white rounded">Button</button>
        <input type="text" placeholder="Input field" className="border rounded px-2 py-1" />
        <select className="border rounded px-2 py-1">
          <option>Select option</option>
        </select>
      </div>
    ),
  },
};

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  args: {
    clickable: true,
    borders: ['left'],
    ...defaultArgs,
    children: (
      <div className="p-2">
        <h4 className="font-medium mb-2">Interactive Demo</h4>
        <p className="text-sm text-gray-600">
          Click this section or use keyboard navigation (Tab + Enter/Space)
        </p>
      </div>
    ),
  },
};

export const AccessibilityTest: Story = {
  name: 'Accessibility Test',
  args: {
    clickable: true,
    // Source passed the (unsupported) value 'all'; kept for parity
    borders: ['all' as never],
    ...defaultArgs,
    children: 'Accessibility test - proper ARIA attributes and keyboard support',
  },
};

export const Hidden: Story = {
  args: {
    hide: true,
    ...defaultArgs,
    children: 'This section is hidden',
  },
};
