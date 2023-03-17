import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { FcrDialog } from '.';
import { FcrButton } from '../button';
const meta: Meta = {
  title: 'Components/Dialog',
};

export const Docs = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <FcrButton onClick={() => setVisible(true)}>open dialog</FcrButton>
      <FcrDialog title={'title'} visible={visible} onClose={() => setVisible(false)}>
        content
      </FcrDialog>
    </div>
  );
};

export default meta;
