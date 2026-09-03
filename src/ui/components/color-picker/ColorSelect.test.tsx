import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ColorSelect } from './ColorSelect';

describe('ColorSelect', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('renders the color well, sliders and inputs', () => {
    render(<ColorSelect color="#ff0000" />);

    expect(screen.getByLabelText('Color selection well')).toBeInTheDocument();
    expect(screen.getByLabelText('Hue slider')).toBeInTheDocument();
    expect(screen.getByLabelText('Alpha slider')).toBeInTheDocument();
    expect(screen.getByLabelText('Pick color from screen')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('#000000')).toBeInTheDocument();
  });

  it('initializes from the color prop and emits the initial color object', () => {
    const oncolorchange = vi.fn();
    render(<ColorSelect color="#ff0000" oncolorchange={oncolorchange} />);

    // updateColor() runs on mount
    expect(oncolorchange).toHaveBeenCalled();
    const fullColor = oncolorchange.mock.calls.at(-1)?.[0];
    expect(fullColor.hex).toBe('#FF0000');
    expect(fullColor.hsb.h).toBe(0);
    expect(fullColor.hsb.s).toBe(100);
    expect(fullColor.hsb.b).toBe(100);

    const hexInput = screen.getByPlaceholderText('#000000') as HTMLInputElement;
    expect(hexInput.value).toBe('#FF0000');
  });

  it('emits color change callbacks when a valid hex is entered', async () => {
    const oncolorchange = vi.fn();
    const onColorChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ColorSelect color="#ff0000" oncolorchange={oncolorchange} onColorChange={onColorChange} />
    );

    const hexInput = screen.getByPlaceholderText('#000000');
    await user.clear(hexInput);
    await user.type(hexInput, '#00ff00');
    await user.tab(); // blur commits the value

    const fullColor = oncolorchange.mock.calls.at(-1)?.[0];
    expect(fullColor.hex).toBe('#00FF00');
    expect(fullColor.rgb).toEqual({ r: 0, g: 255, b: 0, value: 'rgb(0, 255, 0)' });
    expect(onColorChange).toHaveBeenLastCalledWith('#00FF00');
  });

  it('restores the previous value when an invalid hex is entered', async () => {
    const user = userEvent.setup();
    render(<ColorSelect color="#ff0000" />);

    const hexInput = screen.getByPlaceholderText('#000000') as HTMLInputElement;
    await user.clear(hexInput);
    await user.type(hexInput, 'nonsense');
    await user.tab();

    expect(hexInput.value).toBe('#FF0000');
  });

  it('updates the alpha channel and includes it in the emitted hex', () => {
    const oncolorchange = vi.fn();
    render(<ColorSelect color="#ff0000" oncolorchange={oncolorchange} />);

    const alphaInput = screen.getByLabelText('Alpha');
    fireEvent.change(alphaInput, { target: { value: '50' } });

    const fullColor = oncolorchange.mock.calls.at(-1)?.[0];
    expect(fullColor.alpha).toBe(50);
    expect(fullColor.hex).toBe('#FF000080');
    expect(fullColor.rgba.a).toBe(50);
  });

  it('extracts the alpha channel from an 8-digit hex color prop', () => {
    render(<ColorSelect color="#FF000080" />);

    const alphaInput = screen.getByLabelText('Alpha') as HTMLInputElement;
    expect(alphaInput.value).toBe('50');
  });

  it('toggles between HSB and RGB modes', () => {
    render(<ColorSelect color="#ff0000" />);

    expect(screen.getByLabelText('Hue')).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByLabelText('Mode toggle'));

    expect(screen.getByLabelText('Red')).toBeInTheDocument();
    expect(screen.getByLabelText('Green')).toBeInTheDocument();
    expect(screen.getByLabelText('Blue')).toBeInTheDocument();

    const redInput = screen.getByLabelText('Red') as HTMLInputElement;
    expect(redInput.value).toBe('255');
  });

  it('updates the color from the HSB number inputs', () => {
    const oncolorchange = vi.fn();
    render(<ColorSelect color="#ff0000" oncolorchange={oncolorchange} />);

    fireEvent.change(screen.getByLabelText('Hue'), { target: { value: '120' } });

    const fullColor = oncolorchange.mock.calls.at(-1)?.[0];
    expect(fullColor.hex).toBe('#00FF00');
  });

  it('notifies ondragend when a drag ends', () => {
    const ondragend = vi.fn();
    render(<ColorSelect color="#ff0000" ondragend={ondragend} />);

    const hueSlider = screen.getByLabelText('Hue slider');
    fireEvent.mouseDown(hueSlider, { clientX: 10, clientY: 5 });
    fireEvent.mouseMove(document, { clientX: 40, clientY: 5 });
    fireEvent.mouseUp(document);

    expect(ondragend).toHaveBeenCalledTimes(1);
  });
});
