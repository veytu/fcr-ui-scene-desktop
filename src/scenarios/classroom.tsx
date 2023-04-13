import { ClassRoomDialogContainer } from '@onlineclass/containers/dialog';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import React, { useEffect } from 'react';

import { ClassroomLayout } from './layout';

export const Classroom = () => {
  const { join, layoutUIStore } = useStore();
  useEffect(() => {
    join();
    const observer = layoutUIStore.addViewportResizeObserver();
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div className={layoutUIStore.classroomViewportClassName}>
      <ClassroomLayout></ClassroomLayout>
      <ClassRoomDialogContainer></ClassRoomDialogContainer>
    </div>
  );
};
