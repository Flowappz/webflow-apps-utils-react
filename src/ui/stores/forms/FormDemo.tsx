import { useState } from 'react';

import {
  FormValidator,
  useFormErrors,
  useFormIsDirty,
  useFormIsSubmitting,
  useFormIsValid,
  useFormTouched,
  useFormValues,
} from '../form';
import './FormDemo.css';

interface DemoFormData {
  name: string;
  instance: string;
  class: string;
  [key: string]: unknown;
}

export function FormDemo() {
  // Demo state
  const [existingInstances, setExistingInstances] = useState<string[]>([
    'fs-slider-1',
    'fs-slider-2',
    'fs-tabs-1',
  ]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentInstance] = useState('fs-slider-1');
  const [classValidationEnabled, setClassValidationEnabled] = useState(true);

  // Create form validator (once)
  const [formValidator] = useState(
    () =>
      new FormValidator<DemoFormData>(
        'demo-form',
        {
          name: 'New Component',
          instance: 'fs-component',
          class: 'fs-component',
        },
        { existingInstances: ['fs-slider-1', 'fs-slider-2', 'fs-tabs-1'] }
      )
  );

  // Subscribe to form state using the reactive store hooks
  const formValues = useFormValues(formValidator);
  const formErrors = useFormErrors(formValidator);
  const formTouched = useFormTouched(formValidator);
  const formIsValid = useFormIsValid(formValidator);
  const formIsDirty = useFormIsDirty(formValidator);
  const formIsSubmitting = useFormIsSubmitting(formValidator);

  function generateNewNames() {
    const generated = FormValidator.generateNames(existingInstances, 'demo', 'Demo Component');
    formValidator.setFields(generated);
  }

  function toggleEditMode() {
    const nextEditMode = !isEditMode;
    setIsEditMode(nextEditMode);
    if (nextEditMode) {
      formValidator.ignoreInstanceValidation(currentInstance, existingInstances);
      formValidator.setFields({
        name: currentInstance,
        instance: currentInstance,
        class: currentInstance,
      });
    } else {
      formValidator.validateWithInstances(existingInstances);
    }
  }

  function toggleClassValidation() {
    const next = !classValidationEnabled;
    setClassValidationEnabled(next);
    formValidator.enableClassValidation(next);
  }

  function addExistingInstance() {
    const newInstance = `fs-new-${Date.now()}`;
    const next = [...existingInstances, newInstance];
    setExistingInstances(next);
    formValidator.validateWithInstances(next);
  }

  function resetForm() {
    formValidator.reset();
    setIsEditMode(false);
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formIsValid) return;

    formValidator.setSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      formValidator.setSubmitting(false);
      console.log('Form submitted:', formValidator.getState().values);
    }, 1000);
  }

  function handleClassInput(e: React.ChangeEvent<HTMLInputElement>) {
    const sanitized = FormValidator.sanitizeClassName(e.target.value);
    formValidator.setField('class', sanitized);
  }

  return (
    <div className="form-demo-container">
      <h3>Form Validation System Demo</h3>

      <div className="demo-controls">
        <div className="control-section">
          <h4>Demo Controls</h4>
          <div className="button-group">
            <button onClick={generateNewNames} className="btn btn--secondary">
              Generate Names
            </button>
            <button onClick={toggleEditMode} className="btn btn--secondary">
              {isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
            </button>
            <button onClick={toggleClassValidation} className="btn btn--secondary">
              {classValidationEnabled ? 'Disable' : 'Enable'} Class Validation
            </button>
            <button onClick={addExistingInstance} className="btn btn--secondary">
              Add Existing Instance
            </button>
            <button onClick={resetForm} className="btn btn--secondary">
              Reset Form
            </button>
          </div>
        </div>

        <div className="status-section">
          <h4>Form Status</h4>
          <div className="status-grid">
            <div className="status-item">
              <span>Valid:</span>
              <strong className={`status-${formIsValid}`}>{formIsValid ? 'YES' : 'NO'}</strong>
            </div>
            <div className="status-item">
              <span>Dirty:</span>
              <strong className={`status-${formIsDirty}`}>{formIsDirty ? 'YES' : 'NO'}</strong>
            </div>
            <div className="status-item">
              <span>Submitting:</span>
              <strong className={`status-${formIsSubmitting}`}>
                {formIsSubmitting ? 'YES' : 'NO'}
              </strong>
            </div>
            <div className="status-item">
              <span>Edit Mode:</span>
              <strong className={`status-${isEditMode}`}>{isEditMode ? 'ON' : 'OFF'}</strong>
            </div>
            <div className="status-item">
              <span>Class Validation:</span>
              <strong className={`status-${classValidationEnabled}`}>
                {classValidationEnabled ? 'ON' : 'OFF'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <form className="demo-form" onSubmit={submitForm}>
        <div className="form-section">
          <h4>Component Form</h4>

          <div className="field">
            <label htmlFor="name">Component Name</label>
            <input
              id="name"
              type="text"
              value={formValues.name}
              onChange={(e) => {
                formValidator.setField('name', e.target.value);
              }}
              className={(formErrors.name?.length || 0) > 0 ? 'error' : undefined}
              placeholder="Enter component name"
            />
            {(formErrors.name?.length ?? 0) > 0 && <span className="error">{formErrors.name[0]}</span>}
          </div>

          <div className="field">
            <label htmlFor="instance">Instance Name</label>
            <input
              id="instance"
              type="text"
              value={formValues.instance}
              onChange={(e) => {
                formValidator.setField('instance', e.target.value);
              }}
              className={(formErrors.instance?.length || 0) > 0 ? 'error' : undefined}
              placeholder="Enter instance name (must be unique)"
            />
            {(formErrors.instance?.length ?? 0) > 0 && (
              <span className="error">{formErrors.instance[0]}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="class">CSS Class Name</label>
            <input
              id="class"
              type="text"
              value={formValues.class}
              onChange={handleClassInput}
              className={(formErrors.class?.length || 0) > 0 ? 'error' : undefined}
              placeholder="Enter CSS class name"
              disabled={!classValidationEnabled}
            />
            {(formErrors.class?.length ?? 0) > 0 && (
              <span className="error">{formErrors.class[0]}</span>
            )}
            {!classValidationEnabled && <span className="helper">Class validation is disabled</span>}
          </div>

          <button type="submit" disabled={!formIsValid || formIsSubmitting} className="btn btn--primary">
            {formIsSubmitting ? 'Submitting...' : isEditMode ? 'Update Component' : 'Create Component'}
          </button>
        </div>
      </form>

      <div className="debug-section">
        <h4>Debug Information</h4>

        <div className="debug-grid">
          <div className="debug-item">
            <h5>Existing Instances</h5>
            <code>{JSON.stringify(existingInstances, null, 2)}</code>
          </div>

          <div className="debug-item">
            <h5>Form Values</h5>
            <code>{JSON.stringify(formValues, null, 2)}</code>
          </div>

          <div className="debug-item">
            <h5>Form Errors</h5>
            <code>{JSON.stringify(formErrors, null, 2)}</code>
          </div>

          <div className="debug-item">
            <h5>Touched Fields</h5>
            <code>{JSON.stringify(formTouched, null, 2)}</code>
          </div>
        </div>
      </div>

      <div className="examples-section">
        <h4>Static Method Examples</h4>

        <div className="example">
          <h5>FormValidator.generateNames()</h5>
          <button
            onClick={() => {
              const result = FormValidator.generateNames(existingInstances, 'test', 'Test Component');
              console.log('Generated names:', result);
            }}
            className="btn btn--secondary"
          >
            Generate Test Names (check console)
          </button>
        </div>

        <div className="example">
          <h5>FormValidator.sanitizeClassName()</h5>
          <div className="sanitize-demo">
            <input
              type="text"
              placeholder="Enter invalid class name"
              onChange={(e) => {
                const sanitized = FormValidator.sanitizeClassName(e.target.value);
                const output = e.target.nextElementSibling as HTMLElement | null;
                if (output) output.textContent = sanitized;
              }}
            />
            <span className="sanitized-output">Sanitized output will appear here</span>
          </div>
        </div>
      </div>
    </div>
  );
}
