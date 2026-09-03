import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../icons', () => {
  const Icon = () => <svg data-testid="bp-icon" />;
  return {
    DesktopWithStar: Icon,
    MobileLandscape: Icon,
    MobilePortrait: Icon,
    TabletPreview: Icon,
    XL: Icon,
    XXL: Icon,
    XXXL: Icon,
  };
});

vi.mock('../text', () => ({
  Text: ({ label, className }: { label?: string; className?: string }) => (
    <span className={className}>{label}</span>
  ),
}));

vi.mock('../switch', () => ({
  Switch: ({
    checked,
    disabled,
    onchange,
  }: {
    checked?: boolean;
    disabled?: boolean;
    onchange?: (event: { checked: boolean }) => void;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onchange?.({ checked: !checked })}
    >
      switch
    </button>
  ),
}));

import { BreakpointItem } from './BreakpointItem';
import { breakpointOptions } from './breakpointOptions';

describe('breakpointOptions', () => {
  it('contains all allowed breakpoints with labels and descriptions', () => {
    expect(Object.keys(breakpointOptions)).toEqual([
      '320',
      '480',
      '768',
      '991',
      '1280',
      '1440',
      '1920',
    ]);
    expect(breakpointOptions['768'].label).toBe('Tablet');
    expect(breakpointOptions['991'].description).toContain('Desktop settings apply');
  });
});

describe('BreakpointItem', () => {
  it('renders the breakpoint label and hides content when disabled', () => {
    render(
      <BreakpointItem breakpoint="768">
        <p>Tablet settings</p>
      </BreakpointItem>
    );

    expect(screen.getByText('Tablet')).toBeInTheDocument();
    const content = screen.getByText('Tablet settings').parentElement as HTMLElement;
    expect(content).toHaveClass('breakpoint-content');
    expect(content.style.display).toBe('none');
  });

  it('shows content when enabled', () => {
    render(
      <BreakpointItem breakpoint="320" enabled>
        <p>Mobile settings</p>
      </BreakpointItem>
    );

    const content = screen.getByText('Mobile settings').parentElement as HTMLElement;
    expect(content.style.display).toBe('flex');
  });

  it('toggles content and dispatches change when the switch is used', async () => {
    const onchange = vi.fn();
    const user = userEvent.setup();
    render(
      <BreakpointItem breakpoint="480" onchange={onchange}>
        <p>Landscape settings</p>
      </BreakpointItem>
    );

    await user.click(screen.getByRole('switch'));

    expect(onchange).toHaveBeenCalledWith({ breakpoint: '480', enabled: true });
    const content = screen.getByText('Landscape settings').parentElement as HTMLElement;
    expect(content.style.display).toBe('flex');
  });

  it('passes disabled to the switch', () => {
    render(<BreakpointItem breakpoint="991" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('syncs with the enabled prop', () => {
    const { rerender } = render(<BreakpointItem breakpoint="1280">c</BreakpointItem>);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

    rerender(
      <BreakpointItem breakpoint="1280" enabled>
        c
      </BreakpointItem>
    );
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});
