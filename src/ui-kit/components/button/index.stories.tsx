import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { FcrButton } from '.';
const meta: Meta = {
  title: 'Components/Button',
};

export const Docs = (props) => {
  return (
    <div>
      <div>
        <h3>type</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <FcrButton type="primary">primary</FcrButton>
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
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <FcrButton size="XL">XL</FcrButton>
          <FcrButton size="L">L</FcrButton>
          <FcrButton size="M">M</FcrButton>
          <FcrButton size="S">S</FcrButton>
          <FcrButton size="XS">XS</FcrButton>
          <FcrButton size="XXS">XXS</FcrButton>
        </div>
      </div>
    </div>
  );
};

export default meta;
