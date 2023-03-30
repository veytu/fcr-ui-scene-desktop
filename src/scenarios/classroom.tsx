import { ClassRoomDialogContainer } from '@onlineclass/containers/dialog';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import React, { useEffect } from 'react';

import { ClassroomLayout } from './layout';

export const Classroom = () => {
  const {
    join,
    layoutUIStore: { layout },
  } = useStore();
  useEffect(() => {
    join();
  }, []);
  return (
    <div>
      <ClassroomLayout></ClassroomLayout>
      <ClassRoomDialogContainer></ClassRoomDialogContainer>
    </div>
  );
};
