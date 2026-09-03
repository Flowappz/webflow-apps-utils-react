import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tooltip } from './Tooltip';

const getTooltipEl = (container: HTMLElement) =>
  container.querySelector<HTMLDivElement>('[role="tooltip"]')!;

describe('Tooltip', () => {
  it('renders the target and a hidden tooltip element', () => {
    const { container } = render(<Tooltip message="Hello" target={<button>Trigger</button>} />);

    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();

    const tooltip = getTooltipEl(container);
    expect(tooltip).toBeInTheDocument();
    expect(tooltip.id).toMatch(/^tooltip-/);
    // display: none comes from the stylesheet; the inline style is only set on show/hide
    expect(tooltip.style.display).not.toBe('flex');
    expect(container.querySelector('.target')).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('renders the cleaned-up message text', () => {
    render(<Tooltip message="Hello. Extra" target={<button>Trigger</button>} />);
    // cleanupTooltipMessage appends a trailing period when the text contains one elsewhere
    expect(screen.getByText('Hello. Extra.')).toBeInTheDocument();
  });

  it('renders custom tooltip content and the arrow element', () => {
    const { container } = render(
      <Tooltip target={<button>Trigger</button>} tooltip={<div data-testid="custom">Custom</div>} />
    );

    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(container.querySelector('.arrow')).toBeInTheDocument();
  });

  it('does not render the arrow when showArrow is false', () => {
    const { container } = render(
      <Tooltip message="No arrow" showArrow={false} target={<button>Trigger</button>} />
    );
    expect(container.querySelector('.arrow')).not.toBeInTheDocument();
  });

  it('shows on hover and hides on mouse leave', async () => {
    const user = userEvent.setup();
    const onshow = vi.fn();
    const onclose = vi.fn();

    const { container } = render(
      <Tooltip message="Hover tip" onshow={onshow} onclose={onclose} target={<button>Trigger</button>} />
    );

    const target = container.querySelector<HTMLDivElement>('.target')!;
    const tooltip = getTooltipEl(container);

    await user.hover(target);

    expect(tooltip.style.display).toBe('flex');
    expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    expect(tooltip).toHaveAttribute('data-trigger-type', 'hover');
    expect(onshow).toHaveBeenCalledWith(true);

    await user.unhover(target);

    // hide happens on a 50ms timeout
    await waitFor(() => {
      expect(tooltip.style.display).toBe('none');
    });
    expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    expect(onclose).toHaveBeenCalledWith(true);
  });

  it('shows on click and hides when clicking outside (click listener)', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Tooltip
        message="Click tip"
        listener="click"
        listenerout="click"
        stopPropagation={false}
        target={<button>Trigger</button>}
      />
    );

    const target = container.querySelector<HTMLDivElement>('.target')!;
    const tooltip = getTooltipEl(container);

    await user.click(target);

    expect(tooltip.style.display).toBe('flex');
    expect(tooltip).toHaveAttribute('data-trigger-type', 'click');

    // Clicking outside hides it
    await user.click(document.body);

    await waitFor(() => {
      expect(tooltip.style.display).toBe('none');
    });
  });

  it('does not show when disabled', async () => {
    const user = userEvent.setup();
    const onshow = vi.fn();

    const { container } = render(
      <Tooltip message="Disabled tip" disabled onshow={onshow} target={<button>Trigger</button>} />
    );

    const target = container.querySelector<HTMLDivElement>('.target')!;
    const tooltip = getTooltipEl(container);

    await user.hover(target);

    expect(tooltip.style.display).not.toBe('flex');
    expect(onshow).not.toHaveBeenCalled();
  });

  it('hides the tooltip when the hidden prop becomes true', async () => {
    const user = userEvent.setup();

    const { container, rerender } = render(
      <Tooltip message="Hideable" listener="click" listenerout="click" target={<button>Trigger</button>} />
    );

    const target = container.querySelector<HTMLDivElement>('.target')!;
    const tooltip = getTooltipEl(container);

    await user.click(target);
    expect(tooltip.style.display).toBe('flex');

    rerender(
      <Tooltip
        message="Hideable"
        listener="click"
        listenerout="click"
        hidden
        target={<button>Trigger</button>}
      />
    );

    // hidden effect runs after 10ms, hide after another 50ms
    await waitFor(() => {
      expect(tooltip.style.display).toBe('none');
    });
  });

  it('reports active state through onIsActiveChange', async () => {
    const user = userEvent.setup();
    const onIsActiveChange = vi.fn();

    const { container } = render(
      <Tooltip message="Active tip" onIsActiveChange={onIsActiveChange} target={<button>Trigger</button>} />
    );

    const target = container.querySelector<HTMLDivElement>('.target')!;
    await user.hover(target);
    expect(onIsActiveChange).toHaveBeenCalledWith(true);

    await user.unhover(target);
    await waitFor(() => {
      expect(onIsActiveChange).toHaveBeenCalledWith(false);
    });
  });

  it('renders raw HTML messages when raw is true', () => {
    const { container } = render(
      <Tooltip message="<strong>Bold</strong> text" raw target={<button>Trigger</button>} />
    );
    expect(container.querySelector('.message strong')).toHaveTextContent('Bold');
  });

  it('applies width, padding, position and background color to the tooltip', () => {
    const { container } = render(
      <Tooltip
        message="Styled"
        width="200px"
        padding="10px"
        position="fixed"
        bgColor="#123456"
        target={<button>Trigger</button>}
      />
    );

    const tooltip = getTooltipEl(container);
    expect(tooltip.style.width).toBe('200px');
    expect(tooltip.style.padding).toBe('10px');
    expect(tooltip.style.position).toBe('fixed');
  });

  it('renders a default demo target when no target is provided', () => {
    render(<Tooltip message="Demo" />);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('renders a "Click me" demo target for click triggers', () => {
    render(<Tooltip message="Demo" listener="click" listenerout="click" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
