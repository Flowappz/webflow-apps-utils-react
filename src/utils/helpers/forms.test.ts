import { FORM_CSS_CLASSES } from '../webflow';
import { clearFormField, getFormFieldValue, setFormFieldValue } from './forms';

describe('clearFormField', () => {
  it('clears a text input and dispatches input/change events', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = 'hello';

    const inputListener = vi.fn();
    const changeListener = vi.fn();
    input.addEventListener('input', inputListener);
    input.addEventListener('change', changeListener);

    clearFormField(input);

    expect(input.value).toBe('');
    expect(inputListener).toHaveBeenCalledTimes(1);
    expect(changeListener).toHaveBeenCalledTimes(1);
  });

  it('omits requested events', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = 'hello';

    const inputListener = vi.fn();
    const changeListener = vi.fn();
    input.addEventListener('input', inputListener);
    input.addEventListener('change', changeListener);

    clearFormField(input, ['change']);

    expect(input.value).toBe('');
    expect(inputListener).toHaveBeenCalledTimes(1);
    expect(changeListener).not.toHaveBeenCalled();
  });

  it('unchecks a checked checkbox and dispatches click/input/change events', () => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;

    const clickListener = vi.fn();
    checkbox.addEventListener('click', clickListener);

    clearFormField(checkbox);

    expect(checkbox.checked).toBe(false);
    expect(clickListener).toHaveBeenCalledTimes(1);
  });

  it('does nothing for an unchecked checkbox', () => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const clickListener = vi.fn();
    checkbox.addEventListener('click', clickListener);

    clearFormField(checkbox);

    expect(clickListener).not.toHaveBeenCalled();
  });

  it('removes custom radio classes when clearing a radio', () => {
    const wrapper = document.createElement('label');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.checked = true;

    const radioInput = document.createElement('div');
    radioInput.classList.add(
      FORM_CSS_CLASSES.radioInput,
      FORM_CSS_CLASSES.checkboxOrRadioFocus,
      FORM_CSS_CLASSES.checkboxOrRadioChecked
    );

    wrapper.append(radio, radioInput);

    clearFormField(radio);

    expect(radio.checked).toBe(false);
    expect(radioInput.classList.contains(FORM_CSS_CLASSES.checkboxOrRadioFocus)).toBe(false);
    expect(radioInput.classList.contains(FORM_CSS_CLASSES.checkboxOrRadioChecked)).toBe(false);
    expect(radioInput.classList.contains(FORM_CSS_CLASSES.radioInput)).toBe(true);
  });
});

describe('getFormFieldValue', () => {
  it('returns the value of a text input', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = 'hello';

    expect(getFormFieldValue(input)).toBe('hello');
  });

  it('returns the checked state of a checkbox as a string', () => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    expect(getFormFieldValue(checkbox)).toBe('false');

    checkbox.checked = true;
    expect(getFormFieldValue(checkbox)).toBe('true');
  });

  it('returns the checked radio value from the group', () => {
    const form = document.createElement('form');

    const radio1 = document.createElement('input');
    radio1.type = 'radio';
    radio1.name = 'group';
    radio1.value = 'one';

    const radio2 = document.createElement('input');
    radio2.type = 'radio';
    radio2.name = 'group';
    radio2.value = 'two';
    radio2.checked = true;

    form.append(radio1, radio2);
    document.body.appendChild(form);

    expect(getFormFieldValue(radio1)).toBe('two');

    form.remove();
  });

  it('returns an empty string when no radio in the group is checked', () => {
    const form = document.createElement('form');

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'group';
    radio.value = 'one';

    form.append(radio);
    document.body.appendChild(form);

    expect(getFormFieldValue(radio)).toBe('');

    form.remove();
  });
});

describe('setFormFieldValue', () => {
  it('sets a string value on a text input and dispatches events', () => {
    const input = document.createElement('input');
    input.type = 'text';

    const changeListener = vi.fn();
    input.addEventListener('change', changeListener);

    setFormFieldValue(input, 'new value');

    expect(input.value).toBe('new value');
    expect(changeListener).toHaveBeenCalledTimes(1);
  });

  it('does not dispatch events when the value is unchanged', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = 'same';

    const changeListener = vi.fn();
    input.addEventListener('change', changeListener);

    setFormFieldValue(input, 'same');

    expect(changeListener).not.toHaveBeenCalled();
  });

  it('checks a checkbox with a boolean value', () => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    setFormFieldValue(checkbox, true);
    expect(checkbox.checked).toBe(true);

    setFormFieldValue(checkbox, false);
    expect(checkbox.checked).toBe(false);
  });

  it('ignores non-boolean values for checkboxes', () => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    setFormFieldValue(checkbox, 'true');

    expect(checkbox.checked).toBe(false);
  });

  it('never unchecks a radio', () => {
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.checked = true;

    setFormFieldValue(radio, false);

    expect(radio.checked).toBe(true);
  });
});
