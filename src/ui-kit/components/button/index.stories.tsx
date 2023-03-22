import React, { FC, ReactNode, useState } from 'react';
import { ComponentStory, Meta } from '@storybook/react';
import { FcrButton, FcrButtonProps } from '.';
import { SvgIconEnum } from '../svg-img';
const meta: Meta = {
  title: 'Components/Button',
};
const sizes = ['XL', 'L', 'M', 'S', 'XS', 'XXS'];
export const Doc = (props: FcrButtonProps & { text: ReactNode }) => {
  const { text, type, shape, preIcon, postIcon, disabled, styleType, loading } = props;
  return (
    <div>
      <div>
        <h3>type</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <FcrButton styleType="danger" type="primary">
            primary
          </FcrButton>
          <FcrButton type="secondary">secondary</FcrButton>
          <FcrButton type="text">text</FcrButton>
          <FcrButton type="link">link</FcrButton>
        </div>
      </div>
      <div>
        <h3>shape</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <FcrButton shape="circle">circle</FcrButton>
          <FcrButton shape="rounded">rounded</FcrButton>
        </div>
      </div>
      <div>
        <h3>Size</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sizes.map((size) => {
            return (
              <FcrButton
                key={size}
                loading={loading}
                disabled={disabled}
                type={type}
                shape={shape}
                preIcon={preIcon && SvgIconEnum.FCR_HOST}
                postIcon={postIcon && SvgIconEnum.FCR_HOST}
                styleType={styleType}
                size={size}>
                {text}
              </FcrButton>
            );
          })}
        </div>
      </div>
    </div>
  );
};
Doc.argTypes = {
  text: {
    control: 'text',
    defaultValue: 'text',
  },
  type: {
    control: 'radio',
    options: ['primary', 'secondary', 'text', 'link'],
    defaultValue: 'primary',
  },
  shape: {
    control: 'radio',
    options: ['circle', 'rounded'],
    defaultValue: 'circle',
  },
  loading: {
    control: 'boolean',

    defaultValue: false,
  },
  preIcon: {
    control: 'boolean',

    defaultValue: false,
  },
  postIcon: {
    control: 'boolean',

    defaultValue: false,
  },
  disabled: {
    control: 'boolean',

    defaultValue: false,
  },
  styleType: {
    control: 'radio',
    options: ['danger', 'gray'],
  },
};
export default meta;
