import { Popover, PopoverProps } from '@onlineclass/components/popover';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { FC, useState } from 'react';
import { AgoraDeviceInfo } from 'agora-edu-core';
import './index.css';
import { CameraDevice, MicrophoenDevice } from './device';
import classnames from 'classnames';
import { ToolBox } from './toolbox';
import { Whiteboard } from './whiteboard';
export const ActionBar = () => {
  return (
    <div className="fcr-action-bar">
      <div className="fcr-action-bar-left">
        <MicrophoenDevice></MicrophoenDevice>
        <CameraDevice></CameraDevice>
      </div>
      <div className="fcr-action-bar-mid">
        <ToolBox></ToolBox>
        <Whiteboard></Whiteboard>
      </div>
      <div className="fcr-action-bar-right">
        <MicrophoenDevice></MicrophoenDevice>
        <CameraDevice></CameraDevice>
      </div>
    </div>
  );
};
interface ActionBarItemWrapperProps {
  classNames?: string;
}
export const ActionBarItemWrapper: FC<ActionBarItemWrapperProps> = (props) => {
  const { children, classNames, ...others } = props;
  return (
    <div {...others} className={classnames('fcr-action-bar-item-wrapper', classNames)}>
      {children}
    </div>
  );
};
interface ActionBarItemProps {
  classNames?: string;
  icon: SvgIconEnum;
  text: string;
}
export const ActionBarItem: FC<ActionBarItemProps> = (props) => {
  const { classNames, text, icon, ...others } = props;
  return (
    <ActionBarItemWrapper {...others} classNames={classNames}>
      <div className="fcr-action-bar-item">
        <div className="fcr-action-bar-item-icon">
          <SvgImg size={36} type={icon}></SvgImg>
        </div>
        <div className="fcr-action-bar-item-text">{text}</div>
      </div>
    </ActionBarItemWrapper>
  );
};
interface ActionBarItemWithPopoverProps extends ActionBarItemProps {
  popoverProps?: PopoverProps;
}
export const ActionBarItemWithPopover: FC<ActionBarItemWithPopoverProps> = (props) => {
  const { icon, text, popoverProps } = props;
  const [popoverOpened, setPopoverOpend] = useState(false);
  return (
    <Popover
      {...popoverProps}
      onVisibleChange={(visible) => {
        setPopoverOpend(visible);
        popoverProps?.onVisibleChange?.(visible);
      }}>
      <ActionBarItem
        icon={icon}
        text={text}
        classNames={classnames({ 'fcr-action-bar-item-active': popoverOpened })}></ActionBarItem>
    </Popover>
  );
};
