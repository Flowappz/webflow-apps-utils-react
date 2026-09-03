import { useState } from 'react';

import ColorPicker from './ColorPicker';
import type { ColorObject } from './ColorSelect';

export interface ColorPickerWrapperProps {
  initialColor?: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  oncolorchange?: (fullColor: any) => void;
}

export const ColorPickerWrapper = ({
  initialColor = '#000000',
  oncolorchange,
}: ColorPickerWrapperProps) => {
  const [color, setColor] = useState(initialColor);

  function handleColorChange(fullColor: ColorObject) {
    setColor(fullColor.hex);
    oncolorchange?.(fullColor);
  }

  return (
    <>
      <label htmlFor="color-input">Color hex value</label>
      <ColorPicker
        id="color-input"
        color={color}
        onColorChange={setColor}
        oncolorchange={handleColorChange}
      />
    </>
  );
};

export default ColorPickerWrapper;
