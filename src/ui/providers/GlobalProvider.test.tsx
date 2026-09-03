import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { GlobalProvider } from './GlobalProvider';
import { useAppContext, useFormContext } from './globalContext';

function AppConsumer() {
  const appContext = useAppContext();
  const formContext = useFormContext();
  const appData = appContext.get();
  const formData = formContext.get();

  return (
    <div>
      <p data-testid="title">{appData?.title ?? 'no title'}</p>
      <p data-testid="edit-mode">{appData?.editMode ? 'ON' : 'OFF'}</p>
      <p data-testid="form-key">{formData?.formKey ?? 'none'}</p>
      <button
        onClick={() => {
          appContext.set({ editMode: !appContext.get()?.editMode });
        }}
      >
        Toggle Edit Mode
      </button>
    </div>
  );
}

describe('GlobalProvider', () => {
  it('provides default contexts (app, form, data)', () => {
    render(
      <GlobalProvider>
        <AppConsumer />
      </GlobalProvider>
    );

    expect(screen.getByTestId('title')).toHaveTextContent('no title');
    expect(screen.getByTestId('edit-mode')).toHaveTextContent('OFF');
    expect(screen.getByTestId('form-key')).toHaveTextContent('none');
  });

  it('merges provided initial contexts over defaults', () => {
    render(
      <GlobalProvider
        initialContexts={{
          app: { editMode: true, repairMode: false, title: 'My App' },
          form: { formKey: 'the-form', formUpdateKey: null },
        }}
      >
        <AppConsumer />
      </GlobalProvider>
    );

    expect(screen.getByTestId('title')).toHaveTextContent('My App');
    expect(screen.getByTestId('edit-mode')).toHaveTextContent('ON');
    expect(screen.getByTestId('form-key')).toHaveTextContent('the-form');
  });

  it('re-renders consumers when context data changes', async () => {
    const user = userEvent.setup();
    render(
      <GlobalProvider>
        <AppConsumer />
      </GlobalProvider>
    );

    expect(screen.getByTestId('edit-mode')).toHaveTextContent('OFF');
    await user.click(screen.getByRole('button', { name: 'Toggle Edit Mode' }));
    expect(screen.getByTestId('edit-mode')).toHaveTextContent('ON');
  });
});
