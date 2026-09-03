import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { vi } from 'vitest';

import { Modal } from './Modal';

vi.mock('../button', () => ({
  Button: ({
    children,
    onclick,
    variant,
  }: {
    children?: React.ReactNode;
    onclick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: string;
  }) => (
    <button type="button" data-variant={variant} onClick={onclick}>
      {children}
    </button>
  ),
}));

vi.mock('../LoadingScreen', () => ({
  LoadingScreen: ({ message }: { message?: string }) => (
    <div data-testid="loading-screen">{message}</div>
  ),
}));

vi.mock('../text', () => ({
  Text: ({ label }: { label?: string }) => <span>{label}</span>,
}));

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<Modal open={false}>Content</Modal>);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a dialog with title and content when open', () => {
    render(
      <Modal open title="Basic Modal">
        <p>Modal content</p>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Basic Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('closes via the close button', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        Content
      </Modal>
    );
    await user.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes when the overlay is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onOverlayClick = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} onOverlayClick={onOverlayClick}>
        Content
      </Modal>
    );
    await user.click(screen.getByRole('dialog'));
    expect(onOverlayClick).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not close on content clicks', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        <p>Inner text</p>
      </Modal>
    );
    await user.click(screen.getByText('Inner text'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('does not close on overlay click when closeOnOverlayClick is false', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onOverlayClick = vi.fn();
    render(
      <Modal
        open
        closeOnOverlayClick={false}
        onOpenChange={onOpenChange}
        onOverlayClick={onOverlayClick}
      >
        Content
      </Modal>
    );
    await user.click(screen.getByRole('dialog'));
    expect(onOverlayClick).toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toHaveClass('prevent-overlay-close');
  });

  it('closes on Escape key', () => {
    const onOpenChange = vi.fn();
    const onEscapeKeyDown = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} onEscapeKeyDown={onEscapeKeyDown}>
        Content
      </Modal>
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onEscapeKeyDown).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not close on Escape when closeOnEscape is false', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open closeOnEscape={false} onOpenChange={onOpenChange}>
        Content
      </Modal>
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('shows the loading screen when loading', () => {
    render(
      <Modal open loading loadingMessage="Processing your request...">
        Content
      </Modal>
    );
    expect(screen.getByTestId('loading-screen')).toHaveTextContent('Processing your request...');
  });

  it('renders default footer buttons that fire onAction and onCancel', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onCancel = vi.fn();
    render(
      <Modal open actionText="Confirm" cancelText="Dismiss" onAction={onAction} onCancel={onCancel}>
        Content
      </Modal>
    );
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders custom header and footer content', () => {
    render(
      <Modal open header={<h3>Custom Header</h3>} footer={<div>Custom Footer</div>}>
        Content
      </Modal>
    );
    expect(screen.getByText('Custom Header')).toBeInTheDocument();
    expect(screen.getByText('Custom Footer')).toBeInTheDocument();
  });

  it('hides header and footer when disabled', () => {
    render(
      <Modal open showHeader={false} showFooter={false}>
        Content
      </Modal>
    );
    expect(document.querySelector('.header-bar')).not.toBeInTheDocument();
    expect(document.querySelector('.modal-footer')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
  });

  it('locks body scroll while open and restores on close', () => {
    const { rerender } = render(<Modal open>Content</Modal>);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Modal open={false}>Content</Modal>);
    expect(document.body.style.overflow).toBe('');
  });

  it('applies custom width, height and style to the modal content', () => {
    render(
      <Modal open width="400px" height="300px" style={{ border: '3px solid rgb(255, 107, 107)' }}>
        Content
      </Modal>
    );
    const content = document.querySelector('.modal-content') as HTMLElement;
    expect(content.style.width).toBe('400px');
    expect(content.style.height).toBe('300px');
    expect(content.style.border).toBe('3px solid rgb(255, 107, 107)');
  });

  it('focuses the close button when opened', () => {
    render(<Modal open>Content</Modal>);
    expect(screen.getByRole('button', { name: 'Close modal' })).toHaveFocus();
  });
});
