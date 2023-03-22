import React from 'react';
import { Meta } from '@storybook/react';
import { FcrCheckbox } from '.';

const meta: Meta = {
  title: 'Components/Checkbox',
};

export const Docs = () => {
  return (
    <div>
      <FcrCheckbox label="请选择"></FcrCheckbox>
    </div>
  );
};

export default meta;
