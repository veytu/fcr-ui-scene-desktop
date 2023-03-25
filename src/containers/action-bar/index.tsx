import { Popover, PopoverProps } from '@onlineclass/components/popover';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { FC, useState } from 'react';
import { AgoraDeviceInfo } from 'agora-edu-core';
import './index.css';
import { CameraDevice, MicrophoenDevice } from './device';
import classnames from 'classnames';
import { ToolBox } from './toolbox';
import { Whiteboard } from './whiteboard';
import { ScreenShare } from './screen-share';
import { Record } from './record';
import { RaiseHands } from './raise-hands';
import { Chat } from './chat';
import { Participants } from './participants';
import { Setting } from './setting';
import { Leave } from './leave';
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
        <ScreenShare></ScreenShare>
        <Record></Record>
      </div>
      <div className="fcr-action-bar-right">
        <RaiseHands></RaiseHands>
        <Chat></Chat>
        <Participants></Participants>
        <Setting></Setting>
        <Leave></Leave>
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
  active?: boolean;
}
export const ActionBarItem: FC<ActionBarItemProps> = (props) => {
  const { classNames, text, icon, active = false, ...others } = props;
  return (
    <ActionBarItemWrapper
      {...others}
      classNames={classnames(classNames, { 'fcr-action-bar-item-active': active })}>
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
      <ActionBarItem active={popoverOpened} icon={icon} text={text}></ActionBarItem>
    </Popover>
  );
};
