import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Classroom } from './scenarios/classroom';
import { DevicePretest } from './containers/device-pretest';
import { useStore } from './utils/hooks/use-store';
import './index.css';
import { EduClassroomConfig, EduRoomTypeEnum } from 'agora-edu-core';
import { ClassroomAiPeople } from './ai-people/scenarios/classroom';

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
      {devicePretestFinished && ("11" !== EduClassroomConfig.shared.sessionInfo.roomType.toString() ? <ClassroomAiPeople /> : <Classroom />)}
    </React.Fragment>
  );
});
