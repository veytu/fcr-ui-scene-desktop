import { Meta } from '@storybook/react';
import React from 'react';
import { FcrToast, Toast } from '.';
import { FcrButton } from '../button';
import { SvgIconEnum } from '../svg-img';
import { v4 as uuidv4 } from 'uuid';

export default {
  title: 'Components/Toast',
};
export const Docs = ({ closeable, icon, action, text }: { closeable; icon; action; text }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FcrButton
        onClick={() => {
          Toast.open({
            id: uuidv4(),
            persist: true,
            toastProps: {
              type: 'alarm',
              content: 'test',
              closeable: true,
            },
          });
        }}>
        show toast
      </FcrButton>
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
        type="alarm"
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
        type="info"
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
        type="normal"
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
        type="warn"
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
