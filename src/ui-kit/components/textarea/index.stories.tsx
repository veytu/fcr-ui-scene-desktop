import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TextArea } from '.';

const meta: ComponentMeta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  args: {
    placeholder: 'please input something..',
  },
};

export const Docs: ComponentStory<typeof TextArea> = (props) => {
  const [value, setValue] = useState('');
  const handleChange = (val: string) => {
    setValue(val);
  };
  return (
    <div>
      <div
        style={{
          width: 200,
          marginBottom: 50,
        }}>
        <TextArea {...props} value={value} onChange={handleChange} />
      </div>
    </div>
  );
};

export default meta;
