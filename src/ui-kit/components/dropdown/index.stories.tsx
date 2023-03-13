import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { Dropdown, Props } from '.';

const meta: Meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
};

export const Docs = (props: Props) => {
  return (
    <div className="h-full w-full">
      <Dropdown {...props} />
    </div>
  );
};

Docs.args = {
  options: [],
};

export default meta;
