import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from './Input';

describe('Input', () => {
  it('renders an input with placeholder and default id', () => {
    render(<Input placeholder="Enter text..." />);
    const input = screen.getByPlaceholderText('Enter text...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'webflow-input');
    expect(input).toHaveClass('webflow-input');
  });

  it('renders the provided value', () => {
    render(<Input value="Sample text" />);
    expect(screen.getByDisplayValue('Sample text')).toBeInTheDocument();
  });

  it('calls oninput with the trimmed value when typing', async () => {
    const user = userEvent.setup();
    const oninput = vi.fn();
    render(<Input placeholder="type" oninput={oninput} />);

    await user.type(screen.getByPlaceholderText('type'), 'abc');

    expect(oninput).toHaveBeenLastCalledWith('abc');
  });

  it('debounces oninput when debounce is set', async () => {
    const user = userEvent.setup();
    const oninput = vi.fn();
    render(<Input placeholder="type" debounce={100} oninput={oninput} />);

    await user.type(screen.getByPlaceholderText('type'), 'ab');
    expect(oninput).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(oninput).toHaveBeenCalledTimes(1);
    });
    expect(oninput).toHaveBeenCalledWith('ab');
  });

  it('calls onblur and onfocus handlers', async () => {
    const user = userEvent.setup();
    const onblur = vi.fn();
    const onfocus = vi.fn();
    render(<Input placeholder="focus" value="val" onblur={onblur} onfocus={onfocus} />);

    const input = screen.getByPlaceholderText('focus');
    await user.click(input);
    expect(onfocus).toHaveBeenCalled();

    await user.tab();
    expect(onblur).toHaveBeenCalledWith('val');
  });

  it('calls onkeydown handler', async () => {
    const user = userEvent.setup();
    const onkeydown = vi.fn();
    render(<Input placeholder="keys" onkeydown={onkeydown} />);

    await user.type(screen.getByPlaceholderText('keys'), 'a');
    expect(onkeydown).toHaveBeenCalled();
  });

  it('applies disabled, readonly and invalid states', () => {
    const { container, rerender } = render(<Input value="x" disabled />);
    expect(screen.getByDisplayValue('x')).toBeDisabled();
    expect(container.querySelector('.webflow-input-wrapper')).toHaveClass('disabled');

    rerender(<Input value="x" readonly />);
    expect(screen.getByDisplayValue('x')).toHaveAttribute('readonly');

    rerender(<Input value="x" invalid />);
    expect(container.querySelector('.webflow-input-wrapper')).toHaveClass('invalid');
  });

  it('renders units', () => {
    const { container } = render(<Input value="20" units="px" />);
    expect(screen.getByText('px')).toBeInTheDocument();
    expect(container.querySelector('.webflow-input-wrapper')).toHaveClass('units');
  });

  it('renders a pill when value and pill variant are set', () => {
    const { container } = render(<Input value="100" pill="blue" />);
    const pill = container.querySelector('.pill');
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveClass('blue');
    expect(container.querySelector('.webflow-input')).toHaveClass('has-pill');
  });

  it('throws when showSteppers is used without type="number"', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Input showSteppers />)).toThrow(
      'showSteppers can only be used when type="number"'
    );
    spy.mockRestore();
  });

  it('throws when showSteppers is combined with units', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Input type="number" showSteppers units="px" />)).toThrow(
      'showSteppers and units cannot be used together'
    );
    spy.mockRestore();
  });

  it('increments and decrements via stepper buttons', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Input type="number" showSteppers value="10" step={5} onValueChange={onValueChange} />
    );

    await user.click(screen.getByRole('button', { name: 'Increment value' }));
    expect(onValueChange).toHaveBeenLastCalledWith(15);
    expect(screen.getByDisplayValue('15')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Decrement value' }));
    expect(onValueChange).toHaveBeenLastCalledWith(10);
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('respects min/max constraints on steppers', async () => {
    const user = userEvent.setup();
    render(<Input type="number" showSteppers value="100" min={0} max={100} />);

    const increment = screen.getByRole('button', { name: 'Increment value' });
    expect(increment).toBeDisabled();

    const decrement = screen.getByRole('button', { name: 'Decrement value' });
    expect(decrement).toBeEnabled();
    await user.click(decrement);
    expect(screen.getByDisplayValue('99')).toBeInTheDocument();
  });

  it('increments/decrements with arrow keys when steppers are enabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Input type="number" showSteppers value="5" onValueChange={onValueChange} />);

    const input = screen.getByDisplayValue('5');
    await user.click(input);
    await user.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith(6);

    await user.keyboard('{ArrowDown}');
    expect(onValueChange).toHaveBeenLastCalledWith(5);
  });

  it('syncs when the value prop changes', () => {
    const { rerender } = render(<Input value="one" />);
    expect(screen.getByDisplayValue('one')).toBeInTheDocument();

    rerender(<Input value="two" />);
    expect(screen.getByDisplayValue('two')).toBeInTheDocument();
  });

  it('wraps the input in a tooltip with the alert message', () => {
    const { container } = render(
      <Input value="bad" invalid alert={{ type: 'error', message: 'This field has an error' }} />
    );

    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText(/This field has an error/)).toBeInTheDocument();
    expect(container.querySelector('.webflow-input-wrapper')).toHaveClass('invalid');
  });

  it('renders children inside the wrapper', () => {
    render(
      <Input value="x">
        <span data-testid="extra">extra</span>
      </Input>
    );
    expect(screen.getByTestId('extra')).toBeInTheDocument();
  });

  it('focuses the input on mount when autofocus is set', () => {
    render(<Input autofocus placeholder="auto" />);
    expect(screen.getByPlaceholderText('auto')).toHaveFocus();
  });
});
