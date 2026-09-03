import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Switch } from './Switch';

describe('Switch', () => {
  it('renders an accessible switch input', () => {
    render(<Switch ariaLabel="Enable notifications" />);
    const input = screen.getByRole('switch', { name: 'Enable notifications' });
    expect(input).toBeInTheDocument();
    expect(input).not.toBeChecked();
    expect(input).toHaveAttribute('aria-checked', 'false');
    expect(input).toHaveClass('switch__input');
  });

  it('renders checked state from the prop', () => {
    render(<Switch checked ariaLabel="toggle" />);
    const input = screen.getByRole('switch');
    expect(input).toBeChecked();
    expect(input).toHaveAttribute('aria-checked', 'true');
  });

  it('uses the provided id and name', () => {
    render(<Switch id="my-switch" name="prefs" ariaLabel="toggle" />);
    const input = screen.getByRole('switch');
    expect(input).toHaveAttribute('id', 'my-switch');
    expect(input).toHaveAttribute('name', 'prefs');
  });

  it('generates a unique id when none is provided', () => {
    render(<Switch ariaLabel="toggle" />);
    const input = screen.getByRole('switch');
    expect(input.id).toMatch(/^switch-/);
    expect(input).toHaveAttribute('name', input.id);
  });

  it('toggles on click and calls onchange with the event object', async () => {
    const user = userEvent.setup();
    const onchange = vi.fn();
    render(<Switch id="s1" ariaLabel="toggle" onchange={onchange} />);

    const input = screen.getByRole('switch');
    await user.click(input);

    expect(input).toBeChecked();
    expect(onchange).toHaveBeenCalledWith({ checked: true, id: 's1' });

    await user.click(input);
    expect(input).not.toBeChecked();
    expect(onchange).toHaveBeenCalledWith({ checked: false, id: 's1' });
  });

  it('toggles with the Space and Enter keys', async () => {
    const user = userEvent.setup();
    const onchange = vi.fn();
    render(<Switch id="s2" ariaLabel="toggle" onchange={onchange} />);

    const input = screen.getByRole('switch');
    input.focus();

    await user.keyboard('{Enter}');
    expect(onchange).toHaveBeenLastCalledWith({ checked: true, id: 's2' });
    expect(input).toBeChecked();

    await user.keyboard(' ');
    expect(onchange).toHaveBeenLastCalledWith({ checked: false, id: 's2' });
    expect(input).not.toBeChecked();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onchange = vi.fn();
    const { container } = render(<Switch disabled ariaLabel="toggle" onchange={onchange} />);

    const label = container.querySelector('label');
    expect(label).toHaveClass('switch--disabled');

    const input = screen.getByRole('switch');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('tabindex', '-1');

    await user.click(input);
    expect(onchange).not.toHaveBeenCalled();
    expect(input).not.toBeChecked();
  });

  it('syncs internal state when the checked prop changes', () => {
    const { rerender } = render(<Switch checked={false} ariaLabel="toggle" />);
    expect(screen.getByRole('switch')).not.toBeChecked();

    rerender(<Switch checked={true} ariaLabel="toggle" />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('calls onCheckedChange when toggled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch ariaLabel="toggle" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('applies required and custom class', () => {
    const { container } = render(<Switch required className="custom" ariaLabel="toggle" />);
    expect(screen.getByRole('switch')).toBeRequired();
    expect(container.querySelector('label')).toHaveClass('switch', 'custom');
  });

  it('renders track and handle elements', () => {
    const { container } = render(<Switch ariaLabel="toggle" />);
    expect(container.querySelector('.switch__track')).toBeInTheDocument();
    expect(container.querySelector('.switch__handle')).toBeInTheDocument();
  });
});
