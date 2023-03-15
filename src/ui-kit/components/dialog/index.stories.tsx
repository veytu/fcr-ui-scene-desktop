import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { FcrDialog } from '.';
const meta: Meta = {
  title: 'Components/Dialog',
};

export const Docs = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <button onClick={() => setVisible(true)}>open dialog</button>
      <FcrDialog visible={visible} onClose={() => setVisible(false)}></FcrDialog>;
    </div>
  );
};

export default meta;
