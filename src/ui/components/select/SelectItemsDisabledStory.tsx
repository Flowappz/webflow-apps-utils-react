import './SelectItemsDisabledStory.css';

import { useState } from 'react';

import { Select } from './Select';
import type { SelectOption } from './types';

interface Props {
  options: SelectOption[];
  defaultText?: string;
  dropdownWidth?: string;
  dropdownHeight?: string;
  enableSearch?: boolean;
}

export const SelectItemsDisabledStory = ({
  options: initialOptions,
  defaultText = 'Select',
  dropdownWidth = '200px',
  dropdownHeight = '200px',
  enableSearch = false,
}: Props) => {
  const [itemsDisabled, setItemsDisabled] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<SelectOption[]>(initialOptions);
  const [selected, setSelected] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Idle');

  const handleOpen = () => {
    setItemsDisabled(true);
    setStatusText('Refreshing items...');

    // Simulate an async refresh (e.g. fetching updated options from an API)
    setTimeout(() => {
      setCurrentOptions([
        { label: 'Refreshed Option A', value: 'refreshed-a' },
        { label: 'Refreshed Option B', value: 'refreshed-b' },
        { label: 'Refreshed Option C', value: 'refreshed-c' },
        { label: 'Refreshed Option D', value: 'refreshed-d' },
      ]);
      setItemsDisabled(false);
      setStatusText('Items refreshed!');
    }, 4000);
  };

  return (
    <div className="select-items-disabled-story story-container">
      <div className="status">Status: {statusText}</div>
      <Select
        options={currentOptions}
        defaultText={defaultText}
        dropdownWidth={dropdownWidth}
        dropdownHeight={dropdownHeight}
        enableSearch={enableSearch}
        itemsDisabled={itemsDisabled}
        itemsDisabledMessage="Refreshing items..."
        onOpen={handleOpen}
        selected={selected}
        onSelectedChange={setSelected}
      />
      <div className="info">
        Open the dropdown to trigger a simulated 2s refresh. Items will be disabled during the
        refresh.
      </div>
    </div>
  );
};

export default SelectItemsDisabledStory;
