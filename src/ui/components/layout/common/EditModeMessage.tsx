import { useEffect, useState } from 'react';

import { Pencil, WarningTriangleOutlineIcon } from '../../../icons';
import { useAppContext } from '../../../providers';

import { Notification } from '../../notification';

import './EditModeMessage.css';

export const EditModeMessage = () => {
  const appContext = useAppContext();
  const [appData, setAppData] = useState(() => appContext.get());

  // Subscribe to context changes
  useEffect(() => {
    const unsubscribe = appContext.subscribe((data: typeof appData) => {
      setAppData(data);
    });
    return typeof unsubscribe === 'function' ? unsubscribe : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appContext]);

  const isEditMode = appData?.editMode;
  const isRepairMode = appData?.repairMode;
  const title = appData?.title;

  useEffect(() => {
    console.log('appData', { appData, editMode: appData?.editMode });
  }, [appData]);

  return (
    <>
      {isEditMode && !isRepairMode && (
        <div className="edit-mode">
          <Notification
            variant="warning"
            title={`You are in edit mode for ${title} Component.`}
            message={`Make your edits and click on the "Update ${title}" button. You can review and confirm all changes before we proceed with the updates.`}
            richTextMessage={true}
            icon={Pencil}
            showCloseButton={false}
          />
        </div>
      )}

      {isRepairMode && (
        <div className="edit-mode">
          <Notification
            variant="warning"
            title="Component instance not found"
            message="We have detected Component as valid, but we couldn't find the associated configurations. This may be a Component from another project. Click the 'Repair' button to fix it."
            icon={WarningTriangleOutlineIcon}
            showCloseButton={false}
          />
        </div>
      )}
    </>
  );
};

export default EditModeMessage;
