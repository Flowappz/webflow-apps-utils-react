import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// The ui utils barrel pulls in `goto`, which depends on the cross-scope
// utils stores module — provide just what ColorPicker needs.
vi.mock('../../utils', async () => {
  const colorUtils = await import('../../utils/color-utils');
  return { ...colorUtils };
});

// Tooltip is a cross-scope component; render its target and tooltip inline.
vi.mock('../tooltip', async () => {
  const { forwardRef } = await import('react');
  const Tooltip = forwardRef<unknown, { target?: React.ReactNode; tooltip?: React.ReactNode }>(
    ({ target, tooltip }, _ref) => (
      <div data-testid="tooltip-mock">
        {target}
        <div data-testid="tooltip-content">{tooltip}</div>
      </div>
    )
  );
  return { Tooltip };
});

import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('renders the swatch and the hex input with the current color', () => {
    render(<ColorPicker color="#ff0000" />);

    const input = screen.getByLabelText('Color hex value') as HTMLInputElement;
    expect(input.value).toBe('#ff0000');
    expect(screen.getByTestId('color-swatch')).toBeInTheDocument();
  });

  it('defaults to #fff when no color is provided', () => {
    render(<ColorPicker />);
    const input = screen.getByLabelText('Color hex value') as HTMLInputElement;
    expect(input.value).toBe('#fff');
  });

  it('emits onColorChange while typing in the input', async () => {
    const onColorChange = vi.fn();
    const user = userEvent.setup();
    render(<ColorPicker color="#fff" onColorChange={onColorChange} />);

    const input = screen.getByLabelText('Color hex value');
    await user.click(input);
    await user.paste('#00ff00');

    expect(onColorChange).toHaveBeenCalled();
  });

  it('emits oncolorchange with the full color object on blur of a valid hex', async () => {
    const oncolorchange = vi.fn();
    const onColorChange = vi.fn();
    const user = userEvent.setup();
    render(<ColorPicker onColorChange={onColorChange} oncolorchange={oncolorchange} />);

    const input = screen.getByLabelText('Color hex value');
    await user.clear(input);
    await user.type(input, '#ff0000');
    await user.tab(); // blur

    expect(oncolorchange).toHaveBeenCalled();
    const fullColor = oncolorchange.mock.calls.at(-1)?.[0];
    expect(fullColor.hex).toBe('#FF0000');
    expect(fullColor.rgb).toEqual({ r: 255, g: 0, b: 0, value: 'rgb(255, 0, 0)' });
    expect(fullColor.alpha).toBe(100);
    expect(onColorChange).toHaveBeenLastCalledWith('#FF0000');
  });

  it('does not emit oncolorchange on blur of an invalid hex', async () => {
    const oncolorchange = vi.fn();
    const user = userEvent.setup();
    render(<ColorPicker oncolorchange={oncolorchange} />);

    const input = screen.getByLabelText('Color hex value');
    await user.clear(input);
    await user.type(input, '#zzz');
    await user.tab();

    expect(oncolorchange).not.toHaveBeenCalled();
  });

  it('normalizes and applies a pasted hex value', async () => {
    const oncolorchange = vi.fn();
    const onColorChange = vi.fn();
    const user = userEvent.setup();
    render(<ColorPicker onColorChange={onColorChange} oncolorchange={oncolorchange} />);

    const input = screen.getByLabelText('Color hex value');
    await user.click(input);
    await user.paste('#0f0');

    expect(onColorChange).toHaveBeenLastCalledWith('#00FF00');
    expect(oncolorchange).toHaveBeenCalled();
    expect(oncolorchange.mock.calls.at(-1)?.[0].hex).toBe('#00FF00');
  });

  it('disables the input when disabled', () => {
    render(<ColorPicker color="#ebebeb" disabled />);

    const input = screen.getByLabelText('Color hex value');
    expect(input).toBeDisabled();
    expect(screen.getByTestId('color-swatch')).toHaveClass('disabled');
  });

  it('syncs the internal value when the color prop changes', () => {
    const { rerender } = render(<ColorPicker color="#ff0000" />);
    rerender(<ColorPicker color="#0000ff" />);

    const input = screen.getByLabelText('Color hex value') as HTMLInputElement;
    expect(input.value).toBe('#0000ff');
  });
});
