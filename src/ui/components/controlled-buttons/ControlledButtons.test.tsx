import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlledButtons } from './ControlledButtons';

describe('ControlledButtons', () => {
  it('renders plain buttons and handles clicks', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <ControlledButtons
        buttons={[
          { id: 'save', text: 'Save', variant: 'primary', onClick: onSave },
          { id: 'cancel', text: 'Cancel', variant: 'secondary', onClick: onCancel },
        ]}
      />
    );

    const save = screen.getByRole('button', { name: 'Save' });
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    expect(save).toHaveClass('button--primary');
    expect(cancel).toHaveClass('button--secondary');

    await user.click(save);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('skips buttons with show: false', () => {
    render(
      <ControlledButtons
        buttons={[
          { id: 'visible', text: 'Visible' },
          { id: 'hidden', text: 'Hidden', show: false },
        ]}
      />
    );

    expect(screen.getByText('Visible')).toBeInTheDocument();
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('renders disabled and loading buttons', () => {
    render(
      <ControlledButtons
        buttons={[
          { id: 'a', text: 'Disabled one', disabled: true },
          { id: 'b', text: 'Loading one', loading: true, },
        ]}
      />
    );

    expect(screen.getByRole('button', { name: 'Disabled one' })).toBeDisabled();
    // A loading Button shows its loadingText ("Please wait" by default)
    const loadingButton = screen.getByRole('button', { name: /Please wait/ });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveClass('button--loading');
  });

  it('renders a tooltip around buttons with tooltip config', () => {
    const { container } = render(
      <ControlledButtons
        buttons={[
          {
            id: 'save',
            text: 'Save',
            tooltip: { content: 'Save your changes', placement: 'top' },
          },
        ]}
      />
    );

    expect(container.querySelector('[role="tooltip"]')).toBeInTheDocument();
    expect(screen.getByText('Save your changes')).toBeInTheDocument();
    expect(container.querySelector('.tooltip-content')).toBeInTheDocument();
  });

  it('renders a popup menu with chevron for buttons with popupButtons', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    const { container } = render(
      <ControlledButtons
        buttons={[
          {
            id: 'actions',
            text: 'Actions',
            popupButtons: [
              { text: 'Edit', description: 'Edit the item', onClick: onEdit },
              { text: 'Delete', description: 'Delete the item', onClick: vi.fn() },
            ],
          },
        ]}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveClass('popup-button-chevron');
    expect(trigger.querySelector('svg')).toBeInTheDocument();

    expect(container.querySelector('.popup-content')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();

    // Open the popup and click an item
    const tooltipEl = container.querySelector<HTMLDivElement>('[role="tooltip"]')!;
    await user.click(container.querySelector<HTMLDivElement>('.target')!);
    expect(tooltipEl.style.display).toBe('flex');

    await user.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('hides popup items with show: false', () => {
    render(
      <ControlledButtons
        buttons={[
          {
            id: 'actions',
            text: 'Actions',
            popupButtons: [
              { text: 'Shown item' },
              { text: 'Hidden item', show: false },
            ],
          },
        ]}
      />
    );

    expect(screen.getByText('Shown item')).toBeInTheDocument();
    expect(screen.queryByText('Hidden item')).not.toBeInTheDocument();
  });

  it('applies the custom className to the footer', () => {
    const { container } = render(
      <ControlledButtons buttons={[{ id: 'x', text: 'X' }]} className="my-footer" />
    );
    expect(container.querySelector('.footer')).toHaveClass('my-footer');
  });
});
