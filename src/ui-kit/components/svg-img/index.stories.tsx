import React from 'react';
import { Meta } from '@storybook/react';
import { SvgIconEnum } from './type';
import { SvgImg } from '.';

const meta: Meta = {
  title: 'Components/SvgImg',
  component: SvgImg,
};

type DocsProps = {
  size: number;
  color: string;
};

const keys = Object.keys(SvgIconEnum);
export const Docs = ({ size, color }: DocsProps) => {
  return (
    <div>
      <h1>Icon Gallery</h1>
      <div>
        {keys.map((k) => {
          return (
            <div key={k}>
              <SvgImg
                type={SvgIconEnum[k]}
                size={size}
                colors={color ? { iconPrimary: color, penColor: 'red' } : { penColor: 'red' }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

Docs.args = {
  size: 100,
  color: '',
};

export default meta;
