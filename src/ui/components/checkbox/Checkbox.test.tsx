import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with default (unchecked) state and correct aria attributes', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('checkbox', 'checkbox--checkbox');
    expect(checkbox).not.toHaveClass('checkbox--checked');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveAttribute('aria-disabled', 'false');
    expect(checkbox).toHaveAttribute('tabindex', '0');
    expect(checkbox.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders checked with an svg indicator when defaultChecked', () => {
    render(<Checkbox defaultChecked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('checkbox--checked');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(checkbox.querySelector('svg')).toBeInTheDocument();
  });

  it('toggles on click when uncontrolled and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(onChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveClass('checkbox--checked');

    await user.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(false);
    expect(checkbox).not.toHaveClass('checkbox--checked');
  });

  it('does not toggle its own state when controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox checked={true} onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // Reports the new state but stays controlled by the prop
    expect(onChange).toHaveBeenCalledWith(false);
    expect(checkbox).toHaveClass('checkbox--checked');
  });

  it('toggles with the Space and Enter keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();

    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('ignores interaction when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox disabled onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('checkbox--disabled');
    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox).toHaveAttribute('tabindex', '-1');

    await user.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders the radio variant class', () => {
    render(<Checkbox variant="radio" defaultChecked />);
    expect(screen.getByRole('checkbox')).toHaveClass('checkbox--radio', 'checkbox--checked');
  });

  it('renders the RadioDotIcon for radio variant with dot indicator', () => {
    render(<Checkbox variant="radio" radioIndicator="dot" checked />);
    const checkbox = screen.getByRole('checkbox');
    // RadioDotIcon renders a rect, SquareCheckIcon renders a path
    expect(checkbox.querySelector('svg rect')).toBeInTheDocument();
  });

  it('spreads extra props like aria-label', () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  it('applies additional className', () => {
    render(<Checkbox className="my-checkbox" />);
    expect(screen.getByRole('checkbox')).toHaveClass('my-checkbox');
  });
});
