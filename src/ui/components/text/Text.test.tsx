import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AccountIcon } from '../../icons';
import { Text } from './Text';

describe('Text', () => {
  it('renders the label with default classes', () => {
    render(<Text label="Hello" />);
    const label = screen.getByText('Hello').closest('[data-component="Text"]');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('labels');
  });

  it('renders nothing without label, tooltip, icon or children', () => {
    const { container } = render(<Text />);
    expect(container).toBeEmptyDOMElement();
  });

  it('applies font styles to the text element', () => {
    const { container } = render(
      <Text label="Styled" fontSize="large" fontWeight="bold" fontColor="#ff0000" />
    );
    const text = container.querySelector<HTMLElement>('.text')!;
    expect(text.style.fontSize).toBe('12.5px');
    expect(text.style.fontWeight).toBe('600');
  });

  it('resolves custom font size and weight values', () => {
    const { container } = render(<Text label="Custom" fontSize="15px" fontWeight="700" />);
    const text = container.querySelector<HTMLElement>('.text')!;
    expect(text.style.fontSize).toBe('15px');
    expect(text.style.fontWeight).toBe('700');
  });

  it('renders as a link with role button and handles clicks', async () => {
    const user = userEvent.setup();
    const onclick = vi.fn();
    render(<Text label="Click me" link onclick={onclick} />);

    const label = screen.getByRole('button');
    expect(label).toHaveClass('link', 'link-hover');
    expect(label).toHaveAttribute('tabindex', '0');

    await user.click(label);
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('does not call onclick when disabled', async () => {
    const user = userEvent.setup();
    const onclick = vi.fn();
    render(<Text label="Disabled" disabled onclick={onclick} />);

    const label = screen.getByText('Disabled').closest('[data-component="Text"]')!;
    expect(label).toHaveClass('disabled');

    await user.click(label as HTMLElement);
    expect(onclick).not.toHaveBeenCalled();
  });

  it('renders an icon alongside the text', () => {
    const { container } = render(<Text label="With icon" icon={AccountIcon} />);
    expect(container.querySelector('.text svg')).toBeInTheDocument();
    expect(screen.getByText('With icon')).toBeInTheDocument();
  });

  it('shows a loader instead of the icon when loading', () => {
    const { container } = render(<Text label="Loading" icon={AccountIcon} loading />);
    expect(container.querySelector('.loading')).toBeInTheDocument();
    expect(container.querySelector('.fs-loader-wrapper')).toBeInTheDocument();
  });

  it('renders raw HTML when raw is true', () => {
    const { container } = render(<Text label="Hello <strong>world</strong>" raw />);
    expect(container.querySelector('.text strong')).toHaveTextContent('world');
  });

  it('applies ellipsis styles for text-only truncation', () => {
    const { container } = render(<Text label="Long text" ellipsisOnWidth="150px" />);
    const text = container.querySelector<HTMLElement>('.text')!;
    expect(text).toHaveClass('ellipsis');
    expect(text.style.width).toBe('150px');
    expect(text.style.textOverflow).toBe('ellipsis');
  });

  it('wraps in text-with-icon container for icon + ellipsis', () => {
    const { container } = render(
      <Text label="Long text" icon={AccountIcon} ellipsisOnWidth="120px" />
    );
    const wrapper = container.querySelector<HTMLElement>('.text-with-icon')!;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.style.width).toBe('120px');
  });

  it('wraps the label in a tooltip when tooltip config has a message', () => {
    const { container } = render(
      <Text label="Tip text" tooltip={{ message: 'Helpful', placement: 'top' }} tooltipTarget="text" />
    );
    expect(container.querySelector('[role="tooltip"]')).toBeInTheDocument();
    expect(screen.getByText('Tip text')).toBeInTheDocument();
  });

  it('shows the tooltip on hover of the target', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Text label="Hover text" tooltip={{ message: 'Shown on hover' }} tooltipTarget="text" />
    );

    const target = container.querySelector<HTMLDivElement>('.target')!;
    const tooltip = container.querySelector<HTMLDivElement>('[role="tooltip"]')!;

    await user.hover(target);
    expect(tooltip.style.display).toBe('flex');

    await user.unhover(target);
    await waitFor(() => {
      expect(tooltip.style.display).toBe('none');
    });
  });

  it('puts the tooltip on the icon when tooltipTarget is icon', () => {
    const { container } = render(
      <Text
        label="Icon tooltip"
        icon={AccountIcon}
        tooltip={{ message: 'On the icon' }}
        tooltipTarget="icon"
      />
    );

    // Tooltip target wraps only the icon, not the whole label
    const target = container.querySelector('.target')!;
    expect(target.querySelector('svg')).toBeInTheDocument();
    expect(target.textContent).not.toContain('Icon tooltip');
    expect(screen.getByText('Icon tooltip')).toBeInTheDocument();
  });

  it('does not render an icon tooltip when tooltipTarget is icon but no icon given', () => {
    const { container } = render(
      <Text label="No icon" tooltip={{ message: 'Should not show' }} tooltipTarget="icon" />
    );
    expect(container.querySelector('[role="tooltip"]')).not.toBeInTheDocument();
  });

  it('renders the popup wrapper when popup is active', () => {
    render(
      <Text
        label="Popup text"
        popup={{ active: true, title: 'Remove it', subtitle: 'Alt + click', description: 'Desc' }}
      />
    );

    expect(screen.getByText('Remove it')).toBeInTheDocument();
    expect(screen.getByText('Alt + click')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
    expect(document.querySelector('.label-popup')).toBeInTheDocument();
    expect(document.querySelector('.popup-wrapper')).toBeInTheDocument();
  });

  it('fires the popup onclick when the popup header is clicked', async () => {
    const user = userEvent.setup();
    const popupClick = vi.fn();
    const { container } = render(
      <Text label="Popup text" popup={{ active: true, onclick: popupClick }} />
    );

    await user.click(container.querySelector<HTMLElement>('.popup-header')!);
    expect(popupClick).toHaveBeenCalledTimes(1);
  });

  it('renders pill content', () => {
    render(<Text label="With pill" pill={<span data-testid="pill">3</span>} />);
    expect(screen.getByTestId('pill')).toBeInTheDocument();
  });

  it('renders children instead of the label', () => {
    render(
      <Text label="ignored">
        <em data-testid="child">child content</em>
      </Text>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
