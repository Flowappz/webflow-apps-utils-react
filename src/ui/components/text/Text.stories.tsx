import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { AccountIcon, DeleteIcon, ToolTipInfoCircleIcon } from '../../icons';
import { Text } from './Text';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'UI/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'The text content to display',
    },
    fontSize: {
      control: { type: 'select' },
      options: ['normal', 'large'],
      description: 'Size of the text',
    },
    fontWeight: {
      control: { type: 'select' },
      options: ['normal', 'bold'],
      description: 'Weight of the text',
    },
    fontColor: {
      control: { type: 'color' },
      description: 'Color of the text',
    },
    textAlign: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Text alignment',
    },
    wrap: {
      control: { type: 'select' },
      options: ['normal', 'nowrap'],
      description: 'Text wrapping behavior',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state with spinner',
    },
    link: {
      control: { type: 'boolean' },
      description: 'Render as clickable link',
    },
    raw: {
      control: { type: 'boolean' },
      description: 'Render text as raw HTML',
    },
    ellipsisOnWidth: {
      control: { type: 'text' },
      description: 'Width at which text should ellipsis',
    },
    tooltip: {
      control: { type: 'object' },
      description: 'Tooltip configuration',
    },
    tooltipTarget: {
      control: { type: 'select' },
      options: ['text', 'icon'],
      description: 'Specifies whether to show tooltip on text or icon',
    },
    popup: {
      control: { type: 'object' },
      description: 'Popup action configuration',
    },
    onclick: { action: 'clicked' },
  },
  args: {
    onclick: fn(),
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default text',
  },
};

export const WithIcon: Story = {
  name: 'With Icon',
  args: {
    label: 'Text with icon',
    icon: AccountIcon,
  },
};

export const LoadingState: Story = {
  name: 'Loading State',
  args: {
    label: 'Loading text',
    loading: true,
  },
};

export const ClickableLink: Story = {
  name: 'Clickable Link',
  args: {
    label: 'Clickable text',
    link: true,
  },
};

export const TextAlignmentAndEllipsis: Story = {
  name: 'Text Alignment & Ellipsis',
  render: () => (
    <div
      style={{
        width: 300,
        border: '1px solid #ddd',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ border: '1px dashed #ccc', padding: 8 }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>Alignment:</h4>
        <Text label="Left aligned" textAlign="left" />
        <Text label="Center aligned" textAlign="center" />
        <Text label="Right aligned" textAlign="right" />
      </div>

      <div style={{ border: '1px dashed #ccc', padding: 8 }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>Ellipsis (150px):</h4>
        <Text
          label="This is a long text that will be truncated with ellipsis when it exceeds the width"
          ellipsisOnWidth="150px"
        />
      </div>

      <div style={{ border: '1px dashed #ccc', padding: 8 }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>
          Icon + Ellipsis (120px):
        </h4>
        <Text label="Long text with icon and ellipsis" icon={DeleteIcon} ellipsisOnWidth="120px" />
      </div>

      <div style={{ border: '1px dashed #ccc', padding: 8 }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>
          Loading + Ellipsis (120px):
        </h4>
        <Text label="Loading text with ellipsis" loading={true} ellipsisOnWidth="120px" />
      </div>

      <div style={{ border: '1px dashed #ccc', padding: 8 }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>
          Center + Ellipsis (120px):
        </h4>
        <Text label="Centered text with ellipsis" textAlign="center" ellipsisOnWidth="120px" />
      </div>
    </div>
  ),
};

export const WithTooltip: Story = {
  name: 'With Tooltip',
  args: {
    label: 'Text with tooltip',
    tooltip: {
      message: 'This is a helpful tooltip message',
      placement: 'top',
    },
  },
};

export const TooltipOnIcon: Story = {
  name: 'Tooltip on Icon',
  args: {
    label: 'Text with tooltip on icon',
    icon: ToolTipInfoCircleIcon,
    tooltip: {
      message: 'This tooltip appears on the icon',
      placement: 'top',
    },
    tooltipTarget: 'icon',
  },
};

export const TooltipTargetExamples: Story = {
  name: 'Tooltip Target Examples',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <div style={{ border: '1px dashed #ccc', padding: 12 }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>
          Tooltip on Text (default):
        </h4>
        <Text
          label="Hover over this text"
          icon={AccountIcon}
          tooltip={{ message: 'Tooltip on the text', placement: 'top' }}
          tooltipTarget="text"
        />
      </div>

      <div style={{ border: '1px dashed #ccc', padding: 12 }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>Tooltip on Icon:</h4>
        <Text
          label="Hover over the icon"
          icon={ToolTipInfoCircleIcon}
          tooltip={{ message: 'Tooltip on the icon', placement: 'top' }}
          tooltipTarget="icon"
        />
      </div>

      <div style={{ border: '1px dashed #ccc', padding: 12 }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>
          With Ellipsis + Icon Tooltip:
        </h4>
        <Text
          label="Long text that will be truncated with ellipsis"
          icon={ToolTipInfoCircleIcon}
          tooltip={{ message: 'Icon tooltip with ellipsis', placement: 'top' }}
          tooltipTarget="icon"
          ellipsisOnWidth="200px"
        />
      </div>

      <div style={{ border: '1px dashed #ccc', padding: 12 }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>
          Invalid Configuration (no icon for icon target):
        </h4>
        <Text
          label="No icon but tooltipTarget is icon"
          tooltip={{ message: 'This tooltip should not show', placement: 'top' }}
          tooltipTarget="icon"
        />
      </div>
    </div>
  ),
};

export const WithPopupAction: Story = {
  name: 'With Popup Action',
  args: {
    label: 'Text with popup action',
    popup: {
      active: true,
      title: 'Remove',
      subtitle: 'Alt + click',
      description: 'This will remove the current selection.',
      onclick: () => console.log('Popup action clicked'),
    },
  },
};

export const StylingOptions: Story = {
  name: 'Styling Options',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text label="Large bold text" fontSize="large" fontWeight="bold" />
      <Text label="Colored text" fontColor="#007acc" />
      <Text label="Text with <strong>bold</strong> formatting" raw={true} />
      <Text label="Disabled text" disabled={true} />
    </div>
  ),
};

export const ComplexExample: Story = {
  name: 'Complex Example',
  args: {
    label: 'Complex text with all features',
    fontSize: 'large',
    fontWeight: 'bold',
    fontColor: '#2563eb',
    icon: AccountIcon,
    link: true,
    tooltip: {
      message: 'This demonstrates multiple features working together',
    },
    popup: {
      active: true,
      title: 'Advanced Action',
      subtitle: 'Alt + click',
      description: 'This demonstrates a complex text component.',
    },
  },
};
