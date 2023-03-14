import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Input, Props } from '.';

const meta: ComponentMeta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: {
    placeholder: 'please input something..',
  },
};

export const Docs = (props: Props) => {
  return (
    <div className="h-full w-full">
      <Input {...props} />
    </div>
  );
};

export default meta;
