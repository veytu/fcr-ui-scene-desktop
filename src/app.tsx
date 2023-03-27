import React, { useEffect, useState } from 'react';
import { Classroom } from './scenarios/classroom';
import { Pretest } from './scenarios/pretest';
import './preflight.css';
import { useStore } from './utils/hooks/use-store';
export const App = () => {
  const { initialize, destroy } = useStore();
  const [pretest, setPretest] = useState(false);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    initialize();
    setInitialized(true);
    return destroy;
  }, []);
  return (
    initialized && (
      <React.Fragment>
        {pretest && <Pretest />}
        {!pretest && <Classroom />}
      </React.Fragment>
    )
  );
};
