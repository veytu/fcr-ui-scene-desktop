import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Classroom } from './scenarios/classroom';
import { DevicePretest } from './scenarios/device-pretest';
import './preflight.css';
import { useStore } from './utils/hooks/use-store';

export const App = observer(() => {
  const { initialize, destroy, initialized, devicePretestFinished } = useStore();

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
      {devicePretestFinished && <Classroom />}
    </React.Fragment>
  );
});
