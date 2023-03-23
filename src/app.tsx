import React, { useState } from 'react';
import { Classroom } from './scenarios/classroom';
import { Pretest } from './scenarios/pretest';

export const App = () => {
  const [pretest, setPretest] = useState(false);

  return (
    <React.Fragment>
      {pretest && <Pretest />}
      {!pretest && <Classroom />}
    </React.Fragment>
  );
};
