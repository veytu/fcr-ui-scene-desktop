import React, { FC, useState } from 'react';
import { ComponentStory, Meta } from '@storybook/react';
import { FcrToolTip, FcrToolTipProps } from '.';
import { FcrGuideToolTip } from './guide';
import { FcrInfoToolTip } from './info';
import { FcrDialogToolTip } from './dialog';
const tooltipMap = {
  normal: FcrToolTip,
  guide: FcrGuideToolTip,
  info: FcrInfoToolTip,
  dialog: FcrDialogToolTip,
};
const meta: Meta = {
  title: 'Components/ToolTip',
};
const placementMap = [
  'left',
  'top',
  'bottom',
  'right',
  'leftTop',
  'leftBottom',
  'rightTop',
  'rightBottom',
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
];
export const Placement = (
  props: FcrToolTipProps & {
    children?: React.ReactNode;
    type: keyof typeof tooltipMap;
  },
) => {
  const { type, trigger } = props;
  const Component = tooltipMap[type];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 30,
        padding: 50,
      }}>
      {placementMap.map((placement) => {
        return (
          <Component trigger={trigger} placement={placement} content={placement} closable>
            <a
              style={{
                width: 120,
                height: 40,
                textAlign: 'center',
                color: 'blue',
                background: 'gray',
                cursor: 'pointer',
                lineHeight: '40px',
              }}>
              {placement}
            </a>
          </Component>
        );
      })}
    </div>
  );
};
Placement.argTypes = {
  type: {
    control: 'radio',
    options: ['normal', 'guide', 'info'],
    defaultValue: 'normal',
  },
  trigger: {
    control: 'radio',
    options: ['hover', 'click'],
    defaultValue: 'hover',
  },
};
export default meta;

export const Type: ComponentStory<typeof FcrToolTip> = (props) => {
  const { trigger } = props;
  return (
    <div
      style={{
        padding: '100px',
        display: 'flex',
        gap: '40px',
        flexDirection: 'row',
      }}>
      <FcrToolTip trigger={trigger} placement={'top'} content={'关闭摄像头'}>
        <a
          style={{
            width: 120,
            height: 40,
            textAlign: 'center',
            color: 'blue',
            background: 'gray',
            cursor: 'pointer',
            lineHeight: '40px',
          }}>
          normal
        </a>
      </FcrToolTip>
      <FcrGuideToolTip
        onClose={() => {
          console.log('onClose');
        }}
        trigger={trigger}
        placement={'top'}
        content={'解除禁言'}
        closable>
        <a
          style={{
            width: 120,
            height: 40,
            textAlign: 'center',
            color: 'blue',
            background: 'gray',
            cursor: 'pointer',
            lineHeight: '40px',
          }}>
          guide
        </a>
      </FcrGuideToolTip>
      <FcrInfoToolTip trigger={trigger} placement={'top'} content={'🙋 有1人举手，请点击查看'}>
        <a
          style={{
            width: 120,
            height: 40,
            textAlign: 'center',
            color: 'blue',
            background: 'gray',
            cursor: 'pointer',
            lineHeight: '40px',
          }}>
          info
        </a>
      </FcrInfoToolTip>
      <FcrDialogToolTip
        trigger={trigger}
        placement={'top'}
        content={'🙋 有1人举手，请点击查看'}
        onClose={() => {
          console.log('onClose');
        }}>
        <a
          style={{
            width: 120,
            height: 40,
            textAlign: 'center',
            color: 'blue',
            background: 'gray',
            cursor: 'pointer',
            lineHeight: '40px',
          }}>
          dialog
        </a>
      </FcrDialogToolTip>
    </div>
  );
};
Type.argTypes = {
  trigger: {
    control: 'radio',
    options: ['hover', 'click'],
    defaultValue: 'hover',
  },
};
