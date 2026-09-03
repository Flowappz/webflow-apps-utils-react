import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ProgressBar } from './ProgressBar';

vi.mock('../text', () => ({
  Text: ({ label, className }: { label?: string; className?: string }) => (
    <span className={className}>{label}</span>
  ),
}));

describe('ProgressBar', () => {
  it('renders progressbar with correct value when not animated', () => {
    render(<ProgressBar value={45} animated={false} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '45');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');

    const fill = bar.querySelector('.progress-fill') as HTMLElement;
    expect(fill.style.width).toBe('45%');
  });

  it('shows the percentage text when showPercentage is true', () => {
    render(<ProgressBar value={45} animated={false} showPercentage />);
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('clamps percentage to 0-100 and respects max', () => {
    render(<ProgressBar value={50} max={200} animated={false} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
  });

  it('shows status text when showStatus is true', () => {
    render(
      <ProgressBar value={60} animated={false} showStatus statusText="Processing files..." />
    );
    expect(screen.getByText('Processing files...')).toBeInTheDocument();
  });

  it('applies variant class and fill color', () => {
    render(<ProgressBar value={25} animated={false} variant="error" />);
    const fill = document.querySelector('.progress-fill') as HTMLElement;
    expect(fill).toHaveClass('progress-fill--error');
    expect(fill.style.backgroundColor).toBe('var(--redText)');
  });

  it('applies custom track height', () => {
    render(<ProgressBar value={40} animated={false} height={8} />);
    const track = document.querySelector('.progress-track') as HTMLElement;
    expect(track.style.height).toBe('8px');
  });

  it('renders spinner when showSpinner is true and not completed', () => {
    const { container } = render(<ProgressBar value={35} animated={false} showSpinner />);
    expect(container.querySelector('.progress-spinner')).toBeInTheDocument();
  });

  it('locks progress and fires onComplete when completed becomes true', () => {
    const onComplete = vi.fn();
    const { rerender } = render(
      <ProgressBar value={80} animated={false} showStatus onComplete={onComplete} />
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '80');

    rerender(
      <ProgressBar value={80} animated={false} showStatus completed onComplete={onComplete} />
    );

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Completed successfully')).toBeInTheDocument();
    const fill = document.querySelector('.progress-fill') as HTMLElement;
    expect(fill).toHaveClass('completed');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '80');
  });

  it('hides the header when all indicators are off', () => {
    render(<ProgressBar value={40} animated={false} showPercentage={false} showStatus={false} />);
    expect(document.querySelector('.progress-header')).not.toBeInTheDocument();
  });

  it('merges custom className on the container', () => {
    render(<ProgressBar value={10} animated={false} className="custom-progress" />);
    expect(screen.getByRole('progressbar')).toHaveClass('progress-container', 'custom-progress');
  });
});
