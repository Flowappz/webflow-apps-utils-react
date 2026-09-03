import type { Meta, StoryObj } from '@storybook/react-vite';

import { GlobalProviderDemo } from './GlobalProviderDemo';

const meta = {
    title: 'Utils/GlobalProvider',
    component: GlobalProviderDemo,
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [
                { name: 'dark', value: '#292929' },
                { name: 'light', value: '#ffffff' }
            ]
        },
        docs: {
            description: {
                component: `
# GlobalProvider

The \`GlobalProvider\` is a comprehensive context management system for React that manages multiple application contexts in a type-safe and reactive way. It includes advanced configurator state management with intelligent change detection using the DiffMapper utilities.

## Features

- **Multiple Contexts**: Manage different types of state (form, app, data, etc.) in separate contexts
- **Type Safety**: Full TypeScript support with branded types and generics
- **Reactive**: Context hooks subscribe to a snapshot store (\`useSyncExternalStore\`), so components re-render on every context change
- **Event System**: Subscribe to context changes and global events (batched for performance)
- **Intelligent Change Detection**: Uses DiffMapper for smart configurator state comparison
- **Performance Optimized**: Includes caching, debouncing, and memory management
- **Advanced Configurator Support**: Built-in configurator state with watch options and change tracking

## Basic Usage

### Wrap Your App

\`\`\`tsx
import { GlobalProvider } from '../../providers';

const initialContexts = {
	app: {
		editMode: false,
		repairMode: false,
		title: 'My App'
	},
	form: {
		formKey: null,
		formUpdateKey: null
	}
};

export function Root() {
	return (
		<GlobalProvider initialContexts={initialContexts} debug={true}>
			<App />
		</GlobalProvider>
	);
}
\`\`\`

### Default Contexts

The \`GlobalProvider\` automatically creates these default contexts:

- **\`app\`**: Application state (editMode, repairMode, title, configurator)
- **\`form\`**: Form state (formKey, formUpdateKey)
- **\`data\`**: General data state

### Use Contexts in Components

\`\`\`tsx
import { useAppContext, useFormContext, useDataContext } from '../../providers';

function MyComponent() {
	const appContext = useAppContext();
	const formContext = useFormContext();
	const dataContext = useDataContext();

	// The hooks subscribe to context changes, so these stay up to date
	const appData = appContext.get();
	const formData = formContext.get();

	function toggleEditMode() {
		appContext.update((current) => ({
			...current,
			editMode: !current?.editMode
		}));
	}

	return (
		<div>
			<p>Edit Mode: {String(appData?.editMode)}</p>
			<p>Form Key: {formData?.formKey}</p>
			<button onClick={toggleEditMode}>Toggle Edit Mode</button>
		</div>
	);
}
\`\`\`

## API Reference

### Context Operations

#### \`get(): T | null\`
Returns the current context data. Returns \`undefined\` if the context has been reset (completely removed).

#### \`set(data: Partial<T>): void\`
Sets context data (merges with existing data).

#### \`update(updater: (current: T | null) => T): void\`
Updates context data using an updater function.

#### \`clear(): void\`
Clears context data (sets to null). The context remains active but with null data.

#### \`reset(): void\`
Completely removes the context. After reset, \`hasContext()\` returns false and \`get()\` returns \`undefined\`.

#### \`subscribe(callback: (data: T | null) => void): () => void\`
Subscribes to context changes. Returns unsubscribe function. **Note**: Events are batched and emitted asynchronously for performance.

### Global Operations

- \`getContext<T>(key: string): ContextOperations<T>\` - Get context operations for a key
- \`hasContext(key: string): boolean\` - Check if context exists
- \`removeContext(key: string): void\` - Remove a specific context
- \`clearAll(): void\` - Clear all context data (set to null)
- \`resetAll(): void\` - Reset all contexts (completely remove them)
- \`resetByKey(key: string): void\` - Reset a specific context by key
- \`getActiveContexts(): string[]\` - Get list of active context keys
- \`getAllContexts(): Record<string, unknown>\` - Get all context data
- \`getContextMetadata(key: string)\` - Get metadata (version, updatedAt, isActive) for a context
- \`subscribe(callback): () => void\` - Subscribe to global context events

## Advanced Configurator Support

The \`GlobalProvider\` includes sophisticated configurator state management with intelligent change detection powered by the DiffMapper utilities. The configurator system automatically detects changes using smart type coercion, whitespace handling, and performance optimization.

### Core Configurator Features

- **Automatic Change Detection**: Uses \`hasChangesViaDiff\` internally for intelligent comparison
- **Type Coercion**: Handles string/number/boolean conversions automatically
- **Watch Options**: Configure which keys to monitor for changes
- **Debounced Updates**: Performance-optimized change detection with configurable debouncing
- **Caching**: Automatic caching for expensive diff operations

### Using the Configurator Context

\`\`\`tsx
import { useEffect } from 'react';
import { useConfiguratorContext, useAppContext } from '../../providers';

// Define your configurator type
type MyConfiguratorType = {
	theme: 'light' | 'dark';
	layout: 'grid' | 'list';
	itemsPerPage: number;
};

function ConfiguratorPanel() {
	// Use typed configurator context
	const configurator = useConfiguratorContext<MyConfiguratorType>();

	// Or use typed app context
	const appContext = useAppContext<MyConfiguratorType>();

	// Set configurator data with watch options (fully typed)
	useEffect(() => {
		configurator.setConfigurator(
			{ theme: 'dark', layout: 'grid', itemsPerPage: 10 },
			{ watchKeys: ['theme'], debounceMs: 100 }
		);
	}, []);

	// Reactive reads — the hook re-renders on context changes
	const hasChanged = configurator.hasChanged;
	const currentConfig = configurator.configurator; // Type: MyConfiguratorType | null
	const cachedConfig = configurator.configuratorCache; // Type: MyConfiguratorType | null

	return (
		<div>
			<p>Has Changed: {String(hasChanged)}</p>
			<p>Current Theme: {currentConfig?.theme}</p>
			<p>Cached Theme: {cachedConfig?.theme}</p>
			<button onClick={() => configurator.saveToCache()}>Save to Cache</button>
		</div>
	);
}
\`\`\`

### Configurator API

- \`configurator\` - Current configurator data
- \`configuratorCache\` - Cached configurator data
- \`hasChanged\` - Boolean indicating if configurator differs from cache
- \`watchOptions\` - Current watch configuration
- \`setConfigurator(data, watchOptions?)\` - Set configurator data
- \`setConfiguratorCache(data)\` - Set cache data
- \`saveToCache()\` - Save current configurator to cache
- \`updateWatchOptions(options)\` - Update watch configuration

### Watch Options

\`\`\`typescript
interface ConfiguratorWatchOptions {
	watchAll?: boolean; // Watch all keys (default: true)
	watchKeys?: string[]; // Specific keys to watch
	debounceMs?: number; // Debounce delay (default: 50ms, min: 16ms)
}
\`\`\`

### Change Detection Examples

The configurator uses intelligent change detection that handles various edge cases:

\`\`\`typescript
// Type coercion examples - these are considered UNCHANGED
const config1 = { count: '5', active: 'true', value: '' };
const config2 = { count: 5, active: true, value: 0 };

configurator.setConfigurator(config1);
configurator.setConfiguratorCache(config2);
console.log(configurator.hasChanged); // false - intelligent type coercion

// Whitespace handling - these are considered UNCHANGED
const config3 = { name: 'John' };
const config4 = { name: '  John  ' };

// Nested object changes - detected intelligently
const config5 = { user: { name: 'John', age: 30 }, settings: { theme: 'dark' } };
const config6 = { user: { name: 'John', age: 31 }, settings: { theme: 'dark' } };
// Only user.age is different, hasChanged will be true
\`\`\`

## TypeScript Support

### Generic Context Usage

\`\`\`typescript
import type { ContextOperations, AppContextData, DataContextData } from '../../providers';

// For custom contexts
const userContext: ContextOperations<UserType> = useContext<UserType>('user');

// For typed app context with configurator
type MyConfiguratorType = {
	theme: 'light' | 'dark';
	layout: 'grid' | 'list';
};

const appContext = useAppContext<MyConfiguratorType>();
const configurator = useConfiguratorContext<MyConfiguratorType>();

// For typed data context
type MyDataType = {
	users: User[];
	products: Product[];
	currentPage: number;
};

const dataContext = useDataContext<MyDataType>();

// The configurator and configuratorCache will both be typed as MyConfiguratorType | null
// The data context state will be typed as MyDataType | null
\`\`\`

## Utility Helper Functions

The GlobalProvider system includes several powerful utility functions for advanced use cases and manual comparisons.

### DiffMapper Utilities

For detailed object comparison and change analysis:

\`\`\`typescript
import { hasChangesViaDiff, getDetailedDiff, compareKeys } from '../../providers';

// Quick change detection
const hasChanges = hasChangesViaDiff(oldConfig, newConfig);

// Detailed diff analysis
const diff = getDetailedDiff(oldConfig, newConfig);
console.log(diff);
// Returns detailed DiffMap showing exactly what changed

// Compare specific keys only
const hasKeyChanges = !compareKeys(oldConfig, newConfig, ['theme', 'layout']);
\`\`\`

### Configurator Utilities

For manual configurator state management:

\`\`\`typescript
import {
	createDefaultConfiguratorState,
	hasConfiguratorChanged,
	validateWatchOptions,
	extractKeys,
	createDebouncedUpdate
} from '../../providers';

// Create default configurator state
const defaultState = createDefaultConfiguratorState<MyConfigType>();

// Manual change detection with watch options
const watchOptions = { watchKeys: ['theme'], debounceMs: 100 };
const hasChanged = hasConfiguratorChanged(current, cached, watchOptions);

// Validate and normalize watch options
const validatedOptions = validateWatchOptions(userOptions);

// Extract specific keys from configuration
const extractedConfig = extractKeys(fullConfig, ['theme', 'layout']);

// Create debounced update function
const debouncedSave = createDebouncedUpdate(saveConfig, 300);
\`\`\`

### Performance Optimization Helpers

\`\`\`typescript
import { createDebouncedUpdate } from '../../providers';

// Create debounced functions for expensive operations
const debouncedValidation = createDebouncedUpdate((config) => {
	// Expensive validation logic
	validateConfiguration(config);
}, 500); // 500ms debounce

// Use in components
function handleConfigChange(newConfig) {
	setConfig(newConfig);
	debouncedValidation(newConfig);
}
\`\`\`

### Memory Management

The GlobalProvider includes automatic memory management for performance:

\`\`\`typescript
// Automatic cache cleanup in diff operations
// Cache entries older than 1 second are automatically removed
// Cache size is limited to 100 entries

// Event listener cleanup — always clean up subscriptions
useEffect(() => {
	const unsubscribe = globalContext.subscribe((event) => {
		console.log('Context changed:', event);
	});
	return unsubscribe;
}, [globalContext]);
\`\`\`

### Debugging and Development

For development and debugging:

\`\`\`typescript
// Enable debug mode in GlobalProvider
<GlobalProvider debug={true} initialContexts={...}>

// Get context metadata
const metadata = globalContext.getContextMetadata('app');
console.log(metadata);
// { updatedAt: 1234567890, version: 5, isActive: true }

// Get all active contexts
const activeContexts = globalContext.getActiveContexts();
console.log(activeContexts); // ['app', 'form', 'data', 'userPreferences']

// Get complete state snapshot
const allData = globalContext.getAllContexts();
console.log(allData); // Complete state object
\`\`\`

### Error Handling Best Practices

\`\`\`typescript
try {
	const context = getGlobalContext();
	const appData = context.getContext('app').get();
	// Handle operations...
} catch (error) {
	if (error.message.includes('Global context not found')) {
		console.error('GlobalProvider not found. Make sure to wrap your app properly.');
	}
}

// Safe context access with fallbacks
const safeGetContext = <T>(key: string): T | null => {
	try {
		const context = getGlobalContext();
		return context.getContext<T>(key).get();
	} catch {
		return null;
	}
};
\`\`\`

## Related Documentation

- **Performance Considerations**: All diff operations include automatic caching and optimization
- **Type Safety**: Full TypeScript support with branded types and generics

Click the buttons in the interactive demo below to see these features in action!
				`
            }
        }
    },
    tags: ['autodocs']
} satisfies Meta<typeof GlobalProviderDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {
    name: 'Interactive Demo',
    parameters: {
        docs: {
            description: {
                story: 'Interactive demo showing GlobalProvider features including context management, configurator state, and change detection.'
            }
        }
    }
};
