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
    <div className="h-full overflow-auto">
      <h1 className="mb-4">Icon Gallery</h1>
      <div className="flex flex-wrap">
        {keys.map((k) => {
          return (
            <div key={k} className="mr-4 mb-4 border">
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
