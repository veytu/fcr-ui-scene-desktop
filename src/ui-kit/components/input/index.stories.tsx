import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { Input } from '.';

const meta: Meta = {
  title: 'Components/Input',
  component: Input,
};

type DocsProps = {
  options: Array<{ text: string; value: string }>;
};

export const Docs: FC<DocsProps> = (props) => {
  return (
    <div className="h-full w-full">
      <Input {...props} />
    </div>
  );
};


export default meta;
