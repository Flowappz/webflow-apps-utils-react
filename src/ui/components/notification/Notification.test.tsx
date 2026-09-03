import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Notification } from './Notification';

vi.mock('../text', () => ({
  Text: ({ label, raw }: { label?: string; raw?: boolean }) =>
    raw ? (
      <span dangerouslySetInnerHTML={{ __html: label ?? '' }} />
    ) : (
      <span>{label}</span>
    ),
}));

describe('Notification', () => {
  it('renders title and message', () => {
    render(
      <Notification
        variant="warning"
        title="Warning Notification"
        message="This is a warning message."
      />
    );
    const notification = screen.getByTestId('notification');
    expect(notification).toBeInTheDocument();
    expect(screen.getByText('Warning Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a warning message.')).toBeInTheDocument();
  });

  it('applies the variant border color by default', () => {
    render(<Notification variant="error" title="Error" />);
    const notification = screen.getByTestId('notification');
    expect(notification.style.borderLeft).toBe('2px solid var(--redBorder)');
  });

  it('supports a custom color string variant', () => {
    render(<Notification variant="#9333EA" title="Custom" />);
    const notification = screen.getByTestId('notification');
    expect(notification.style.borderLeft).toContain('2px solid');
    const icon = notification.querySelector('.icon') as HTMLElement;
    expect(icon.style.color).toBe('rgb(147, 51, 234)');
  });

  it('omits the border when showBorder is false', () => {
    render(<Notification variant="success" title="No Border" showBorder={false} />);
    const notification = screen.getByTestId('notification');
    expect(notification.style.borderLeft).toBe('');
  });

  it('fires onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Notification title="Closable" onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Close notification' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides the close button when showCloseButton is false', () => {
    render(<Notification title="Persistent" showCloseButton={false} />);
    expect(
      screen.queryByRole('button', { name: 'Close notification' })
    ).not.toBeInTheDocument();
  });

  it('renders an external link when href and linkText are provided', () => {
    render(
      <Notification
        title="Update Available"
        message="A new version is available."
        href="https://example.com/download"
        linkText="Download Now"
      />
    );
    const link = screen.getByRole('link', { name: 'Download Now' });
    expect(link).toHaveAttribute('href', 'https://example.com/download');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders rich text message as HTML', () => {
    render(
      <Notification
        title="Rich"
        message="Supports <strong>rich text</strong> formatting."
        richTextMessage
      />
    );
    expect(screen.getByText('rich text')).toBeInTheDocument();
    expect(screen.getByText('rich text').tagName).toBe('STRONG');
  });

  it('renders custom actions content', () => {
    render(
      <Notification title="With actions" actions={<button type="button">Retry</button>} />
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('adds the centered class when only a title is shown', () => {
    render(<Notification title="Only title" />);
    expect(screen.getByTestId('notification')).toHaveClass('centered');
  });

  it('merges custom className', () => {
    render(<Notification title="Styled" className="custom-class" />);
    expect(screen.getByTestId('notification')).toHaveClass('wrapper', 'custom-class');
  });
});
