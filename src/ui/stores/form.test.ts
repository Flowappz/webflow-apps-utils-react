import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  createForm,
  createGenericForm,
  FormManager,
  FormValidator,
  getFormById,
  getFormErrors,
  getFormFieldNames,
  isFormValid,
  resetForm,
} from './form';
import { get } from './store';

type TestForm = {
  name: string;
  email: string;
  [key: string]: unknown;
};

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().min(5, { message: 'Email is too short' }),
}) as unknown as z.ZodType<TestForm>;

describe('FormManager', () => {
  it('validates against the zod schema on creation', () => {
    const form = new FormManager<TestForm>('fm-init', schema, { name: '', email: '' });

    const state = form.getState();
    expect(state.isValid).toBe(false);
    expect(state.errors.name).toEqual(['Name is required']);
    expect(state.errors.email).toEqual(['Email is too short']);
    expect(state.isDirty).toBe(false);

    form.destroy();
  });

  it('setField updates values, touched, dirty and re-validates', () => {
    const form = new FormManager<TestForm>('fm-setfield', schema, { name: '', email: '' });

    form.setField('name', 'Walid');
    form.setField('email', 'walid@example.com');

    const state = form.getState();
    expect(state.values).toEqual({ name: 'Walid', email: 'walid@example.com' });
    expect(state.touched.name).toBe(true);
    expect(state.touched.email).toBe(true);
    expect(state.isDirty).toBe(true);
    expect(state.isValid).toBe(true);
    expect(state.errors).toEqual({});

    form.destroy();
  });

  it('exposes reactive derived stores (values/errors/touched/isValid/isDirty/isSubmitting)', () => {
    const form = new FormManager<TestForm>('fm-stores', schema, { name: '', email: '' });

    expect(get(form.isValid)).toBe(false);
    expect(get(form.isDirty)).toBe(false);

    const seenValues: TestForm[] = [];
    const unsubscribe = form.values.subscribe((v) => seenValues.push(v));

    form.setField('name', 'A');
    expect(seenValues[seenValues.length - 1].name).toBe('A');

    form.setSubmitting(true);
    expect(get(form.isSubmitting)).toBe(true);

    unsubscribe();
    form.destroy();
  });

  it('registerField returns field stores and methods, and registers globally', () => {
    const form = new FormManager<TestForm>('fm-fields', schema, { name: '', email: '' });

    const field = form.registerField('name', {
      validate: (value) => (String(value).startsWith('x') ? 'No x names' : null),
    });

    expect(getFormFieldNames('fm-fields')).toEqual(['name']);

    field.setValue('xavier');
    expect(get(field.value)).toBe('xavier');
    expect(get(field.touched)).toBe(true);
    expect(field.validate()).toContain('No x names');
    expect(get(form.errors).name).toContain('No x names');

    field.setValue('yara');
    expect(field.validate()).toEqual([]);

    form.destroy();
    expect(getFormFieldNames('fm-fields')).toEqual([]);
  });

  it('reset restores initial values and re-validates', () => {
    const form = new FormManager<TestForm>('fm-reset', schema, { name: 'Init', email: 'init@x.co' });

    form.setField('name', '');
    expect(form.getState().isValid).toBe(false);

    form.reset();
    const state = form.getState();
    expect(state.values).toEqual({ name: 'Init', email: 'init@x.co' });
    expect(state.isDirty).toBe(false);
    expect(state.isValid).toBe(true);

    form.destroy();
  });

  it('updateSchema re-validates with the new schema', () => {
    const form = new FormManager<TestForm>('fm-schema', schema, { name: 'ok', email: 'a@b.co' });
    expect(form.getState().isValid).toBe(true);

    const stricter = z.object({
      name: z.string().min(10, { message: 'Name too short' }),
      email: z.string().min(5),
    }) as unknown as z.ZodType<TestForm>;

    form.updateSchema(stricter);
    expect(form.getState().isValid).toBe(false);
    expect(form.getState().errors.name).toEqual(['Name too short']);

    form.destroy();
  });

  it('registry helpers work (getFormById / isFormValid / getFormErrors / resetForm)', () => {
    const form = new FormManager<TestForm>('fm-registry', schema, { name: '', email: '' });

    expect(getFormById('fm-registry')).toBe(form);
    expect(isFormValid('fm-registry')).toBe(false);
    expect(getFormErrors('fm-registry')?.name).toEqual(['Name is required']);

    form.setField('name', 'ok');
    form.setField('email', 'yes@x.co');
    expect(isFormValid('fm-registry')).toBe(true);

    expect(resetForm('fm-registry')).toBe(true);
    expect(form.getState().isDirty).toBe(false);

    form.destroy();
    expect(getFormById('fm-registry')).toBeUndefined();
    expect(isFormValid('fm-registry')).toBe(false);
    expect(getFormErrors('fm-registry')).toBeNull();
    expect(resetForm('fm-registry')).toBe(false);
  });

  it('createGenericForm exposes bound helpers', () => {
    const form = createGenericForm<TestForm>('fm-generic', schema, { name: '', email: '' });

    form.setFields({ name: 'A', email: 'a@b.co' });
    expect(get(form.isValid)).toBe(true);
    expect(get(form.values)).toEqual({ name: 'A', email: 'a@b.co' });

    form.destroy();
  });
});

describe('FormValidator', () => {
  const initial = { name: 'Component', instance: 'fs-comp', class: 'fs-comp' };

  it('validates required fields and class name format', () => {
    const form = new FormValidator('fv-basic', { ...initial, class: 'invalid class!' });

    const state = form.getState();
    expect(state.isValid).toBe(false);
    expect(state.errors.class).toEqual([
      'Class must contain only letters, numbers, underscores, and hyphens',
    ]);
  });

  it('enforces instance uniqueness against existing instances', () => {
    const form = new FormValidator('fv-unique', initial, {
      existingInstances: ['fs-comp', 'fs-other'],
    });

    expect(form.getState().isValid).toBe(false);
    expect(form.getState().errors.instance).toEqual(['Instance name must be unique']);

    form.setField('instance', 'fs-brand-new');
    expect(form.getState().isValid).toBe(true);
  });

  it('ignoreInstanceValidation allows the current instance in edit mode', () => {
    const form = new FormValidator('fv-edit', initial, { existingInstances: ['fs-comp'] });
    expect(form.getState().isValid).toBe(false);

    form.ignoreInstanceValidation('fs-comp', ['fs-comp']);
    expect(form.getState().isValid).toBe(true);
  });

  it('enableClassValidation(false) skips class rules', () => {
    const form = new FormValidator('fv-class', { ...initial, class: 'bad class!' });
    expect(form.getState().isValid).toBe(false);

    form.enableClassValidation(false);
    expect(form.getState().isValid).toBe(true);

    form.enableClassValidation(true);
    expect(form.getState().isValid).toBe(false);
  });

  it('generateNames finds the next available instance name', () => {
    expect(FormValidator.generateNames([], 'slider', 'Slider')).toEqual({
      name: 'Slider',
      instance: 'fs-slider',
      class: 'fs-slider',
    });

    expect(
      FormValidator.generateNames(['fs-slider', 'fs-slider-1'], 'slider', 'Slider')
    ).toEqual({
      name: 'Slider 2',
      instance: 'fs-slider-2',
      class: 'fs-slider-2',
    });
  });

  it('sanitizeClassName cleans up invalid characters', () => {
    expect(FormValidator.sanitizeClassName('my/invalid class-name!')).toBe('my-invalid-class-name');
    expect(FormValidator.sanitizeClassName('  /padded/  ')).toBe('padded');
    expect(FormValidator.sanitizeClassName('')).toBe('');
    expect(FormValidator.sanitizeClassName('--already--ok--')).toBe('already-ok');
  });

  it('createForm applies options and exposes bound helpers', () => {
    const form = createForm('fv-create', { ...initial, class: 'bad!' }, {
      existingInstances: ['fs-comp'],
      enableClassValidation: false,
    });

    // class validation disabled, but instance is duplicated
    expect(form.getState().errors.instance).toEqual(['Instance name must be unique']);

    form.setField('instance', 'fs-unique-x');
    expect(form.getState().isValid).toBe(true);

    form.reset();
    expect(form.getState().values).toEqual({ ...initial, class: 'bad!' });
  });
});
