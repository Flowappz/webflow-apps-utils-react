import type { FormField } from '../../types';
import { FORM_CSS_CLASSES } from '../webflow';
import { simulateEvent } from './events';
import { isHTMLInputElement } from './guards';

/**
 * Clears the form field's value and emits an input and changed event.
 * If the field is a checkbox or a radio, it will unselect it.
 * @param field The `FormField` to clear.
 * @param omitEvents By default, events are dispatched from the `FormField`. In some cases, these events might collide with other logic of the system.
 * You can omit certain events from being dispatched by passing them in an array.
 */
export const clearFormField = (field: FormField, omitEvents: Parameters<typeof simulateEvent>['1'] = []): void => {
  const { type } = field;

  if (isHTMLInputElement(field) && ['checkbox', 'radio'].includes(type)) {
    if (!field.checked) return;

    // Reset the field's value
    field.checked = false;

    // Emit DOM events
    simulateEvent(
      field,
      (['click', 'input', 'change'] as const).filter((event) => !omitEvents.includes(event))
    );

    if (type === 'checkbox') return;

    // Clear custom radio button classes
    const { parentElement } = field;
    if (!parentElement) return;

    const radioInput = parentElement.querySelector(`.${FORM_CSS_CLASSES.radioInput}`);
    if (!radioInput) return;

    radioInput.classList.remove(FORM_CSS_CLASSES.checkboxOrRadioFocus, FORM_CSS_CLASSES.checkboxOrRadioChecked);
    return;
  }

  // Reset the field's value
  field.value = '';

  // Emit DOM events
  simulateEvent(
    field,
    (['input', 'change'] as const).filter((eventKey) => !omitEvents.includes(eventKey))
  );
};

/**
 * Gets the value of a given input element.
 * @param {FormField} input
 */
export const getFormFieldValue = (input: FormField): string => {
  let { value } = input;

  // Perform actions depending on input type
  if (input.type === 'checkbox') value = (input as HTMLInputElement).checked.toString();
  if (input.type === 'radio') {
    // Get the checked radio
    const checkedOption = input.closest('form')?.querySelector(`input[name="${input.name}"]:checked`);

    // If exists, set its value
    value = isHTMLInputElement(checkedOption) ? checkedOption.value : '';
  }

  return value.toString();
};

/**
 * Sets a value to a FormField element and emits `click`, `input` and `change` Events.
 *
 * @param element The FormField to update.
 * @param value `boolean` for Checkboxes and Radios, `string` for the rest.
 */
export const setFormFieldValue = (element: FormField, value: string | boolean): void => {
  const { type } = element;

  const isRadio = type === 'radio';
  const isCheckbox = type === 'checkbox';

  if (isRadio || isCheckbox) {
    if (
      !isHTMLInputElement(element) ||
      typeof value !== 'boolean' ||
      value === element.checked ||
      (isRadio && value === false)
    ) {
      return;
    }

    element.checked = value;
  } else {
    if (element.value === value) return;

    element.value = value.toString();
  }

  // Emit DOM events
  simulateEvent(element, ['click', 'input', 'change']);
};
