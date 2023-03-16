import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { InputNumber } from '.';

const meta: ComponentMeta<typeof InputNumber> = {
  title: 'Components/InputNumber',
  component: InputNumber,
  args: {
    placeholder: 'please set number',
    min: -5,
    max: 20,
  },
};

export const Docs: ComponentStory<typeof InputNumber> = (props) => {
  const [value, setValue] = useState<number>();
  const handleChange = (val: number | null) => {
    console.log(val);
    if (val !== null) {
      setValue(val);
    }
  };
  return (
    <div>
      <div
        style={{
          width: 200,
          marginBottom: 50,
        }}>
        <InputNumber {...props} onChange={handleChange} />
      </div>
    </div>
  );
};

export default meta;
