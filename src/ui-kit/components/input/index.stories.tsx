import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Input } from '.';

const meta: ComponentMeta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: {
    placeholder: 'please input something..',
  },
};

export const Docs: ComponentStory<typeof Input> = (props) => {
  const [value, setValue] = useState('');
  const handleChange = (val: string) => {
    setValue(val);
  };
  return (
    <div>
      <Input {...props} value={value} onChange={handleChange} />
    </div>
  );
};

export default meta;
