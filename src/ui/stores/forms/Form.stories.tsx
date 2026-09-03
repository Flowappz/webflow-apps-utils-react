import type { Meta, StoryObj } from '@storybook/react-vite';

import { FormDemo } from './FormDemo';

const meta = {
    title: 'Utils/Form Validation System',
    component: FormDemo,
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
# Form Validation System

A comprehensive form validation system built with reactive stores (\`writable\`/\`derived\` + the \`useStore\` React hook) and Zod for type-safe form handling in Webflow apps. React components can read form state with the \`useFormValues\`, \`useFormErrors\`, \`useFormTouched\`, \`useFormIsValid\`, \`useFormIsDirty\`, and \`useFormIsSubmitting\` hooks.

## Overview

The form validation system provides:

- Type-safe form state management with Zod validation
- Unique instance name generation for Webflow components
- Real-time validation with error handling
- Form registry for managing multiple forms
- Class name sanitization for HTML compliance

## Core Classes and Functions

### FormValidator Class

The main class for creating and managing form validation state.

\`\`\`typescript
import { FormValidator } from '../../../stores/forms';

// Define your form data structure
interface MyFormData {
	name: string;
	instance: string;
	class: string;
}

// Create a form validator
const formValidator = new FormValidator<MyFormData>(
	'my-form-id',
	{
		name: 'My Component',
		instance: 'fs-component',
		class: 'fs-component'
	},
	{
		existingInstances: ['fs-existing-1', 'fs-existing-2']
	}
);
\`\`\`

#### Constructor Parameters

- \`identifier: string\` - Unique identifier for the form (used in global registry)
- \`initialValues: T\` - Initial form values
- \`options.existingInstances?: string[]\` - Array of existing instance names for uniqueness validation

**Note:** Class validation is enabled by default. Use \`enableClassValidation(false)\` to disable it if your component doesn't require CSS classes.

### Static Methods

#### generateNames()

Generates unique names, instances, and class names based on existing instances:

\`\`\`typescript
const generated = FormValidator.generateNames(
	['fs-slider-1', 'fs-slider-2'], // existing instances
	'slider', // solution name
	'Slider Component' // display name
);

// Returns:
// {
//   name: 'Slider Component 3',
//   instance: 'fs-slider-3',
//   class: 'fs-slider-3'
// }
\`\`\`

#### sanitizeClassName()

Cleans up class names to ensure HTML compliance:

\`\`\`typescript
const cleaned = FormValidator.sanitizeClassName('my/invalid class-name!');
// Returns: 'my-invalid-class-name'
\`\`\`

### Instance Methods

#### setField()

Updates a single form field:

\`\`\`typescript
formValidator.setField('name', 'New Component Name');
\`\`\`

#### setFields()

Updates multiple form fields at once:

\`\`\`typescript
formValidator.setFields({
	name: 'New Name',
	instance: 'fs-new-instance'
});
\`\`\`

#### validateWithInstances()

Updates the list of existing instances and re-validates:

\`\`\`typescript
formValidator.validateWithInstances(['fs-new-1', 'fs-new-2']);
\`\`\`

#### ignoreInstanceValidation()

Temporarily ignores a specific instance during validation (useful for edit mode):

\`\`\`typescript
formValidator.ignoreInstanceValidation('fs-current-instance', existingInstances);
\`\`\`

#### reset()

Resets the form to its initial state:

\`\`\`typescript
formValidator.reset();
\`\`\`

#### enableClassValidation()

Enables or disables class name validation dynamically:

\`\`\`typescript
// Disable class validation (useful for certain component types)
formValidator.enableClassValidation(false);

// Re-enable class validation
formValidator.enableClassValidation(true);
\`\`\`

#### getState()

Gets the current form state:

\`\`\`typescript
const state = formValidator.getState();
console.log(state.isValid, state.errors, state.values);
\`\`\`

#### setSubmitting()

Sets the form submission state:

\`\`\`typescript
formValidator.setSubmitting(true);
// ... perform submission
formValidator.setSubmitting(false);
\`\`\`

## Form State Structure

The form state contains:

\`\`\`typescript
interface FormState<T> {
	values: T; // Current form values
	errors: Record<keyof T, string[]>; // Validation errors by field
	touched: Record<keyof T, boolean>; // Fields that have been interacted with
	isValid: boolean; // Overall form validity
	isDirty: boolean; // Whether form has been modified
	isSubmitting: boolean; // Submission state
}
\`\`\`

## Global Form Registry

The system maintains a global registry of all forms for cross-component access.

### getFormById()

Retrieve a form instance by its identifier:

\`\`\`typescript
import { getFormById } from '../../../stores/forms';

const form = getFormById('my-form-id');
if (form) {
	console.log(form.getState());
}
\`\`\`

### isFormValid()

Check if a specific form is valid:

\`\`\`typescript
import { isFormValid } from '../../../stores/forms';

if (isFormValid('my-form-id')) {
	console.log('Form is valid!');
}
\`\`\`

### getFormErrors()

Get error messages for a specific form:

\`\`\`typescript
import { getFormErrors } from '../../../stores/forms';

const errors = getFormErrors('my-form-id');
console.log(errors);
\`\`\`

### resetForm()

Reset a form by its identifier:

\`\`\`typescript
import { resetForm } from '../../../stores/forms';

resetForm('my-form-id');
\`\`\`

## Validation Rules

The system includes built-in validation for Webflow component forms:

### Name Field

- Required (minimum 1 character)

### Instance Field

- Required (minimum 1 character)
- Must be unique across existing instances
- Case-insensitive uniqueness check

### Class Field

- Required by default (minimum 1 character when validation is enabled)
- Must contain only letters, numbers, underscores, and hyphens
- Automatically sanitized with \`sanitizeClassName()\`
- Can be disabled using \`enableClassValidation(false)\` for components that don't require CSS classes

## Dynamic Class Validation

The form validator supports enabling or disabling class name validation based on your component's requirements. This is useful for components that don't require CSS classes or when you want to allow more flexible class naming.

### When to Disable Class Validation

- Components that only use inline styles
- Third-party integrations that don't require CSS classes
- Temporary or test components
- Components where class names are generated programmatically

### Usage Examples

\`\`\`typescript
// Create form with class validation enabled (default)
const formValidator = new FormValidator('component-form', initialValues);

// Disable class validation for a component that doesn't need CSS
formValidator.enableClassValidation(false);

// Re-enable class validation if needed later
formValidator.enableClassValidation(true);
\`\`\`

## Best Practices

### 1. Unique Form Identifiers

Always use unique identifiers for each form to prevent conflicts:

\`\`\`typescript
const formValidator = new FormValidator(\`\${componentType}-\${componentId}-form\`, initialValues);
\`\`\`

### 2. Handle Existing Instances

Always provide existing instances for proper uniqueness validation:

\`\`\`typescript
const formValidator = new FormValidator('form-id', initialValues, {
	existingInstances: getAllExistingInstances()
});
\`\`\`

### 3. Edit Mode Handling

Use \`ignoreInstanceValidation()\` when editing existing components:

\`\`\`typescript
if (isEditMode) {
	formValidator.ignoreInstanceValidation(currentInstance, existingInstances);
}
\`\`\`

### 4. Cleanup

Always clean up form subscriptions to prevent memory leaks:

\`\`\`tsx
useEffect(() => {
	const formSubscription = createFormSubscription('my-form-id');
	const unsubscribe = formSubscription.subscribe(handleFormChange);
	return () => {
		unsubscribe();
		formSubscription.destroy();
	};
}, []);
\`\`\`

Inside React components, prefer the reactive hooks (\`useFormValues(formValidator)\`, \`useFormIsValid(formValidator)\`, …) — they subscribe and clean up automatically.

Click the interactive demo below to see the form validation system in action!
				`
            }
        }
    },
    tags: ['autodocs']
} satisfies Meta<typeof FormDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {
    name: 'Interactive Demo',
    parameters: {
        docs: {
            description: {
                story: 'Explore the form validation system with a live interactive demo showing all features including validation, name generation, and error handling.'
            }
        }
    }
};
