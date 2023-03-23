import React, { useState } from 'react';
import { Classroom } from './scenarios/classroom';
import { Pretest } from './scenarios/pretest';

export const App = () => {
  const [pretest, setPretest] = useState(true);

  return (
    <React.Fragment>
      {pretest && <Pretest />}
      {!pretest && <Classroom />}
    </React.Fragment>
  );
};
