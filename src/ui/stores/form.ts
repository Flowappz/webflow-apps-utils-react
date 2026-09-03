import { z } from 'zod';

import { derived, get, writable, useStore, type Readable, type Writable } from './store';

export interface FormState<T> {
  values: T;
  errors: Record<keyof T, string[]>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

interface FieldRegistration<T, K extends keyof T = keyof T> {
  name: K;
  validate?: (value: T[K]) => string | null;
  transform?: (value: unknown) => T[K];
}

// Registry to track all form states by identifier
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formsRegistry = writable<Record<string, any>>({});

// Registry to track field registrations per form
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fieldRegistrations = writable<Record<string, Record<string, any>>>({});

// Validates class name according to HTML class name rules
const classNameRegex = /^[a-zA-Z0-9_-]+$/;

/**
 * Generic Form Manager for any Zod schema with cross-component field support
 */
export class FormManager<T extends Record<string, unknown>> {
  private schema: z.ZodType<T>;
  private _store: Writable<FormState<T>>;
  private initialValues: T;
  private identifier: string;
  private fieldRegistrations = new Map<keyof T, FieldRegistration<T>>();

  // Public reactive stores that components can directly use
  readonly values: Readable<T>;
  readonly errors: Readable<Record<keyof T, string[]>>;
  readonly touched: Readable<Record<keyof T, boolean>>;
  readonly isValid: Readable<boolean>;
  readonly isDirty: Readable<boolean>;
  readonly isSubmitting: Readable<boolean>;

  constructor(identifier: string, schema: z.ZodType<T>, initialValues: T) {
    this.identifier = identifier;
    this.schema = schema;
    this.initialValues = initialValues;

    // Create the internal form state store
    this._store = writable<FormState<T>>({
      values: initialValues,
      errors: {} as Record<keyof T, string[]>,
      touched: {} as Record<keyof T, boolean>,
      isValid: false,
      isDirty: false,
      isSubmitting: false,
    });

    // Create derived stores
    this.values = derived(this._store, ($store) => $store.values);
    this.errors = derived(this._store, ($store) => $store.errors);
    this.touched = derived(this._store, ($store) => $store.touched);
    this.isValid = derived(this._store, ($store) => $store.isValid);
    this.isDirty = derived(this._store, ($store) => $store.isDirty);
    this.isSubmitting = derived(this._store, ($store) => $store.isSubmitting);

    // Register this form with the global registry
    formsRegistry.update((registry) => {
      registry[identifier] = this;
      return registry;
    });

    // Initialize field registrations for this form
    fieldRegistrations.update((registrations) => {
      registrations[identifier] = {};
      return registrations;
    });

    // Initial validation
    this.validate();
  }

  /**
   * Register a field with the form for cross-component management
   */
  registerField<K extends keyof T>(
    fieldName: K,
    options?: {
      validate?: (value: T[K]) => string | null;
      transform?: (value: unknown) => T[K];
    }
  ) {
    const registration: FieldRegistration<T, K> = {
      name: fieldName,
      validate: options?.validate,
      transform: options?.transform,
    };

    this.fieldRegistrations.set(fieldName, registration as unknown as FieldRegistration<T>);

    // Update global field registrations
    fieldRegistrations.update((registrations) => {
      registrations[this.identifier][fieldName as string] = registration;
      return registrations;
    });

    return {
      // Return field-specific reactive stores
      value: derived(this.values, ($values) => $values[fieldName]),
      error: derived(this.errors, ($errors) => $errors[fieldName] || []),
      touched: derived(this.touched, ($touched) => $touched[fieldName] || false),

      // Field-specific methods
      setValue: (value: T[K]) => this.setField(fieldName, value),
      setTouched: () => this.setTouched(fieldName),
      validate: () => this.validateField(fieldName),
    };
  }

  /**
   * Set the value of a specific field
   */
  setField<K extends keyof T>(field: K, value: T[K]): void {
    this._store.update((state) => {
      const newState: FormState<T> = {
        ...state,
        values: {
          ...state.values,
          [field]: value,
        },
        touched: {
          ...state.touched,
          [field]: true,
        },
        isDirty: true,
      };
      return newState;
    });
    this.validate();
  }

  /**
   * Set multiple field values at once
   */
  setFields(values: Partial<T>): void {
    this._store.update((state) => {
      const newTouched = { ...state.touched };
      // Mark all updated fields as touched
      Object.keys(values).forEach((key) => {
        newTouched[key as keyof T] = true;
      });

      return {
        ...state,
        values: {
          ...state.values,
          ...values,
        },
        touched: newTouched,
        isDirty: true,
      };
    });
    this.validate();
  }

  /**
   * Set a field as touched without changing its value
   */
  setTouched<K extends keyof T>(field: K): void {
    this._store.update((state) => ({
      ...state,
      touched: {
        ...state.touched,
        [field]: true,
      },
    }));
  }

  /**
   * Validate a specific field
   */
  validateField<K extends keyof T>(field: K): string[] {
    const currentState = get(this._store);
    const fieldValue = currentState.values[field];
    const errors: string[] = [];

    // Check custom field validation
    const registration = this.fieldRegistrations.get(field);
    if (registration?.validate) {
      const customError = registration.validate(fieldValue);
      if (customError) {
        errors.push(customError);
      }
    }

    // Run Zod validation on the entire form to get field-specific errors
    const result = this.schema.safeParse(currentState.values);
    if (!result.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const zodErrors = result.error.format() as any;
      const fieldErrors = zodErrors[field]?._errors || [];
      errors.push(...fieldErrors);
    }

    return errors;
  }

  /**
   * Reset the form to initial values
   */
  reset(): void {
    this._store.set({
      values: { ...this.initialValues },
      errors: {} as Record<keyof T, string[]>,
      touched: {} as Record<keyof T, boolean>,
      isValid: false,
      isDirty: false,
      isSubmitting: false,
    });
    this.validate();
  }

  /**
   * Set the form as submitting
   */
  setSubmitting(isSubmitting: boolean): void {
    this._store.update((state) => ({
      ...state,
      isSubmitting,
    }));
  }

  /**
   * Update the schema (useful for dynamic forms)
   */
  updateSchema(newSchema: z.ZodType<T>): void {
    this.schema = newSchema;
    this.validate();
  }

  /**
   * Validate the entire form
   */
  private validate(): void {
    this._store.update((state) => {
      const result = this.schema.safeParse(state.values);
      const errors = {} as Record<keyof T, string[]>;
      let isValid = true;

      if (!result.success) {
        isValid = false;

        // Convert Zod errors to our error format
        Object.keys(state.values).forEach((key) => {
          const fieldKey = key as keyof T;
          const fieldErrors =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((result.error.format() as any)[fieldKey]?._errors as string[] | undefined) || [];

          // Add custom field validation errors
          const registration = this.fieldRegistrations.get(key as keyof T);
          if (registration?.validate) {
            const customError = registration.validate(state.values[fieldKey]);
            if (customError) {
              fieldErrors.push(customError);
            }
          }

          if (fieldErrors.length > 0) {
            errors[fieldKey] = fieldErrors;
          }
        });
      }

      return {
        ...state,
        errors,
        isValid,
      };
    });
  }

  /**
   * Get the current state of the form
   */
  getState(): FormState<T> {
    return get(this._store);
  }

  /**
   * Destroy the form and clean up resources
   */
  destroy(): void {
    // Remove from registries
    formsRegistry.update((registry) => {
      delete registry[this.identifier];
      return registry;
    });

    fieldRegistrations.update((registrations) => {
      delete registrations[this.identifier];
      return registrations;
    });

    // Clear field registrations
    this.fieldRegistrations.clear();
  }
}

/**
 * Creates a generic form with Zod validation
 */
export function createGenericForm<T extends Record<string, unknown>>(
  identifier: string,
  schema: z.ZodType<T>,
  initialValues: T
) {
  const form = new FormManager<T>(identifier, schema, initialValues);

  return {
    // Reactive stores that components can directly subscribe to
    values: form.values,
    errors: form.errors,
    touched: form.touched,
    isValid: form.isValid,
    isDirty: form.isDirty,
    isSubmitting: form.isSubmitting,

    // Helper methods
    setField: form.setField.bind(form),
    setFields: form.setFields.bind(form),
    setTouched: form.setTouched.bind(form),
    reset: form.reset.bind(form),
    setSubmitting: form.setSubmitting.bind(form),
    updateSchema: form.updateSchema.bind(form),
    registerField: form.registerField.bind(form),
    validateField: form.validateField.bind(form),

    // For advanced use cases
    getState: form.getState.bind(form),
    destroy: form.destroy.bind(form),
  };
}

/**
 * Creates a form validation utility with reactive stores
 * @param identifier - Unique identifier for the form
 * @param options - Configuration options
 */
export class FormValidator<T extends { name: string; instance: string; class: string }> {
  private schema: z.ZodType<{ name: string; instance: string; class: string }>;
  private _store: Writable<FormState<T>>;
  private instancesSet = new Set<string>();
  private initialValues: T;
  private identifier: string;
  private currentInstanceToIgnore: string | null = null;
  private classValidationEnabled = true;

  // Public reactive stores that components can directly use
  readonly values: Readable<T>;
  readonly errors: Readable<Record<keyof T, string[]>>;
  readonly touched: Readable<Record<keyof T, boolean>>;
  readonly isValid: Readable<boolean>;
  readonly isDirty: Readable<boolean>;
  readonly isSubmitting: Readable<boolean>;

  /**
   * Generates unique name, instance, and class based on solution name and existing instances
   * @param existingInstances - Array of existing instance names
   * @param solution - The base solution name
   * @returns Object containing name, instance, and class values
   */
  static generateNames(
    existingInstances: string[],
    solution: string,
    name: string
  ): { name: string; instance: string; class: string } {
    const instanceSet = new Set(existingInstances.map((inst) => inst.toLowerCase()));

    // First try without suffix
    let instance = `fs-${solution}`.toLowerCase();
    let finalName = name;

    // If the base instance is available, use it
    if (!instanceSet.has(instance)) {
      const className = instance.replace(/[^a-zA-Z0-9_-]/g, '-');
      return {
        name: finalName,
        instance,
        class: className,
      };
    }

    // If base is taken, find the next available suffix number starting from 1
    let suffixNumber = 1;
    do {
      instance = `fs-${solution}-${suffixNumber}`.toLowerCase();
      finalName = `${name} ${suffixNumber}`;
      suffixNumber++;
    } while (instanceSet.has(instance));

    // Create class name (ensure it's valid)
    const className = instance.replace(/[^a-zA-Z0-9_-]/g, '-');

    return {
      name: finalName,
      instance,
      class: className,
    };
  }

  /**
   * Cleans up the class name to ensure it's valid
   * @param className - The class name to clean up
   * @returns The cleaned up class name
   */
  static sanitizeClassName(className: string): string {
    if (!className) return '';

    // Remove leading/trailing spaces and slashes
    let sanitized = className.trim().replace(/^\/+|\/+$/g, '');

    // Replace invalid characters with hyphens (keep only letters, numbers, underscores, hyphens)
    sanitized = sanitized.replace(/[^a-zA-Z0-9_-]/g, '-');

    // Remove leading/trailing hyphens and underscores
    sanitized = sanitized.replace(/^[-_]+|[-_]+$/g, '');

    // Collapse multiple consecutive hyphens into single hyphens
    sanitized = sanitized.replace(/-+/g, '-');

    return sanitized;
  }

  constructor(identifier: string, initialValues: T, options?: { existingInstances?: string[] }) {
    this.identifier = identifier;
    this.initialValues = initialValues;

    // Initialize base schema
    this.schema = z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      instance: z.string().min(1, { message: 'Instance is required' }),
      class: z.string().min(1, { message: 'Class is required' }).regex(classNameRegex, {
        message: 'Class must contain only letters, numbers, underscores, and hyphens',
      }),
    });

    // Add existing instances to the set for uniqueness validation
    if (options?.existingInstances) {
      options.existingInstances.forEach((instance) => this.instancesSet.add(instance.toLowerCase()));
    }

    // Create the internal form state store
    this._store = writable<FormState<T>>({
      values: initialValues,
      errors: {} as Record<keyof T, string[]>,
      touched: {} as Record<keyof T, boolean>,
      isValid: false,
      isDirty: false,
      isSubmitting: false,
    });

    // Create a derived store that's the primary interface to the form
    this.values = derived(this._store, ($store) => $store.values);
    this.errors = derived(this._store, ($store) => $store.errors);
    this.touched = derived(this._store, ($store) => $store.touched);
    this.isValid = derived(this._store, ($store) => $store.isValid);
    this.isDirty = derived(this._store, ($store) => $store.isDirty);
    this.isSubmitting = derived(this._store, ($store) => $store.isSubmitting);

    // Register this form with the global registry
    formsRegistry.update((registry) => {
      registry[identifier] = this;
      return registry;
    });

    // Initial validation
    this.validate();
  }

  /**
   * Set a specific instance to ignore during validation
   * Used in edit mode to prevent the current instance from being flagged as invalid
   */
  ignoreInstanceValidation(instanceValue: string, existingInstances: string[]): void {
    // update instanceset from existingInstances
    this.instancesSet = new Set(existingInstances.map((inst) => inst.toLowerCase()?.trim()));
    this.currentInstanceToIgnore = instanceValue?.toLowerCase() || null;

    // Re-validate with the new ignored instance
    this.validate();
  }

  /**
   * Set the value of a specific field
   */
  setField<K extends keyof T>(field: K, value: T[K]): void {
    this._store.update((state) => {
      const newState: FormState<T> = {
        ...state,
        values: {
          ...state.values,
          [field]: value,
        },
        touched: {
          ...state.touched,
          [field]: true,
        },
        isDirty: true,
      };
      return newState;
    });
    this.validate();
  }

  /**
   * Set multiple field values at once
   */
  setFields(values: Partial<T>): void {
    this._store.update((state) => {
      const newTouched = { ...state.touched };
      // Mark all updated fields as touched
      Object.keys(values).forEach((key) => {
        newTouched[key as keyof T] = true;
      });

      return {
        ...state,
        values: {
          ...state.values,
          ...values,
        },
        touched: newTouched,
        isDirty: true,
      };
    });
    this.validate();
  }

  /**
   * Handle instance field validation with uniqueness check
   */
  validateWithInstances(existingInstances: string[]): void {
    // Update the instance set
    this.instancesSet = new Set(existingInstances.map((inst) => inst.toLowerCase()));
    this.validate();
  }

  /**
   * Reset the form to initial values
   */
  reset(): void {
    this._store.set({
      values: { ...this.initialValues },
      errors: {} as Record<keyof T, string[]>,
      touched: {} as Record<keyof T, boolean>,
      isValid: false,
      isDirty: false,
      isSubmitting: false,
    });
    this.validate();
  }

  /**
   * Enable or disable class name validation
   * @param enabled - Whether to enable class validation
   */
  enableClassValidation(enabled: boolean): void {
    this.classValidationEnabled = enabled;
    this.validate();
  }

  /**
   * Validate the form values
   */
  private validate(): void {
    this._store.update((state) => {
      // Create a custom schema for validation that includes instance uniqueness and conditional class validation
      const nameSchema = z.string().min(1, { message: 'Name is required' });

      const instanceSchema = z
        .string()
        .min(1, { message: 'Instance is required' })
        .refine(
          (value) => {
            // Skip if empty (handled by min(1) above)
            if (!value) return true;

            // If we're in edit mode and this is the current instance, skip duplicate validation
            if (
              this.currentInstanceToIgnore &&
              value.toLowerCase() === this.currentInstanceToIgnore
            ) {
              return true;
            }

            // Check for uniqueness against the set of existing instances
            return !this.instancesSet.has(value.toLowerCase());
          },
          { message: 'Instance name must be unique' }
        );

      // Conditionally create class validation
      const classSchema = this.classValidationEnabled
        ? z.string().min(1, { message: 'Class is required' }).regex(classNameRegex, {
            message: 'Class must contain only letters, numbers, underscores, and hyphens',
          })
        : z.string();

      const currentSchema = z.object({
        name: nameSchema,
        instance: instanceSchema,
        class: classSchema,
      });

      // Validate the current values against the schema
      const result = currentSchema.safeParse(state.values);
      const errors = {} as Record<keyof T, string[]>;
      let isValid = true;

      if (!result.success) {
        isValid = false;

        // Convert Zod errors to our error format
        Object.keys(state.values).forEach((key) => {
          const fieldKey = key as keyof T;
          const fieldErrors =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((result.error.format() as any)[fieldKey]?._errors as string[] | undefined) || [];
          errors[fieldKey] = fieldErrors;
        });
      }

      return {
        ...state,
        errors,
        isValid,
      };
    });
  }

  /**
   * Set the form as submitting
   */
  setSubmitting(isSubmitting: boolean): void {
    this._store.update((state) => ({
      ...state,
      isSubmitting,
    }));
  }

  /**
   * Get the current state of the form
   */
  getState(): FormState<T> {
    return get(this._store);
  }
}

/**
 * Setup form hook
 */
export function createForm<T extends { name: string; instance: string; class: string }>(
  identifier: string,
  initialValues: T,
  options?: { existingInstances?: string[]; enableClassValidation?: boolean }
) {
  const form = new FormValidator<T>(identifier, initialValues, options);

  if (options?.enableClassValidation !== undefined) {
    form.enableClassValidation(options.enableClassValidation);
  }

  return {
    // Reactive stores that components can directly subscribe to
    values: form.values,
    errors: form.errors,
    touched: form.touched,
    isValid: form.isValid,
    isDirty: form.isDirty,
    isSubmitting: form.isSubmitting,

    // Helper methods
    setField: form.setField.bind(form),
    setFields: form.setFields.bind(form),
    reset: form.reset.bind(form),
    enableClassValidation: form.enableClassValidation.bind(form),
    ignoreInstanceValidation: form.ignoreInstanceValidation.bind(form),
    setSubmitting: form.setSubmitting.bind(form),

    // For advanced use cases
    validate: () => form.validateWithInstances(options?.existingInstances || []),
    getState: form.getState.bind(form),
  };
}

/**
 * Get a form by its identifier
 */
export function getFormById(
  identifier: string
):
  | FormValidator<{ name: string; instance: string; class: string }>
  | FormManager<Record<string, unknown>>
  | undefined {
  const registry = get(formsRegistry);
  return registry[identifier];
}

/**
 * Check if a form with a specific identifier is valid
 */
export function isFormValid(identifier: string): boolean {
  const form = getFormById(identifier);
  if (!form) return false;

  return form.getState().isValid;
}

/**
 * Get error messages for a specific form
 */
export function getFormErrors(identifier: string): Record<string, string[]> | null {
  const form = getFormById(identifier);
  if (!form) return null;

  return form.getState().errors;
}

/**
 * Reset a form by its identifier
 */
export function resetForm(identifier: string): boolean {
  const form = getFormById(identifier);
  if (!form) return false;

  form.reset();
  return true;
}

// Add a store for each form that other components can subscribe to
export function createFormSubscription(identifier: string) {
  const form = getFormById(identifier);
  if (!form) {
    return writable({ isValid: false, errors: {}, values: {} });
  }

  // Create a store that reflects the current form state
  const formStore = writable(form.getState());

  // Set up interval to update the store
  const intervalId = setInterval(() => {
    const currentState = form.getState();
    formStore.set(currentState);
  }, 100);

  // Return store with cleanup function
  return {
    subscribe: formStore.subscribe,
    destroy: () => clearInterval(intervalId),
  };
}

/**
 * Helper to get field state for a specific form and field
 */
export function getFieldState<T extends Record<string, unknown>>(formId: string, fieldName: keyof T) {
  const form = getFormById(formId);
  if (!form) {
    return {
      value: undefined,
      error: [] as string[],
      touched: false,
      isValid: true,
    };
  }

  const state = form.getState() as FormState<T>;
  return {
    value: state.values[fieldName],
    error: state.errors[fieldName] || [],
    touched: state.touched[fieldName] || false,
    isValid: !state.errors[fieldName] || state.errors[fieldName].length === 0,
  };
}

/**
 * Helper to update a field value for a specific form
 */
export function updateFieldValue<T extends Record<string, unknown>>(
  formId: string,
  fieldName: keyof T,
  value: T[typeof fieldName]
): void {
  const form = getFormById(formId);
  if (form && 'setField' in form) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (form as any).setField(fieldName, value);
  }
}

/**
 * Helper to get all registered field names for a form
 */
export function getFormFieldNames(formId: string): string[] {
  const registrations = get(fieldRegistrations);
  return Object.keys(registrations[formId] || {});
}

/**
 * Store to track if the form is adding or updating to the Canvas
 */
export const isAddingOrUpdating = writable(false);

export const loadingSelectedElement = writable(false);

/* ------------------------------------------------------------------ */
/* React hooks — thin wrappers over the form stores via `useStore`.    */
/* ------------------------------------------------------------------ */

/** The reactive stores shared by `FormManager`, `FormValidator`, `createForm` and `createGenericForm` results. */
export interface FormStores<T> {
  values: Readable<T>;
  errors: Readable<Record<keyof T, string[]>>;
  touched: Readable<Record<keyof T, boolean>>;
  isValid: Readable<boolean>;
  isDirty: Readable<boolean>;
  isSubmitting: Readable<boolean>;
}

/** React hook: reactive form values. */
export function useFormValues<T>(manager: FormStores<T>): T {
  return useStore(manager.values);
}

/** React hook: reactive form errors. */
export function useFormErrors<T>(manager: FormStores<T>): Record<keyof T, string[]> {
  return useStore(manager.errors);
}

/** React hook: reactive touched map. */
export function useFormTouched<T>(manager: FormStores<T>): Record<keyof T, boolean> {
  return useStore(manager.touched);
}

/** React hook: reactive validity flag. */
export function useFormIsValid<T>(manager: FormStores<T>): boolean {
  return useStore(manager.isValid);
}

/** React hook: reactive dirty flag. */
export function useFormIsDirty<T>(manager: FormStores<T>): boolean {
  return useStore(manager.isDirty);
}

/** React hook: reactive submitting flag. */
export function useFormIsSubmitting<T>(manager: FormStores<T>): boolean {
  return useStore(manager.isSubmitting);
}
