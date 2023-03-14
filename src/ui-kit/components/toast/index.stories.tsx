import { Meta } from '@storybook/react';
import React from 'react';
import { FcrToast } from '.';
import { SvgIconEnum } from '../svg-img';
export default {
  title: 'Components/Toast',
};
export const Docs = ({ closeable }: { closeable }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FcrToast
        icon={SvgIconEnum.FCR_HOST}
        action={{
          onClick: () => {},
          text: 'Learn more',
        }}
        type="Alarm"
        closeable={closeable}
        content="You don’t have access to this file"></FcrToast>
      <FcrToast
        closeable={closeable}
        type="Info"
        content="You don’t have access to this file"></FcrToast>
      <FcrToast
        closeable={closeable}
        type="Normal"
        content="You don’t have access to this file"></FcrToast>
      <FcrToast
        closeable={closeable}
        type="Warn"
        content="You don’t have access to this file"></FcrToast>
    </div>
  );
};
Docs.argTypes = {
  closeable: {
    type: 'boolean',
    defaultValue: false,
  },
};
