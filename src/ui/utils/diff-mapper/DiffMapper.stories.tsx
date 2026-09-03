import type { Meta, StoryObj } from '@storybook/react-vite';

import DiffMapperDemo from './DiffMapperDemo';

const meta = {
  title: 'Utils/DiffMapper',
  component: DiffMapperDemo,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#292929' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    docs: {
      description: {
        component: `
# DiffMapper Utilities

The DiffMapper utility provides intelligent object comparison with type coercion, whitespace handling, and advanced diff detection. Built specifically for configurator state management and general object comparison needs.

## Features

- **Smart Type Coercion**: Handles string/number/boolean conversions intelligently
- **Whitespace Handling**: Automatically trims and compares string values
- **Deep Comparison**: Recursively compares nested objects and arrays
- **Performance Optimized**: Includes caching and circular reference detection
- **Detailed Diff Output**: Provides granular change information
- **Type Safety**: Full TypeScript support with proper type definitions

## API Reference

### Core Functions

#### \`hasChangesViaDiff<T>(current: T, updated: T): boolean\`

Determines if there are any meaningful changes between two objects.

\`\`\`typescript
const config1 = { theme: 'dark', notifications: true };
const config2 = { theme: 'light', notifications: true };

const hasChanges = hasChangesViaDiff(config1, config2); // true
\`\`\`

**Features:**
- Automatic caching for performance
- Type coercion handling
- Whitespace normalization
- Deep nested comparison

#### \`getDetailedDiff<T>(current: T, updated: T): DiffResult | DiffMap\`

Returns a detailed diff map showing exactly what changed.

\`\`\`typescript
const user1 = {
  profile: { name: 'John', age: 30 },
  settings: { theme: 'dark' }
};

const user2 = {
  profile: { name: 'John', age: 31 },
  settings: { theme: 'light', notifications: true }
};

const diff = getDetailedDiff(user1, user2);
// Returns detailed diff structure showing exactly what changed
\`\`\`

### Diff Types

\`\`\`typescript
enum DiffType {
	UNCHANGED = 'UNCHANGED', // Value is identical
	UPDATED = 'UPDATED', // Value was modified
	CREATED = 'CREATED', // Property was added
	DELETED = 'DELETED' // Property was removed
}
\`\`\`

## Type Coercion Examples

The diff mapper intelligently handles type coercion:

### String/Number Coercion
\`\`\`typescript
// These are considered UNCHANGED
hasChangesViaDiff({ value: '42' }, { value: 42 }); // false
hasChangesViaDiff({ value: '0' }, { value: 0 }); // false
hasChangesViaDiff({ value: '' }, { value: 0 }); // false
\`\`\`

### String/Boolean Coercion
\`\`\`typescript
// These are considered UNCHANGED
hasChangesViaDiff({ active: 'true' }, { active: true }); // false
hasChangesViaDiff({ active: 'false' }, { active: false }); // false
hasChangesViaDiff({ active: '' }, { active: false }); // false
\`\`\`

### Whitespace Handling
\`\`\`typescript
// These are considered UNCHANGED
hasChangesViaDiff({ name: 'John' }, { name: '  John  ' }); // false
hasChangesViaDiff({ value: '42' }, { value: ' 42 ' }); // false

// But these are UPDATED (whitespace-only strings ≠ numbers)
hasChangesViaDiff({ value: '  ' }, { value: 0 }); // true
hasChangesViaDiff({ value: ' ' }, { value: false }); // true
\`\`\`

## Performance Features

### Caching Strategy
Results are cached for 1 second to avoid expensive re-computation:

\`\`\`typescript
const cacheKey = JSON.stringify([current, updated]);
const cached = diffCache.get(cacheKey);

if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
  return cached.result;
}
\`\`\`

### Memory Management
Automatic cache cleanup when size exceeds 100 entries or TTL expires.

## GlobalProvider Integration

The diff mapper is seamlessly integrated with the GlobalProvider system:

\`\`\`typescript
import { useConfiguratorContext } from '../../../providers';

const configurator = useConfiguratorContext<MyConfigType>();

// Automatic change detection using diff mapper
const hasChanged = configurator.hasChanged; // Uses hasChangesViaDiff internally

// Manual comparison
const currentConfig = configurator.configurator;
const cachedConfig = configurator.configuratorCache;
const changes = getDetailedDiff(currentConfig, cachedConfig);
\`\`\`

## Usage with GlobalProvider

For manual configurator state management:

\`\`\`typescript
import {
	createDefaultConfiguratorState,
	hasConfiguratorChanged,
	validateWatchOptions,
	extractKeys,
	createDebouncedUpdate
} from '../../../providers';

// Create default configurator state
const defaultState = createDefaultConfiguratorState<MyConfigType>();

// Manual change detection with watch options
const watchOptions = { watchKeys: ['theme'], debounceMs: 100 };
const hasChanged = hasConfiguratorChanged(current, cached, watchOptions);
\`\`\`

Click the buttons in the interactive demo below to see these features in action!
				`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DiffMapperDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  name: 'Interactive Demo',
  parameters: {
    docs: {
      description: {
        story:
          'Click the buttons to run diff examples and see results. All functionality is combined in a single interactive demo.',
      },
    },
  },
};
