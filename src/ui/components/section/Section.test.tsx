import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { vi } from 'vitest';

import { Section } from './Section';

vi.mock('../tooltip', () => ({
  Tooltip: ({ target, message }: { target?: React.ReactNode; message?: string }) => (
    <div data-testid="tooltip-mock" data-message={message}>
      {target}
    </div>
  ),
}));

describe('Section', () => {
  it('renders children inside the section wrapper', () => {
    render(<Section>Hello content</Section>);
    const section = screen.getByText('Hello content');
    expect(section).toHaveClass('section-wrap');
  });

  it('renders nothing when hide is true', () => {
    const { container } = render(<Section hide>Hidden</Section>);
    expect(container).toBeEmptyDOMElement();
  });

  it('applies border classes', () => {
    render(<Section borders={['top', 'bottom']}>Bordered</Section>);
    const section = screen.getByText('Bordered');
    expect(section).toHaveClass('border-top', 'border-bottom');
  });

  it('applies active, scrollable and custom classes', () => {
    render(
      <Section active scrollable className="extra">
        Body
      </Section>
    );
    const section = document.querySelector('.section-wrap') as HTMLElement;
    expect(section).toHaveClass('active', 'scrollable', 'extra');
    // scrollable wraps children
    expect(section.querySelector('.scrollable-content')).toHaveTextContent('Body');
  });

  it('applies inline sizing styles', () => {
    render(
      <Section width="400px" height="300px" backgroundColor="black">
        Sized
      </Section>
    );
    const section = screen.getByText('Sized');
    expect(section.style.width).toBe('400px');
    expect(section.style.height).toBe('300px');
    expect(section.style.backgroundColor).toBe('black');
    expect(section.style.padding).toBe('var(--Spacing-12, 12px)');
    expect(section.style.gap).toBe('var(--Spacing-8, 8px)');
  });

  it('is clickable with role button and fires onclick', async () => {
    const user = userEvent.setup();
    const onclick = vi.fn();
    render(
      <Section clickable onclick={onclick}>
        Click me
      </Section>
    );
    const section = screen.getByRole('button');
    expect(section).toHaveAttribute('tabindex', '0');
    await user.click(section);
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('activates via Enter and Space keys when clickable', () => {
    const onclick = vi.fn();
    render(
      <Section clickable onclick={onclick}>
        Keyboard
      </Section>
    );
    const section = screen.getByRole('button');
    section.focus();
    fireEvent.keyDown(section, { key: 'Enter' });
    fireEvent.keyDown(section, { key: ' ' });
    expect(onclick).toHaveBeenCalledTimes(2);
  });

  it('does not fire onclick when disabled', () => {
    const onclick = vi.fn();
    const { container } = render(
      <Section clickable disabled onclick={onclick}>
        Disabled
      </Section>
    );
    const section = container.querySelector('.section-wrap') as HTMLElement;
    expect(section).toHaveClass('disabled');
    expect(section).toHaveAttribute('tabindex', '-1');
    expect(section).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(section);
    fireEvent.keyDown(section, { key: 'Enter' });
    expect(onclick).not.toHaveBeenCalled();
  });

  it('does not fire onclick when not clickable', () => {
    const onclick = vi.fn();
    render(<Section onclick={onclick}>Static</Section>);
    const section = screen.getByText('Static');
    expect(section).not.toHaveAttribute('role');
    fireEvent.click(section);
    expect(onclick).not.toHaveBeenCalled();
  });

  it('wraps in a disabled tooltip when disabledMessage is set', () => {
    render(<Section disabledMessage="Locked in edit mode">Body</Section>);
    const tooltip = screen.getByTestId('tooltip-mock');
    expect(tooltip).toHaveAttribute('data-message', 'Locked in edit mode');
    const section = tooltip.querySelector('.section-wrap') as HTMLElement;
    expect(section).toHaveClass('disabled', 'disabled-in-edit-mode');
  });

  it('wraps in a tooltip when tooltip config has a message', () => {
    render(<Section tooltip={{ message: 'Helpful info' }}>Body</Section>);
    const tooltip = screen.getByTestId('tooltip-mock');
    expect(tooltip).toHaveAttribute('data-message', 'Helpful info');
  });

  it('renders without tooltip wrapper by default', () => {
    render(<Section>Plain</Section>);
    expect(screen.queryByTestId('tooltip-mock')).not.toBeInTheDocument();
  });
});
