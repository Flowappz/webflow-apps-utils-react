import { useEffect, useReducer, useRef } from 'react';

import { normalizeHex } from '../../utils/color-utils';

import './ColorSelect.css';

// Color object type definition
export interface ColorObject {
  hex: string;
  rgb: { r: number; g: number; b: number; value: string };
  rgba: { r: number; g: number; b: number; a: number; value: string };
  hsb: { h: number; s: number; b: number; value: string };
  alpha: number;
}

export interface ColorSelectProps {
  color?: string;
  /** Controlled-color change callback (React equivalent of Svelte's `bind:color`). */
  onColorChange?: (color: string) => void;
  oncolorchange?: (fullColor: ColorObject) => void;
  ondragend?: () => void;
}

// Color conversion utilities (pure helpers)
function hsbToRgb(h: number, s: number, b: number): [number, number, number] {
  h = h / 360;
  s = s / 100;
  b = b / 100;
  const c = b * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = b - c;
  let r = 0,
    g = 0,
    bl = 0;

  if (0 <= h && h < 1 / 6) {
    r = c;
    g = x;
    bl = 0;
  } else if (1 / 6 <= h && h < 2 / 6) {
    r = x;
    g = c;
    bl = 0;
  } else if (2 / 6 <= h && h < 3 / 6) {
    r = 0;
    g = c;
    bl = x;
  } else if (3 / 6 <= h && h < 4 / 6) {
    r = 0;
    g = x;
    bl = c;
  } else if (4 / 6 <= h && h < 5 / 6) {
    r = x;
    g = 0;
    bl = c;
  } else if (5 / 6 <= h && h < 1) {
    r = c;
    g = 0;
    bl = x;
  }

  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((bl + m) * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

function hexToRgb(hex: string): [number, number, number] {
  // Handle different hex formats
  let normalizedHex = hex;
  if (hex.startsWith('#')) {
    // Expand 3-digit hex to 6-digit
    if (hex.length === 4) {
      normalizedHex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    // Remove alpha channel if present (8-digit hex)
    if (hex.length === 9) {
      normalizedHex = hex.substring(0, 7);
    }
  }

  const r = parseInt(normalizedHex.slice(1, 3), 16);
  const g = parseInt(normalizedHex.slice(3, 5), 16);
  const b = parseInt(normalizedHex.slice(5, 7), 16);

  return [r, g, b];
}

function hexToHsb(hex: string): [number, number, number] {
  // Handle different hex formats
  let normalizedHex = hex;
  if (hex.startsWith('#')) {
    // Expand 3-digit hex to 6-digit
    if (hex.length === 4) {
      normalizedHex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    // Remove alpha channel if present (8-digit hex)
    if (hex.length === 9) {
      normalizedHex = hex.substring(0, 7);
    }
  }

  const r = parseInt(normalizedHex.slice(1, 3), 16) / 255;
  const g = parseInt(normalizedHex.slice(3, 5), 16) / 255;
  const b = parseInt(normalizedHex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

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
  return [h, Math.round(s * 100), Math.round(v * 100)];
}

function rgbToHsb(r: number, g: number, b: number): [number, number, number] {
  return hexToHsb(rgbToHex(r, g, b));
}

// Color validation utility
function isValidColor(value: unknown): boolean {
  // Ensure value is a string
  if (typeof value !== 'string') {
    return false;
  }

  // Handle hex colors specifically
  if (value.startsWith('#')) {
    // Check for valid hex format: #RGB, #RRGGBB, #RRGGBBAA
    const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
    const result = hexRegex.test(value);
    return result;
  }

  // For non-hex colors, try to validate using canvas
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = value;
      return (
        ctx.fillStyle !== '#000000' || value === 'black' || value === '#000000' || value === '#000'
      );
    }
  } catch {
    // Fallback to regex for hex without #
    const hexRegex = /^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
    return hexRegex.test(value);
  }

  return false;
}

function getHexWithAlpha(hex: string, alpha: number): string {
  return alpha < 100
    ? hex +
        Math.round((alpha / 100) * 255)
          .toString(16)
          .padStart(2, '0')
          .toUpperCase()
    : hex;
}

function createColorObject(hex: string, alpha: number): ColorObject {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, brightness] = hexToHsb(hex);

  // Create hex with alpha channel if alpha < 100%
  const hexWithAlpha = getHexWithAlpha(hex, alpha);

  return {
    hex: hexWithAlpha,
    rgb: { r, g, b, value: `rgb(${r}, ${g}, ${b})` },
    rgba: { r, g, b, a: alpha, value: `rgba(${r}, ${g}, ${b}, ${alpha / 100})` },
    hsb: { h, s, b: brightness, value: `hsb(${h}, ${s}%, ${brightness}%)` },
    alpha,
  };
}

// Helper function to extract alpha value from hex color
function extractAlphaFromHex(hexColor: string): number {
  if (hexColor.startsWith('#') && hexColor.length === 9) {
    // 8-digit hex with alpha channel (#RRGGBBAA)
    const alphaHex = hexColor.slice(7, 9);
    const alphaValue = parseInt(alphaHex, 16);
    return Math.round((alphaValue / 255) * 100);
  }
  return 100; // Default to 100% opacity if no alpha channel
}

// Helper function to get hex without alpha channel
function getHexWithoutAlpha(hexColor: string): string {
  if (hexColor.startsWith('#') && hexColor.length === 9) {
    // Remove alpha channel from 8-digit hex
    return hexColor.slice(0, 7);
  }
  return hexColor;
}

/**
 * Calculate the position of the handle on the color bar
 */
function percentHandlePosition(value: number, min: number, max: number, range: number): number {
  return min + (value * (max - min)) / range;
}

const DRAG_THRESHOLD = 3; // pixels of movement before considering it a drag

interface ColorSelectModel {
  hue: number;
  saturation: number;
  brightness: number;
  alpha: number;
  hexValue: string;
  mode: 'HSB' | 'RGB';
  rgbRed: number;
  rgbGreen: number;
  rgbBlue: number;
  isDragging: boolean;
  dragTarget: 'well' | 'hue' | 'alpha' | null;
  dragStartPosition: { x: number; y: number } | null;
  hexInputValue: string;
  isHexEditing: boolean;
  prevHexValue: string;
  isInitialized: boolean;
}

export const ColorSelect = ({
  color = '#fff',
  onColorChange,
  oncolorchange,
  ondragend,
}: ColorSelectProps) => {
  // The Svelte source mutates local state synchronously from mouse handlers;
  // a mutable model ref plus a forced re-render keeps that behavior 1:1.
  const [, forceRender] = useReducer((x: number) => x + 1, 0);
  const model = useRef<ColorSelectModel>({
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 100,
    hexValue: color,
    mode: 'HSB',
    rgbRed: 0,
    rgbGreen: 0,
    rgbBlue: 0,
    isDragging: false,
    dragTarget: null,
    dragStartPosition: null,
    hexInputValue: '',
    isHexEditing: false,
    prevHexValue: '',
    isInitialized: false,
  });
  const m = model.current;

  // Keep the latest callbacks reachable from document-level listeners
  const callbacksRef = useRef({ onColorChange, oncolorchange, ondragend });
  callbacksRef.current = { onColorChange, oncolorchange, ondragend };

  // DOM references
  const colorWell = useRef<HTMLDivElement>(null);
  const colorPicker = useRef<HTMLDivElement>(null);
  const hueBar = useRef<HTMLDivElement>(null);
  const alphaBar = useRef<HTMLDivElement>(null);

  function setColor(newColor: string) {
    callbacksRef.current.onColorChange?.(newColor);
  }

  function emitColorChange(hex: string, alpha: number) {
    const colorObject = createColorObject(hex, alpha);
    callbacksRef.current.oncolorchange?.(colorObject);
  }

  // Helper function to normalize color input to hex
  function normalizeColorToHex(colorInput: string): string {
    // If it's already a valid hex, normalize it
    if (colorInput.startsWith('#')) {
      return normalizeHex(colorInput);
    }

    // For named colors, use a canvas to convert to hex
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = colorInput;
      const computedColor = ctx.fillStyle;
      // ctx.fillStyle returns hex format for valid colors
      if (typeof computedColor === 'string' && computedColor.startsWith('#')) {
        return computedColor.toUpperCase();
      }
    }

    // Fallback to original value if conversion fails
    return normalizeHex(colorInput);
  }

  function updateColorPickerPosition() {
    if (!colorPicker.current || !colorWell.current) return;
    const wellRect = colorWell.current.getBoundingClientRect();
    const x = (m.saturation / 100) * wellRect.width;
    const y = ((100 - m.brightness) / 100) * wellRect.height;
    colorPicker.current.style.left = `${x - 6}px`;
    colorPicker.current.style.top = `${y - 6}px`;
  }

  // Update functions
  function updateColor() {
    let r, g, b;
    if (m.mode === 'HSB') {
      [r, g, b] = hsbToRgb(m.hue, m.saturation, m.brightness);
    } else {
      r = m.rgbRed;
      g = m.rgbGreen;
      b = m.rgbBlue;
    }

    m.hexValue = rgbToHex(r, g, b).toUpperCase();
    const hexWithAlpha = getHexWithAlpha(m.hexValue, m.alpha);
    setColor(hexWithAlpha);
    emitColorChange(m.hexValue, m.alpha);
    updateColorPickerPosition();
  }

  function syncModeValues(newMode: 'HSB' | 'RGB') {
    if (newMode === 'RGB') {
      [m.rgbRed, m.rgbGreen, m.rgbBlue] = hsbToRgb(m.hue, m.saturation, m.brightness);
    } else {
      [m.hue, m.saturation, m.brightness] = rgbToHsb(m.rgbRed, m.rgbGreen, m.rgbBlue);
    }
  }

  function toggleMode() {
    m.mode = m.mode === 'HSB' ? 'RGB' : 'HSB';
    syncModeValues(m.mode);
    forceRender();
  }

  function handleColorWellInteraction(event: MouseEvent | React.MouseEvent) {
    if (!colorWell.current) return;
    const rect = colorWell.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));

    // Always update HSB values first
    m.saturation = Math.round((x / rect.width) * 100) || 0;
    m.brightness = Math.round(100 - (y / rect.height) * 100) || 0;

    // If in RGB mode, sync the RGB values with the new HSB values
    if (m.mode === 'RGB') {
      [m.rgbRed, m.rgbGreen, m.rgbBlue] = hsbToRgb(m.hue, m.saturation, m.brightness);
    }

    updateColor();
    updateColorPickerPosition();
    forceRender();
  }

  function handleHueBarInteraction(event: MouseEvent | React.MouseEvent) {
    if (!hueBar.current) return;
    const rect = hueBar.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));

    // Always update HSB hue first
    m.hue = Math.round((x / rect.width) * 360) || 0;

    // If in RGB mode, sync the RGB values with the new HSB values
    if (m.mode === 'RGB') {
      [m.rgbRed, m.rgbGreen, m.rgbBlue] = hsbToRgb(m.hue, m.saturation, m.brightness);
    }

    updateColor();
    forceRender();
  }

  function handleAlphaBarInteraction(event: MouseEvent | React.MouseEvent) {
    if (!alphaBar.current) return;

    const rect = alphaBar.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));

    let newAlpha = Math.round((x / rect.width) * 100);

    if (isNaN(newAlpha) || typeof newAlpha !== 'number') newAlpha = 100;

    m.alpha = newAlpha;

    updateColor();
    forceRender();
  }

  function handleHexFocus() {
    m.prevHexValue = m.hexValue;
    m.hexInputValue = m.hexValue;
    m.isHexEditing = true;
    forceRender();
  }

  function handleHexInput(event: React.ChangeEvent<HTMLInputElement>) {
    m.hexInputValue = event.target.value;
    forceRender();
  }

  function handleHexBlur() {
    m.isHexEditing = false;
    const value = m.hexInputValue.trim();

    if (!value || !isValidColor(value)) {
      // Restore the previous valid value
      m.hexInputValue = m.prevHexValue;
      forceRender();
      return;
    }
    const normalizedValue = value.startsWith('#') ? value : `#${value}`;

    m.hexValue = normalizedValue.toUpperCase();

    const hexWithAlpha = getHexWithAlpha(m.hexValue, m.alpha);
    setColor(hexWithAlpha);
    emitColorChange(m.hexValue, m.alpha);
    m.prevHexValue = m.hexValue;

    const hsb = hexToHsb(m.hexValue);

    if (Array.isArray(hsb)) {
      const [h, s, b] = hsb;
      m.hue = h;
      m.saturation = s;
      m.brightness = b;
      const rgb = hsbToRgb(m.hue, m.saturation, m.brightness);
      if (Array.isArray(rgb)) {
        [m.rgbRed, m.rgbGreen, m.rgbBlue] = rgb;
      }
    }
    updateColorPickerPosition();
    forceRender();
  }

  function handleHexKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  }

  // Mouse event handlers with improved drag detection
  function handleMouseDown(event: React.MouseEvent, target: 'well' | 'hue' | 'alpha') {
    // Record the starting position for drag detection
    m.dragStartPosition = { x: event.clientX, y: event.clientY };

    // Always handle the initial interaction
    if (target === 'well') {
      handleColorWellInteraction(event);
    } else if (target === 'hue') {
      handleHueBarInteraction(event);
    } else if (target === 'alpha') {
      handleAlphaBarInteraction(event);
    }
  }

  // EyeDropper API handler
  async function handleEyedropper() {
    if ('EyeDropper' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          m.hexValue = result.sRGBHex.toUpperCase();
          const hexWithAlpha = getHexWithAlpha(m.hexValue, m.alpha);
          setColor(hexWithAlpha);
          emitColorChange(m.hexValue, m.alpha);
          const [h, s, b] = hexToHsb(m.hexValue);
          m.hue = h;
          m.saturation = s;
          m.brightness = b;
          [m.rgbRed, m.rgbGreen, m.rgbBlue] = hsbToRgb(m.hue, m.saturation, m.brightness);
          updateColorPickerPosition();
          forceRender();
        }
      } catch {
        // User cancelled or error
      }
    } else {
      alert('EyeDropper API is not supported in this browser.');
    }
  }

  // Watch for prop changes
  useEffect(() => {
    // Skip effect during initial mount to prevent overriding alpha
    if (!m.isInitialized) return;

    const normalized = normalizeColorToHex(color);
    // Extract alpha value from the original color if it has an alpha channel
    const alphaFromColor = extractAlphaFromHex(color);

    // Use hex without alpha for internal processing
    const hexWithoutAlpha = getHexWithoutAlpha(normalized);
    if (hexWithoutAlpha !== m.hexValue) {
      m.hexValue = hexWithoutAlpha;
      const [h, s, b] = hexToHsb(m.hexValue);
      m.hue = h;
      m.saturation = s;
      m.brightness = b;
      [m.rgbRed, m.rgbGreen, m.rgbBlue] = hsbToRgb(m.hue, m.saturation, m.brightness);
      // Force position update after state changes
      setTimeout(() => updateColorPickerPosition(), 0);
      forceRender();
    }

    // Only update alpha if it's different from current alpha
    if (alphaFromColor !== m.alpha) {
      m.alpha = alphaFromColor;
      forceRender();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  // Mount effect
  useEffect(() => {
    const normalized = normalizeColorToHex(color);
    // Extract alpha value from the original color if it has an alpha channel
    const alphaFromColor = extractAlphaFromHex(color);
    m.alpha = alphaFromColor;

    // Use hex without alpha for internal processing
    m.hexValue = getHexWithoutAlpha(normalized);
    const [h, s, b] = hexToHsb(m.hexValue);
    m.hue = h;
    m.saturation = s;
    m.brightness = b;
    [m.rgbRed, m.rgbGreen, m.rgbBlue] = hsbToRgb(m.hue, m.saturation, m.brightness);

    console.log('ColorSelect mounted', { color, alpha: alphaFromColor });
    updateColor();
    // Delay position update to ensure DOM is ready
    setTimeout(() => updateColorPickerPosition(), 5);

    function handleMouseMove(event: MouseEvent) {
      if (!m.dragStartPosition) return;

      // Calculate distance moved
      const deltaX = Math.abs(event.clientX - m.dragStartPosition.x);
      const deltaY = Math.abs(event.clientY - m.dragStartPosition.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // If we haven't started dragging yet and we've moved beyond threshold
      if (!m.isDragging && distance > DRAG_THRESHOLD) {
        m.isDragging = true;
        // Determine drag target based on which element was initially clicked
        if (m.dragTarget === null) {
          // This shouldn't happen, but fallback to well
          m.dragTarget = 'well';
        }
      }

      // If we're dragging, handle the interaction
      if (m.isDragging && m.dragTarget) {
        if (m.dragTarget === 'well') {
          handleColorWellInteraction(event);
        } else if (m.dragTarget === 'hue') {
          handleHueBarInteraction(event);
        } else if (m.dragTarget === 'alpha') {
          handleAlphaBarInteraction(event);
        }
      }
    }

    function handleMouseUp() {
      // If we were dragging, this is the end of the drag
      if (m.isDragging) {
        m.isDragging = false;
        m.dragTarget = null;
        // Signal that a drag operation just ended
        callbacksRef.current.ondragend?.();
      }

      // Reset drag detection state
      m.dragStartPosition = null;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Mark as initialized after setting up the initial state
    m.isInitialized = true;
    forceRender();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Always update the color well and picker position after renders
  useEffect(() => {
    updateColorPickerPosition();
  });

  const displayedHexInput = m.isHexEditing ? m.hexInputValue : m.hexValue;

  return (
    // Root class renamed from `color-picker` to `color-select`: with Svelte's
    // style scoping gone it would collide with ColorPicker's root class.
    <div className="color-select">
      <div className="color-picker__container">
        {/* Color Well */}
        <div
          className="color-well"
          tabIndex={0}
          ref={colorWell}
          onMouseDown={(e) => {
            m.dragTarget = 'well';
            handleMouseDown(e, 'well');
          }}
          role="button"
          aria-label="Color selection well"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0), black), linear-gradient(to right, white, rgba(255, 255, 255, 0)) rgb(${hsbToRgb(m.hue, 100, 100).join(',')})`,
          }}
        >
          <div className="color-well__picker" ref={colorPicker}></div>
        </div>

        {/* Color Bars Section */}
        <div className="color-bars">
          <button
            className="eyedropper-btn"
            type="button"
            onPointerDown={() => {
              handleEyedropper();
            }}
            aria-label="Pick color from screen"
          >
            <div className="eyedropper-btn__icon">
              <svg
                data-wf-icon="EyedropperMediumIcon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.85355 4.14664C6.65829 4.3419 6.65829 4.65848 6.85355 4.85374L11.1464 9.14664C11.3417 9.3419 11.6583 9.3419 11.8536 9.14664L12.1464 8.85374C12.3417 8.65848 12.3417 8.3419 12.1464 8.14664L11 7.00019L12.75 5.25019C13.4404 4.55983 13.4404 3.44055 12.75 2.75019C12.0596 2.05983 10.9404 2.05983 10.25 2.75019L8.5 4.50019L7.85355 3.85374C7.65829 3.65848 7.34171 3.65848 7.14645 3.85374L6.85355 4.14664Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M3 12.0002L2.5 12.5002L3.5 13.5002L4 13.0002H5L9 9.00019L7 7.00019L3 11.0002V12.0002Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </button>

          <div className="color-bars__container">
            {/* Hue Bar */}
            <div className="color-bar">
              <div
                className="color-bar__hue"
                ref={hueBar}
                onMouseDown={(e) => {
                  m.dragTarget = 'hue';
                  handleMouseDown(e, 'hue');
                }}
                role="slider"
                aria-label="Hue slider"
                aria-valuenow={m.hue}
                aria-valuemin={0}
                aria-valuemax={360}
                tabIndex={0}
                style={{ pointerEvents: 'auto', position: 'relative' }}
              >
                <div
                  className="color-bar__hue-handle color-bar__handle"
                  style={{ left: `${percentHandlePosition(m.hue, 2, 98, 360)}%` }}
                ></div>
              </div>
            </div>

            {/* Alpha Bar */}
            <div className="color-bar">
              <div
                className="color-bar__alpha"
                ref={alphaBar}
                onMouseDown={(e) => {
                  m.dragTarget = 'alpha';
                  handleMouseDown(e, 'alpha');
                }}
                role="slider"
                aria-label="Alpha slider"
                aria-valuenow={m.alpha}
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
                style={{ pointerEvents: 'auto', position: 'relative' }}
              >
                <div className="color-bar__alpha-bg" style={{ pointerEvents: 'none' }}></div>
                <div
                  className="color-bar__alpha-gradient"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, rgba(${hsbToRgb(m.hue, m.saturation, m.brightness).join(',')},1) 100%)`,
                    pointerEvents: 'none',
                  }}
                ></div>
                <div
                  className="color-bar__alpha-handle color-bar__handle"
                  style={{ left: `${percentHandlePosition(m.alpha, 2, 98, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* Controls Section */}
        <div className="controls">
          {/* Hex Input */}
          <div className="control-group">
            <div className="input-wrapper">
              <input
                id="hex-input"
                type="text"
                className="input input--hex"
                value={displayedHexInput}
                onChange={handleHexInput}
                onFocus={handleHexFocus}
                onBlur={handleHexBlur}
                onKeyDown={handleHexKeydown}
                placeholder="#000000"
              />
            </div>
            <label className="label" htmlFor="hex-input">
              HEX
            </label>
          </div>

          {/* HSB/RGB Inputs */}
          <div className="control-group control-group--main">
            <div className="input-row">
              <div className="input-wrapper">
                <input
                  className="input input--number"
                  value={m.mode === 'HSB' ? m.hue : m.rgbRed}
                  min={0}
                  max={m.mode === 'HSB' ? 360 : 255}
                  role="spinbutton"
                  aria-label={m.mode === 'HSB' ? 'Hue' : 'Red'}
                  onChange={(e) => {
                    const target = e.target;
                    if (!target) return;
                    if (m.mode === 'HSB') {
                      m.hue = +target.value;
                    } else {
                      m.rgbRed = +target.value;
                    }
                    updateColor();
                    forceRender();
                  }}
                />
              </div>
              <div className="input-wrapper">
                <input
                  className="input input--number"
                  value={m.mode === 'HSB' ? m.saturation : m.rgbGreen}
                  min={0}
                  max={m.mode === 'HSB' ? 100 : 255}
                  role="spinbutton"
                  aria-label={m.mode === 'HSB' ? 'Saturation' : 'Green'}
                  onChange={(e) => {
                    const target = e.target;
                    if (!target) return;
                    if (m.mode === 'HSB') {
                      m.saturation = +target.value;
                    } else {
                      m.rgbGreen = +target.value;
                    }
                    updateColor();
                    forceRender();
                  }}
                />
              </div>
              <div className="input-wrapper">
                <input
                  className="input input--number"
                  value={m.mode === 'HSB' ? m.brightness : m.rgbBlue}
                  min={0}
                  max={m.mode === 'HSB' ? 100 : 255}
                  role="spinbutton"
                  aria-label={m.mode === 'HSB' ? 'Brightness' : 'Blue'}
                  onChange={(e) => {
                    const target = e.target;
                    if (!target) return;
                    if (m.mode === 'HSB') {
                      m.brightness = +target.value;
                    } else {
                      m.rgbBlue = +target.value;
                    }
                    updateColor();
                    forceRender();
                  }}
                />
              </div>
            </div>

            <div className="label-row--wrapper">
              <div
                className="label-row"
                onPointerDown={toggleMode}
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
                aria-label="Mode toggle"
              >
                <span className="label label--clickable">{m.mode === 'HSB' ? 'H' : 'R'}</span>
                <span className="label label--clickable">{m.mode === 'HSB' ? 'S' : 'G'}</span>
                <span className="label label--clickable">{m.mode === 'HSB' ? 'B' : 'B'}</span>
              </div>
            </div>
          </div>

          {/* Alpha Input */}
          <div className="control-group">
            <div className="input-wrapper">
              <input
                className="input input--number"
                value={m.alpha}
                min={0}
                max={100}
                role="spinbutton"
                aria-label="Alpha"
                onChange={(e) => {
                  const target = e.target;
                  if (!target) return;
                  let newAlpha = +target.value;
                  if (isNaN(newAlpha) || typeof newAlpha !== 'number') newAlpha = 100;
                  m.alpha = newAlpha;
                  emitColorChange(m.hexValue, m.alpha);
                  forceRender();
                }}
              />
            </div>
            <span className="label">A</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSelect;
