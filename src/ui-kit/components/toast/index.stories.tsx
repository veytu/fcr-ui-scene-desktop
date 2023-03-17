import { Meta } from '@storybook/react';
import React from 'react';
import { FcrToast, Toast } from '.';
import { FcrButton } from '../button';
import { SvgIconEnum } from '../svg-img';
import { v4 as uuidv4 } from 'uuid';

export default {
  title: 'Components/Toast',
};
export const Docs = ({ closable, icon, action, text }: { closable; icon; action; text }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <FcrButton
          onClick={() => {
            Toast.open({
              id: uuidv4(),
              toastProps: {
                type: 'info',
                content: 'test',
              },
            });
          }}>
          show toast
        </FcrButton>
        <FcrButton
          onClick={() => {
            Toast.open({
              id: uuidv4(),
              persist: true,
              duration: 15000,
              toastProps: {
                type: 'alarm',
                content: 'test',
                closable: true,
              },
            });
          }}>
          show presist toast
        </FcrButton>
      </div>

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
        closable={closable}
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
        closable={closable}
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
        closable={closable}
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
        closable={closable}
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
  closable: {
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
