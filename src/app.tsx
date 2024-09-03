import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Classroom } from './scenarios/classroom';
import { DevicePretest } from './containers/device-pretest';
import { useStore } from './utils/hooks/use-store';
import './index.css';
import { EduClassroomConfig, EduRoomTypeEnum } from 'agora-edu-core';
import { ClassroomAiPeople } from './scenarios/classroom_ai_people';

export const App = observer(({ skipDevicePretest }: { skipDevicePretest: boolean }) => {
  const { initialize, destroy, initialized } = useStore();
  let { devicePretestFinished } = useStore();

  if (skipDevicePretest) {
    devicePretestFinished = true;
  }

  useEffect(() => {
    initialize();
    return destroy;
  }, []);

  if (!initialized) {
    return null;
  }
  return (
    <React.Fragment>
      {!devicePretestFinished && <DevicePretest />}
      {devicePretestFinished && (EduRoomTypeEnum.AIPEOPLE !== EduClassroomConfig.shared.sessionInfo.roomType ? <ClassroomAiPeople /> : <Classroom />)}
    </React.Fragment>
  );
});
