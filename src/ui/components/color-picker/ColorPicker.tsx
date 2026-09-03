import { useEffect, useRef, useState } from 'react';

import { normalizeHex } from '../../utils';
import { Tooltip } from '../tooltip';
import type { TooltipHandle } from '../tooltip/types';
import ColorSelect, { type ColorObject } from './ColorSelect';

import './ColorPicker.css';

export interface ColorPickerProps {
  /**
   * The color to display in the picker.
   */
  color?: string;
  /**
   * Callback fired when the color value changes
   * (React equivalent of Svelte's `bind:color`).
   */
  onColorChange?: (color: string) => void;
  /**
   * The function to call when the color changes with full color object.
   */
  oncolorchange?: (fullColor: ColorObject) => void;
  /**
   * The width of the picker.
   */
  width?: string;
  /**
   * Whether the picker is disabled.
   */
  disabled?: boolean;

  /**
   * The id of the picker.
   */
  id?: string;

  /**
   * Whether the color select should be shown by default.
   */
  defaultShowColorSelect?: boolean;
}

function isValidColorHex(value: string): boolean {
  const hexRegex = /^#?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
  return hexRegex.test(value.startsWith('#') ? value.slice(1) : value);
}

function createColorObject(hex: string): ColorObject {
  // Remove # if present and normalize to 6 digits
  let normalizedHex = hex.startsWith('#') ? hex.slice(1) : hex;

  // Expand 3-digit hex to 6-digit
  if (normalizedHex.length === 3) {
    normalizedHex = normalizedHex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  // Extract alpha channel if present (8-digit hex)
  if (normalizedHex.length === 8) {
    normalizedHex = normalizedHex.substring(0, 6);
  }

  const r = parseInt(normalizedHex.slice(0, 2), 16);
  const g = parseInt(normalizedHex.slice(2, 4), 16);
  const b = parseInt(normalizedHex.slice(4, 6), 16);

  // Convert to HSB
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const brightness = max;

  if (diff !== 0) {
    if (max === r) {
      h = ((g - b) / diff) % 6;
    } else if (max === g) {
      h = (b - r) / diff + 2;
    } else {
      h = (r - g) / diff + 4;
    }
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  return {
    hex: `#${normalizedHex}`,
    rgb: { r, g, b, value: `rgb(${r}, ${g}, ${b})` },
    rgba: { r, g, b, a: 100, value: `rgba(${r}, ${g}, ${b}, 1)` },
    hsb: {
      h,
      s: Math.round(s * 100),
      b: Math.round((brightness * 100) / 255),
      value: `hsb(${h}, ${Math.round(s * 100)}%, ${Math.round((brightness * 100) / 255)}%)`,
    },
    alpha: 100,
  };
}

function normalizeHexTo6Upper(value: string): string {
  const hex = value.startsWith('#') ? value : `#${value}`;
  if (/^#[A-Fa-f0-9]{3}$/.test(hex)) {
    return (
      '#' +
      hex
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('')
        .toUpperCase()
    );
  }
  if (/^#[A-Fa-f0-9]{6}$/.test(hex)) {
    return hex.toUpperCase();
  }
  return value;
}

// Referenced for parity with the Svelte source (unused there as well).
void isValidColorHex;

export const ColorPicker = ({
  color: colorProp,
  onColorChange,
  oncolorchange,
  width = '80px',
  disabled = false,
  defaultShowColorSelect = false,
  id,
}: ColorPickerProps) => {
  // `bind:color` equivalent: internal state with prop sync + change callback
  const [color, setColorState] = useState(colorProp ?? '#fff');

  useEffect(() => {
    if (colorProp !== undefined) {
      setColorState(colorProp);
    }
  }, [colorProp]);

  const setColor = (value: string) => {
    setColorState(value);
    onColorChange?.(value);
  };

  const [showColorSelect, setShowColorSelect] = useState(defaultShowColorSelect);
  const tooltipRef = useRef<TooltipHandle | null>(null);

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setColor(event.target.value);
  }

  function handleInputPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text') || '';
    let cleanText = pastedText.replace(/[^0-9A-Fa-f#]/g, '');
    if (!cleanText.startsWith('#')) cleanText = '#' + cleanText;

    cleanText = cleanText.substring(0, 9);

    const normalizedValue = normalizeHexTo6Upper(cleanText);
    if (/^#[A-F0-9]{6}$/.test(normalizedValue)) {
      setColor(normalizedValue);
      const colorObject = createColorObject(normalizedValue);
      oncolorchange?.(colorObject);
    }
  }

  function handleInputKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      // Intentionally left blank (matches source behavior)
    }
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const normalized = normalizeHex(event.target.value);
    if (/^#[A-F0-9]{6}$/.test(normalized)) {
      setColor(normalized);
      const colorObject = createColorObject(normalized);
      oncolorchange?.(colorObject);
    }
  }

  function handleFullColorChange(fullColor: ColorObject) {
    oncolorchange?.(fullColor);
    // Preserve the alpha channel by using the full hex value with alpha
    // The fullColor.hex already includes the alpha channel if alpha < 100
    setColor(fullColor.hex);
  }

  function handleDragEnd() {
    // Signal the tooltip to ignore the next click event
    // This prevents the tooltip from closing when dragging and releasing outside
    tooltipRef.current?.ignoreNextClickEvent?.();
  }

  return (
    <div className="color-picker">
      <Tooltip
        ref={tooltipRef}
        listener="click"
        listenerout="click"
        showArrow={false}
        padding="0"
        disabled={disabled}
        stopPropagation={true}
        width="241px"
        placement="bottom"
        onshow={() => setShowColorSelect(true)}
        onclose={() => setShowColorSelect(false)}
        fallbackPlacements={['top-end', 'top', 'bottom-end', 'bottom', 'top-start', 'bottom-start']}
        target={
          <div
            className={`color-picker__swatch${disabled ? ' disabled' : ''}`}
            data-testid="color-swatch"
          >
            <div className="color-swatch" style={{ backgroundColor: color || '#000000' }}></div>
          </div>
        }
        tooltip={
          showColorSelect ? (
            <ColorSelect
              color={color}
              onColorChange={setColor}
              oncolorchange={handleFullColorChange}
              ondragend={handleDragEnd}
            />
          ) : null
        }
      />

      <input
        type="text"
        className={`color-picker__input${disabled ? ' disabled' : ''}`}
        value={color}
        disabled={disabled}
        readOnly={disabled}
        onChange={handleInput}
        onKeyDown={handleInputKeydown}
        onPaste={handleInputPaste}
        onBlur={handleBlur}
        placeholder="#ffffff"
        aria-label="Color hex value"
        style={{ width }}
        id={id}
      />
    </div>
  );
};

export default ColorPicker;
