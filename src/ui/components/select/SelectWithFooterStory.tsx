import './SelectWithFooterStory.css';

import { useState } from 'react';

import { Select } from './Select';
import type { SelectOption } from './types';

interface Props {
  options: SelectOption[];
  defaultText?: string;
  dropdownWidth?: string;
  dropdownHeight?: string;
  selected?: string | null;
}

export const SelectWithFooterStory = ({
  options,
  defaultText = 'Select',
  dropdownWidth = '200px',
  dropdownHeight = '200px',
  selected: initialSelected = null,
}: Props) => {
  const [selected, setSelected] = useState<string | null>(initialSelected);

  const handleFooterClick = (close: () => void) => {
    console.log('Footer action clicked - adding a new provider manually');
    close();
  };

  return (
    <Select
      options={options}
      defaultText={defaultText}
      dropdownWidth={dropdownWidth}
      dropdownHeight={dropdownHeight}
      selected={selected}
      onSelectedChange={setSelected}
      footer={({ close }) => (
        <button type="button" className="footer-action" onClick={() => handleFooterClick(close)}>
          + Add manually a provider
        </button>
      )}
    />
  );
};

export default SelectWithFooterStory;
