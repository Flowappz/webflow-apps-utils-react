import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SaveIcon } from '../../icons';
import { Button } from './Button';

describe('Button', () => {
  it('renders a button with text and default classes', () => {
    render(<Button text="Click me" />);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('button', 'button--primary');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-busy', 'false');
    expect(button.style.padding).toBe('4px 8px');
  });

  it('applies the variant class', () => {
    render(<Button text="Delete" variant="danger" />);
    expect(screen.getByRole('button')).toHaveClass('button--danger');
  });

  it('calls onclick when clicked', async () => {
    const user = userEvent.setup();
    const onclick = vi.fn();
    render(<Button text="Go" onclick={onclick} />);

    await user.click(screen.getByRole('button'));
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled, loading or invalid', () => {
    const { rerender } = render(<Button text="Save" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();

    rerender(<Button text="Save" loading />);
    expect(screen.getByRole('button')).toBeDisabled();

    rerender(<Button text="Save" invalid />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onclick when disabled', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onclick = vi.fn();
    render(<Button text="Nope" disabled onclick={onclick} />);

    await user.click(screen.getByRole('button'));
    expect(onclick).not.toHaveBeenCalled();
  });

  it('shows loading text and a loader when loading', () => {
    const { container } = render(<Button text="Save" loading loadingText="Saving..." />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--loading');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(container.querySelector('.fs-loader-wrapper')).toBeInTheDocument();
  });

  it('renders left and right icons', () => {
    const { container } = render(
      <Button text="Save" icon={SaveIcon} rightIcon={SaveIcon} iconSize="20px" iconColor="red" />
    );

    const left = container.querySelector<HTMLElement>('.button__icon--left');
    const right = container.querySelector<HTMLElement>('.button__icon--right');
    expect(left).toBeInTheDocument();
    expect(right).toBeInTheDocument();
    expect(left?.querySelector('svg')).toBeInTheDocument();
    expect(left?.style.width).toBe('20px');
    expect(left?.style.color).toBe('red');
  });

  it('applies fullWidth class and custom className', () => {
    render(<Button text="Wide" fullWidth className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('button--full-width', 'custom-class');
  });

  it('applies ariaLabel and custom padding/style', () => {
    render(<Button ariaLabel="Add item" padding="10px" style={{ marginTop: '4px' }} />);
    const button = screen.getByRole('button', { name: 'Add item' });
    expect(button.style.padding).toBe('10px');
    expect(button.style.marginTop).toBe('4px');
  });

  it('renders custom children instead of text', () => {
    render(
      <Button>
        <span data-testid="custom-content">Custom</span>
      </Button>
    );
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('wraps the button in a tooltip when tooltip.message is provided', () => {
    const { container } = render(
      <Button text="Hover me" tooltip={{ message: 'Helpful tip', placement: 'top' }} />
    );

    expect(container.querySelector('.target')).toBeInTheDocument();
    expect(container.querySelector('[role="tooltip"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('does not render a tooltip without tooltip content', () => {
    const { container } = render(<Button text="Plain" />);
    expect(container.querySelector('[role="tooltip"]')).not.toBeInTheDocument();
  });
});
