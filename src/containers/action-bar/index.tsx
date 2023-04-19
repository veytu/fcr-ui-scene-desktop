import { Popover, PopoverProps } from '@components/popover';
import { SvgIconEnum, SvgImg, SvgImgProps } from '@components/svg-img';
import { FC, ReactNode, useState } from 'react';
import { observer } from 'mobx-react';
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
import { Leave, LeaveCheck } from './leave';
import { useStore } from '@onlineclass/utils/hooks/use-store';
export const ActionBar = observer(() => {
  const {
    layoutUIStore: { showActiobBar, setIsPointingBar },
    actionBarUIStore: { showLeaveOption, showRecord, showScreenShare, showToolBox, showWhiteBoard },
  } = useStore();
  return (
    <div
      className={classnames('fcr-action-bar', { 'fcr-action-bar-hide': !showActiobBar })}
      onMouseEnter={() => {
        setIsPointingBar(true);
      }}
      onMouseLeave={() => {
        setIsPointingBar(false);
      }}>
      {showLeaveOption ? (
        <LeaveCheck></LeaveCheck>
      ) : (
        <>
          <div className="fcr-action-bar-left">
            <MicrophoenDevice></MicrophoenDevice>
            <CameraDevice></CameraDevice>
          </div>
          <div className="fcr-action-bar-mid">
            {showToolBox && <ToolBox></ToolBox>}
            {showWhiteBoard && <Whiteboard></Whiteboard>}
            {showScreenShare && <ScreenShare></ScreenShare>}
            {showRecord && <Record></Record>}
          </div>
          <div className="fcr-action-bar-right">
            {/* <RaiseHands></RaiseHands> */}
            <Chat></Chat>
            <Participants></Participants>
            <Setting></Setting>
            <Leave></Leave>
          </div>
        </>
      )}
    </div>
  );
});
interface ActionBarItemWrapperProps {
  classNames?: string;
}
export const ActionBarItemWrapper: FC<React.PropsWithChildren & ActionBarItemWrapperProps> = (
  props,
) => {
  const { children, classNames, ...others } = props;
  return (
    <div {...others} className={classnames('fcr-action-bar-item-wrapper', classNames)}>
      {children}
    </div>
  );
};
type ActionBarItemIconTypes = SvgIconEnum | SvgImgProps;
interface ActionBarItemProps {
  classNames?: string;
  icon: ActionBarItemIconTypes;
  text: ReactNode;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}
export const ActionBarItem: FC<ActionBarItemProps> = (props) => {
  const { classNames, text, icon, active = false, onClick, disabled = false, ...others } = props;
  return (
    <ActionBarItemWrapper {...others} classNames={classnames(classNames)}>
      <div
        onClick={() => {
          !disabled && onClick?.();
        }}
        className={classnames('fcr-action-bar-item', {
          'fcr-action-bar-item-active': active,
          'fcr-action-bar-item-disabled': disabled,
        })}>
        <div className="fcr-action-bar-item-icon">
          {typeof icon === 'string' ? (
            <SvgImg size={36} type={icon}></SvgImg>
          ) : (
            <SvgImg size={36} {...icon}></SvgImg>
          )}
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
