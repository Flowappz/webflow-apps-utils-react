import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../icons', () => ({
  WarningTriangleOutlineIcon: () => <svg data-testid="warning-icon" />,
}));

vi.mock('./text', () => ({
  Text: ({ label, raw }: { label?: string; raw?: boolean }) =>
    raw ? <span dangerouslySetInnerHTML={{ __html: label ?? '' }} /> : <span>{label}</span>,
}));

import { LoadingScreen } from './LoadingScreen';

describe('LoadingScreen', () => {
  it('renders nothing when inactive', () => {
    const { container } = render(<LoadingScreen message="This should not be visible" />);
    expect(container.querySelector('.main-loader')).not.toBeInTheDocument();
  });

  it('renders the loader and message when active', () => {
    const { container } = render(<LoadingScreen active message="Loading..." />);

    const loader = container.querySelector('.main-loader') as HTMLElement;
    expect(loader).toBeInTheDocument();
    expect(loader.style.position).toBe('fixed');
    expect(loader.style.backgroundColor).toBe('rgba(30, 30, 30, 0.96)');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(container.querySelector('.fs-loader-wrapper')).toBeInTheDocument();
    expect(screen.queryByTestId('warning-icon')).not.toBeInTheDocument();
  });

  it('supports absolute positioning and custom background color', () => {
    const { container } = render(
      <LoadingScreen active position="absolute" backgroundColor="rgba(0, 0, 0, 0.9)" />
    );

    const loader = container.querySelector('.main-loader') as HTMLElement;
    expect(loader.style.position).toBe('absolute');
    expect(loader.style.backgroundColor).toBe('rgba(0, 0, 0, 0.9)');
  });

  it('applies a custom className and spinner size', () => {
    const { container } = render(
      <LoadingScreen active className="custom-loader" spinnerSize={80} />
    );

    expect(container.querySelector('.main-loader')).toHaveClass('custom-loader');
    const svg = container.querySelector('.loader-svg') as SVGElement;
    expect(svg).toHaveAttribute('width', '80');
  });

  it('renders the error state with warning icon and support link', () => {
    const { container } = render(
      <LoadingScreen active error message="Something went wrong while loading your data." />
    );

    expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
    expect(screen.getByText('Oops! That was unexpected.')).toBeInTheDocument();
    expect(
      screen.getByText('Something went wrong while loading your data.')
    ).toBeInTheDocument();

    const link = screen.getByText('Click here to open Issue').closest('a');
    expect(link).toHaveAttribute('href', 'https://forum.finsweet.com/c/finsweet-components');
    expect(container.querySelector('.loading-info')).toHaveClass('error');
    expect(container.querySelector('.fs-loader-wrapper')).not.toBeInTheDocument();
  });

  it('passes the raw flag through to the message text', () => {
    render(<LoadingScreen active raw message="Loading <strong>important</strong> data" />);
    expect(screen.getByText('important')).toBeInTheDocument();
  });
});
