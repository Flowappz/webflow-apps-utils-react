import { render, screen } from '@testing-library/react';

import { Divider } from './Divider';

describe('Divider', () => {
  it('renders with default styles', () => {
    render(<Divider />);
    const divider = screen.getByTestId('divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('divider');
    expect(divider.style.height).toBe('1px');
    expect(divider.style.width).toBe('100%');
    expect(divider.style.background).toBe('var(--border1)');
    expect(divider.style.transform).toBe('');
  });

  it('applies custom height, width and background', () => {
    render(<Divider height="4px" width="50%" background="#007bff" />);
    const divider = screen.getByTestId('divider');
    expect(divider.style.height).toBe('4px');
    expect(divider.style.width).toBe('50%');
    expect(divider.style.background).toContain('rgb(0, 123, 255)');
  });

  it('rotates 180deg when rotate is true', () => {
    render(<Divider rotate height="100px" width="2px" />);
    const divider = screen.getByTestId('divider');
    expect(divider.style.transform).toBe('rotate(180deg)');
  });

  it('merges custom className', () => {
    render(<Divider className="my-divider" />);
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveClass('divider', 'my-divider');
  });

  it('spreads extra props onto the element', () => {
    render(<Divider id="separator" aria-hidden="true" />);
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveAttribute('id', 'separator');
    expect(divider).toHaveAttribute('aria-hidden', 'true');
  });
});
