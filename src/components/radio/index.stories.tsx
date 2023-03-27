import React from 'react';
import { Meta } from '@storybook/react';
import { Radio } from '.';

const meta: Meta = {
  title: 'Components/Radio',
};

export const Docs = () => {
  return (
    <>
      <div>
        <Radio label="Agree terms of service"></Radio>
      </div>
      <div>
        <Radio styleType="white" label="Agree terms of service"></Radio>
      </div>
    </>
  );
};

export default meta;
