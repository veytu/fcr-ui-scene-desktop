import { ClassRoomDialogContainer } from '@onlineclass/containers/dialog';
import { ClassroomLoading } from '@onlineclass/containers/loading';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import { useEffect } from 'react';

import { ClassroomLayout } from './layout';

export const Classroom = observer(() => {
  const {
    join,
    layoutUIStore: { classroomViewportClassName },
  } = useStore();
  useEffect(() => {
    join();
  }, []);
  return (
    <div className={classroomViewportClassName}>
      <ClassroomLayout></ClassroomLayout>
      <ClassRoomDialogContainer></ClassRoomDialogContainer>
      <ClassroomLoading></ClassroomLoading>
    </div>
  );
});
