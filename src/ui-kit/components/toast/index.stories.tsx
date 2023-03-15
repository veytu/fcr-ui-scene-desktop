import { Meta } from '@storybook/react';
import React from 'react';
import { FcrToast } from '.';
import { SvgIconEnum } from '../svg-img';
export default {
  title: 'Components/Toast',
};
export const Docs = ({ closeable, icon, action, text }: { closeable; icon; action; text }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FcrToast
        icon={icon ? SvgIconEnum.FCR_HOST : undefined}
        action={
          action
            ? {
                onClick: () => {},
                text: 'Learn more',
              }
            : undefined
        }
        type="Alarm"
        closeable={closeable}
        content={text}></FcrToast>
      <FcrToast
        action={
          action
            ? {
                onClick: () => {},
                text: 'Learn more',
              }
            : undefined
        }
        icon={icon ? SvgIconEnum.FCR_HOST : undefined}
        closeable={closeable}
        type="Info"
        content={text}></FcrToast>
      <FcrToast
        action={
          action
            ? {
                onClick: () => {},
                text: 'Learn more',
              }
            : undefined
        }
        icon={icon ? SvgIconEnum.FCR_HOST : undefined}
        closeable={closeable}
        type="Normal"
        content={text}></FcrToast>
      <FcrToast
        action={
          action
            ? {
                onClick: () => {},
                text: 'Learn more',
              }
            : undefined
        }
        icon={icon ? SvgIconEnum.FCR_QUESTION : undefined}
        closeable={closeable}
        type="Warn"
        content={text}></FcrToast>
    </div>
  );
};
Docs.argTypes = {
  text: {
    type: 'string',
    defaultValue: 'You don’t have access to this file',
  },
  closeable: {
    type: 'boolean',
    defaultValue: false,
  },
  icon: {
    type: 'boolean',
    defaultValue: false,
  },
  action: {
    type: 'boolean',
    defaultValue: false,
  },
};
