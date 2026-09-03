import type { Meta, StoryObj } from '@storybook/react-vite';

import { TagsInput } from './TagsInput';

const meta = {
  title: 'Ui/TagsInput',
  component: TagsInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile tags input component with support for various states, validation, and customization. Similar to shadcn tags input but styled for our design system.',
      },
    },
  },
  args: {
    width: '420px',
    height: '70px',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'object',
      description: 'Array of tag values',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no tags and input is empty',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the entire component',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state',
    },
    invalid: {
      control: 'boolean',
      description: 'Applies invalid styling',
    },
    readonly: {
      control: 'boolean',
      description: 'Makes tags read-only (no adding/removing)',
    },
    maxTags: {
      control: 'number',
      description: 'Maximum number of tags allowed',
    },
    minTags: {
      control: 'number',
      description: 'Minimum number of tags required',
    },
    maxTagLength: {
      control: 'number',
      description: 'Maximum length of each tag',
    },
    allowDuplicates: {
      control: 'boolean',
      description: 'Whether to allow duplicate tags',
    },
    trimTags: {
      control: 'boolean',
      description: 'Whether to trim whitespace from tags',
    },
    showRemoveIcon: {
      control: 'boolean',
      description: 'Whether to always show the remove icon on tags',
    },
    expandOnClick: {
      control: 'boolean',
      description: 'Whether clicking a tag expands it to show full content',
    },
    parseSrcFromHtmlPaste: {
      control: 'boolean',
      description:
        'When true, paste extracts `src` from script, iframe, and img tags instead of pasting raw HTML into the field',
    },
    width: {
      control: 'text',
      description: 'Custom width for the component',
    },
    height: {
      control: 'text',
      description: 'Custom height for the component',
    },
  },
} satisfies Meta<typeof TagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    placeholder: 'Add tags...',
  },
};

export const WithInitialTags: Story = {
  args: {
    value: ['JavaScript', 'TypeScript', 'Svelte'],
    placeholder: 'Add more tags...',
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Type and press Enter to add tags...',
  },
};

// States
export const Disabled: Story = {
  args: {
    value: ['Disabled', 'Tag'],
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    value: ['Loading', 'Tags'],
    loading: true,
  },
};

export const Invalid: Story = {
  args: {
    value: ['Invalid', 'Input'],
    invalid: true,
  },
};

export const ReadOnly: Story = {
  args: {
    value: ['Read', 'Only', 'Tags'],
    readonly: true,
  },
};

// Constraints
export const MaxTags: Story = {
  args: {
    value: ['Tag 1', 'Tag 2', 'Tag 3'],
    maxTags: 3,
    placeholder: 'Max 3 tags reached',
  },
  parameters: {
    docs: {
      description: {
        story: 'Maximum of 3 tags allowed. Input is hidden when limit is reached.',
      },
    },
  },
};

export const MaxTagLength: Story = {
  args: {
    value: ['short'],
    maxTagLength: 10,
    placeholder: 'Max 10 chars per tag...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Tags cannot exceed 10 characters.',
      },
    },
  },
};

export const NoDuplicates: Story = {
  args: {
    value: ['unique', 'tags'],
    allowDuplicates: false,
    placeholder: 'Try adding "unique" again...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Duplicate tags are not allowed (default behavior).',
      },
    },
  },
};

export const AllowDuplicates: Story = {
  args: {
    value: ['duplicate', 'duplicate'],
    allowDuplicates: true,
    placeholder: 'Duplicates allowed here...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Duplicate tags are allowed when allowDuplicates is true.',
      },
    },
  },
};

// Alert states
export const ErrorAlert: Story = {
  args: {
    value: ['Invalid'],
    invalid: true,
    alert: {
      type: 'error',
      message: 'Please add at least 3 tags',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Tags input with error state. Hover to see the error tooltip.',
      },
    },
  },
};

export const SuccessAlert: Story = {
  args: {
    value: ['Valid', 'Tags', 'Added'],
    alert: {
      type: 'success',
      message: 'Tags are valid!',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Tags input with success state. Hover to see the success tooltip.',
      },
    },
  },
};

export const InfoAlert: Story = {
  args: {
    value: ['Info'],
    alert: {
      type: 'info',
      message: 'Add tags separated by comma or Enter',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Tags input with info state. Hover to see the info tooltip.',
      },
    },
  },
};

export const WarningAlert: Story = {
  args: {
    value: ['Warning', 'Tag'],
    alert: {
      type: 'warning',
      message: 'Some tags may need review',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Tags input with warning state. Hover to see the warning tooltip.',
      },
    },
  },
};

// Sizing
export const CustomWidth: Story = {
  args: {
    value: ['Custom', 'Width'],
    width: '400px',
    placeholder: 'Wide input...',
  },
};

export const CustomHeight: Story = {
  args: {
    value: ['Custom', 'Height', 'With', 'Multiple', 'Tags'],
    height: '80px',
    placeholder: 'Taller input...',
  },
};

export const FullWidth: Story = {
  args: {
    value: ['Full'],
    width: '100%',
    placeholder: 'Full width input...',
  },
};

// Interactive examples
export const InteractiveExample: Story = {
  args: {
    value: ['React', 'Vue'],
    placeholder: 'Add a framework...',
    onValueChange: (tags) => console.log('Tags changed:', tags),
    onTagAdd: (tag) => console.log('Tag added:', tag),
    onTagRemove: (tag, index) => console.log('Tag removed:', tag, 'at index', index),
    onInvalidTag: (tag, reason) => console.log('Invalid tag:', tag, 'Reason:', reason),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with all event handlers. Check the console for events.',
      },
    },
  },
};

// Validation examples
export const CustomValidation: Story = {
  args: {
    value: ['#valid'],
    placeholder: 'Tags must start with #...',
    validateTag: (tag) => {
      if (!tag.startsWith('#')) {
        return 'Tags must start with #';
      }
      return true;
    },
    onInvalidTag: (tag, reason) => console.log('Invalid:', tag, reason),
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom validation requiring tags to start with #. Try adding a tag without #.',
      },
    },
  },
};

export const EmailValidation: Story = {
  args: {
    value: ['user@example.com'],
    placeholder: 'Add email addresses...',
    validateTag: (tag) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(tag)) {
        return 'Please enter a valid email';
      }
      return true;
    },
    onInvalidTag: (tag, reason) => console.log('Invalid:', tag, reason),
  },
  parameters: {
    docs: {
      description: {
        story: 'Email validation example. Only valid email addresses are accepted.',
      },
    },
  },
};

// Real-world examples
export const CategoryTags: Story = {
  args: {
    value: ['Technology', 'Design', 'Marketing'],
    placeholder: 'Add categories...',
    maxTags: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Category tagging with a maximum of 5 tags.',
      },
    },
  },
};

export const SkillsTags: Story = {
  args: {
    value: ['JavaScript', 'React', 'Node.js', 'CSS'],
    placeholder: 'Add your skills...',
    maxTagLength: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Skills input with max tag length of 20 characters.',
      },
    },
  },
};

export const KeywordsTags: Story = {
  args: {
    value: ['seo', 'marketing', 'content'],
    placeholder: 'Add keywords for SEO...',
    maxTags: 10,
    onValueChange: (tags) => console.log('Keywords:', tags),
  },
  parameters: {
    docs: {
      description: {
        story: 'SEO keywords input with up to 10 tags.',
      },
    },
  },
};

export const FormIntegration: Story = {
  args: {
    id: 'form-tags',
    value: ['tag1'],
    placeholder: 'Add tags for form...',
    alert: {
      type: 'info',
      message: 'Tags will be submitted with the form',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing tags input in a form context. Compatible with Zod validation schemas.',
      },
    },
  },
};

// Edge cases
export const ManyTags: Story = {
  args: {
    value: Array.from({ length: 20 }, (_, i) => `Tag ${i + 1}`),
    placeholder: 'Lots of tags...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance test with 20 tags.',
      },
    },
  },
};

export const LongTags: Story = {
  args: {
    value: ['This is a very long tag name', 'Another extremely long tag'],
    placeholder: 'Long tags get truncated...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Long tags are truncated with ellipsis.',
      },
    },
  },
};

export const ShowRemoveIcon: Story = {
  args: {
    value: ['JavaScript', 'TypeScript', 'Svelte'],
    showRemoveIcon: true,
    placeholder: 'Remove icon always visible...',
  },
  parameters: {
    docs: {
      description: {
        story: 'When showRemoveIcon is true, the X button is always visible inline with 4px gap.',
      },
    },
  },
};

export const ExpandOnClick: Story = {
  args: {
    value: [
      'This is a very long tag that will be truncated',
      'Another long tag content here',
      'Short',
    ],
    expandOnClick: true,
    placeholder: 'Click tags to expand...',
  },
  parameters: {
    docs: {
      description: {
        story: 'When expandOnClick is true, clicking a tag expands it to show full content.',
      },
    },
  },
};

export const ShowRemoveIconAndExpandOnClick: Story = {
  args: {
    value: ['This is a very long tag name', 'TypeScript', 'Click me to expand'],
    showRemoveIcon: true,
    expandOnClick: true,
    placeholder: 'Both features enabled...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Both showRemoveIcon and expandOnClick enabled together.',
      },
    },
  },
};

export const ParseSrcFromHtmlPaste: Story = {
  args: {
    parseSrcFromHtmlPaste: true,
    placeholder: 'Paste embed HTML (script / iframe / img)…',
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `parseSrcFromHtmlPaste`, pasting snippets such as `<script src="…">`, `<iframe src="…">`, or `<img src="…"/>` adds each `src` as a tag.',
      },
    },
  },
};

export const SpecialCharacters: Story = {
  args: {
    value: ['C++', 'C#', '.NET', '@angular', '#svelte'],
    placeholder: 'Special characters work...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Tags with special characters are supported.',
      },
    },
  },
};

export const UnicodeSupport: Story = {
  args: {
    value: ['日本語', '中文', '한국어', '🎉', '✨'],
    placeholder: 'Unicode support...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Full Unicode support including CJK characters and emoji.',
      },
    },
  },
};
