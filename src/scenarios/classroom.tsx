import { ClassRoomDialogContainer } from '@onlineclass/containers/dialog';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';

import { ClassroomLayout } from './layout';

export const Classroom = observer(() => {
  const {
    join,
    layoutUIStore: { classroomViewportSize, addViewportResizeObserver, classroomViewportClassName },
  } = useStore();
  useEffect(() => {
    join();
    const observer = addViewportResizeObserver();
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div style={{ ...classroomViewportSize }} className={classroomViewportClassName}>
      <ClassroomLayout></ClassroomLayout>
      <ClassRoomDialogContainer></ClassRoomDialogContainer>
    </div>
  );
});
