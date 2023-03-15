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
      <div
        style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
        {keys.map((k) => {
          return (
            <div
              key={k}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <SvgImg
                type={SvgIconEnum[k]}
                size={size}
                colors={color ? { iconPrimary: color, penColor: 'red' } : { penColor: 'red' }}
              />
              <div>{(SvgIconEnum[k] as string).replace('fcr_', '')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Docs.args = {
  size: 24,
  color: '',
};

export default meta;
