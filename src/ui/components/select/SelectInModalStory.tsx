import { useState } from 'react';

import { Button } from '../button';
import { Modal } from '../modal';
import { Select } from './Select';
import type { SelectOption } from './types';

interface Props {
  initialOpen?: boolean;
}

export const SelectInModalStory = ({ initialOpen = false }: Props) => {
  const [modalOpen, setModalOpen] = useState(initialOpen);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const options: SelectOption[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Option 4', value: 'option4' },
    { label: 'Option 5', value: 'option5' },
  ];

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Modal closing');
    setModalOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button onclick={handleOpenModal}>Open Modal with Select</Button>

      <Modal
        open={modalOpen}
        onOpenChange={(open) => {
          console.log('Modal onOpenChange:', open);
          setModalOpen(open);
        }}
        title="Select Example Inside Modal"
        showFooter={false}
        width="400px"
        closeOnOverlayClick={false}
        closeOnEscape={false}
      >
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text1)', margin: 0 }}>Test the following behaviors:</p>
          <ul style={{ color: 'var(--text2)', margin: 0, paddingLeft: '20px' }}>
            <li>Click outside the modal (overlay) - modal stays open (disabled)</li>
            <li>Press Escape with select closed - modal stays open (disabled)</li>
            <li>Press Escape with select open - should close select only</li>
            <li>Click outside select but inside modal - should close select only</li>
            <li>Use &quot;Close Modal&quot; button to close the modal</li>
          </ul>

          <Select
            options={options}
            selected={selectedValue}
            onSelectedChange={setSelectedValue}
            defaultText="Choose an option"
            width="100%"
            dropdownWidth="100%"
          />

          {selectedValue && (
            <p style={{ color: 'var(--text1)', margin: 0 }}>Selected: {selectedValue}</p>
          )}

          <Button onclick={handleCloseModal} variant="secondary">
            Close Modal
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectInModalStory;
