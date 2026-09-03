import type { Meta, StoryObj } from '@storybook/react-vite';

import { CopyText } from './CopyText';

const meta = {
  title: 'Ui/CopyText',
  component: CopyText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable copy-to-clipboard component that handles text copying with visual feedback and optional notifications. Built with React hooks and proper TypeScript support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'The content to be copied to clipboard',
    },
    title: {
      control: 'text',
      description: 'Optional title/heading text to display above the copy area',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the copy functionality is disabled',
    },
    raw: {
      control: 'boolean',
      description: 'Whether to show the content in raw format (with HTML) or cleaned',
    },
    hidden: {
      control: 'boolean',
      description: 'Whether the component is in a hidden state',
    },
    comment: {
      control: 'text',
      description: 'Optional comment to prepend to copied content when in raw mode',
    },
    tooltip: {
      control: 'text',
      description: 'Custom tooltip text for the copy button',
    },
    className: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
} satisfies Meta<typeof CopyText>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    content: 'console.log("Hello, World!");',
  },
};

export const WithTitle: Story = {
  args: {
    content: 'npm install @your-org/ui-library',
    title: 'Installation Command',
  },
};

export const Disabled: Story = {
  args: {
    content: 'This content cannot be copied',
    title: 'Disabled Copy',
    disabled: true,
  },
};

export const RawContent: Story = {
  args: {
    content: '<script>\n  console.log("Raw HTML/JS content");\n</script>',
    title: 'Raw HTML/JavaScript',
    raw: true,
  },
};

export const RawContentWithComment: Story = {
  args: {
    content: '<script>\n  // Your custom code here\n  console.log("Hello from script!");\n</script>',
    title: 'Script with Comment',
    raw: true,
    comment: 'Add this script to your site',
    onCopy: (content) => {
      console.log('Copied content:', content);
    },
  },
};

export const MultilineContent: Story = {
  args: {
    content: `function greetUser(name) {
  return \`Hello, \${name}! Welcome to our app.\`;
}

// Usage example
const greeting = greetUser('Alice');
console.log(greeting);`,
    title: 'JavaScript Function',
    tooltip: 'Copy this function to your clipboard',
  },
};

export const LongContent: Story = {
  args: {
    content: `// This is a very long line of code that demonstrates how the component handles content that exceeds the maximum width of the container and needs to wrap or scroll horizontally for better user experience and readability.
const veryLongVariableName = "This is a demonstration of very long content that might need horizontal scrolling";`,
    title: 'Long Content Example',
  },
};

export const CustomTooltip: Story = {
  args: {
    content: 'secret-api-key-12345',
    title: 'API Key',
    tooltip: 'Click to copy your API key',
  },
};

// Interactive examples with callbacks
export const WithNotifications: Story = {
  args: {
    content: 'Content with notification feedback',
    title: 'Copy with Notifications',
    onNotify: (options) => {
      // Simulate webflow.notify or any notification system
      console.log(`${options.type}: ${options.message}`);
      alert(`${options.type}: ${options.message}`);
    },
    onCopy: (content) => {
      console.log('Copied:', content);
    },
    onError: (error) => {
      console.error('Copy failed:', error);
    },
  },
};

// Different content types
export const HTMLSnippet: Story = {
  args: {
    content: `<div class="banner">
  <h1>Welcome to our site!</h1>
  <p>This is a sample HTML snippet.</p>
</div>`,
    title: 'HTML Snippet',
    raw: true,
  },
};

export const CSSCode: Story = {
  args: {
    content: `.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
}`,
    title: 'CSS Styles',
  },
};

export const JSONData: Story = {
  args: {
    content: `{
  "name": "CopyText Component",
  "version": "1.0.0",
  "description": "A reusable copy-to-clipboard component",
  "features": [
    "React hooks",
    "TypeScript support",
    "Accessibility compliant",
    "Customizable styling"
  ]
}`,
    title: 'JSON Configuration',
  },
};

// State demonstrations
export const CopiedState: Story = {
  args: {
    content: 'Content with callback notifications instead of visual styling',
    title: 'Copy State Demo',
    onNotify: (options) => {
      alert(`${options.type}: ${options.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'After clicking copy, notifications are handled via callbacks rather than visual styling changes.',
      },
    },
  },
};

export const WithCustomStyles: Story = {
  args: {
    content: 'Styled copy text component',
    title: 'Custom Styled',
    className: 'custom-copy-text',
  },
  parameters: {
    docs: {
      description: {
        story: 'The component accepts custom CSS classes for styling customization.',
      },
    },
  },
};

// Edge cases
export const EmptyContent: Story = {
  args: {
    content: '',
    title: 'Empty Content',
  },
};

export const SpecialCharacters: Story = {
  args: {
    content: `Special chars: !@#$%^&*()_+-=[]{}|;':",./<>?
Unicode: 🚀 💻 🎉 ✨ 🔥
Escaped: "quotes" 'apostrophes' \\backslashes\\`,
    title: 'Special Characters',
  },
};

// Real-world examples
export const InstallCommand: Story = {
  args: {
    content: 'npm install clipboard react @types/node',
    title: 'Installation',
    tooltip: 'Copy install command',
  },
};

export const GitClone: Story = {
  args: {
    content: 'git clone https://github.com/your-org/your-repo.git',
    title: 'Clone Repository',
    tooltip: 'Copy git clone command',
  },
};

export const APIEndpoint: Story = {
  args: {
    content: 'https://api.yourservice.com/v1/users',
    title: 'API Endpoint',
    tooltip: 'Copy API endpoint URL',
  },
};
