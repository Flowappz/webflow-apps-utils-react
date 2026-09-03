/**
 * Convert a color name to a hex value
 * @param colorName - The color name to convert
 * @returns The hex value of the color
 */
export function colorNameToHex(colorName: string): string | null {
  const tempDiv = document.createElement('div');
  tempDiv.style.color = colorName;
  document.body.appendChild(tempDiv);

  const rgbColor = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);

  const match = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    const toHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } else {
    return null;
  }
}

/**
 * Normalize a hex value
 * @param value - The hex value to normalize
 * @returns The normalized hex value
 */
export function normalizeHex(value: string): string {
  let v = value.trim();

  if (!v.startsWith('#')) {
    const hex = colorNameToHex(v);
    if (hex) v = hex;
    else v = `#${v}`;
  }

  // Expand 3-digit hex to 6-digit
  if (/^#[A-Fa-f0-9]{3}$/.test(v)) {
    v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
  }

  // Only accept valid 6-digit hex
  if (/^#[A-Fa-f0-9]{6}$/.test(v)) {
    return v.toUpperCase();
  }

  return value;
}
