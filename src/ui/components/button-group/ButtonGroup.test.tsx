import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ButtonGroup } from './ButtonGroup';

const buttons = [
  { name: 'Option 1', value: 'option1' },
  { name: 'Option 2', value: 'option2' },
  { name: 'Option 3', value: 'option3' },
];

describe('ButtonGroup', () => {
  it('renders all buttons', () => {
    render(<ButtonGroup buttons={buttons} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('marks the selected button as active', () => {
    render(<ButtonGroup buttons={buttons} selected="option2" />);
    expect(screen.getByText('Option 2')).toHaveClass('active');
    expect(screen.getByText('Option 1')).not.toHaveClass('active');
  });

  it('selects a button on click and calls onselect', async () => {
    const user = userEvent.setup();
    const onselect = vi.fn();
    render(<ButtonGroup buttons={buttons} selected="option1" onselect={onselect} />);

    await user.click(screen.getByText('Option 3'));

    expect(onselect).toHaveBeenCalledWith('option3');
    expect(screen.getByText('Option 3')).toHaveClass('active');
    expect(screen.getByText('Option 1')).not.toHaveClass('active');
  });

  it('supports keyboard selection with Enter and Space', async () => {
    const user = userEvent.setup();
    const onselect = vi.fn();
    render(<ButtonGroup buttons={buttons} onselect={onselect} />);

    const option2 = screen.getByText('Option 2');
    option2.focus();
    await user.keyboard('{Enter}');
    expect(onselect).toHaveBeenCalledWith('option2');

    const option1 = screen.getByText('Option 1');
    option1.focus();
    await user.keyboard(' ');
    expect(onselect).toHaveBeenCalledWith('option1');
  });

  it('does not select when disabled', async () => {
    const user = userEvent.setup();
    const onselect = vi.fn();
    render(<ButtonGroup buttons={buttons} selected="option1" disabled onselect={onselect} />);

    const option2 = screen.getByText('Option 2');
    expect(option2).toHaveClass('disabled');
    expect(option2).toHaveAttribute('aria-disabled', 'true');
    expect(option2).toHaveAttribute('tabindex', '-1');

    await user.click(option2);
    expect(onselect).not.toHaveBeenCalled();
    expect(option2).not.toHaveClass('active');
  });

  it('syncs internal selection when the selected prop changes', () => {
    const { rerender } = render(<ButtonGroup buttons={buttons} selected="option1" />);
    expect(screen.getByText('Option 1')).toHaveClass('active');

    rerender(<ButtonGroup buttons={buttons} selected="option3" />);
    expect(screen.getByText('Option 3')).toHaveClass('active');
    expect(screen.getByText('Option 1')).not.toHaveClass('active');
  });

  it('calls onSelectedChange when the selection changes', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(<ButtonGroup buttons={buttons} onSelectedChange={onSelectedChange} />);

    await user.click(screen.getByText('Option 2'));
    expect(onSelectedChange).toHaveBeenCalledWith('option2');
  });
});
