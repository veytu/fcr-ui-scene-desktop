import { StreamWindowPlacement } from '@onlineclass/uistores/type';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { generateShortUserName } from '@onlineclass/utils/short-name';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { EduRoleTypeEnum } from 'agora-edu-core';
import { observer } from 'mobx-react';
import { createContext, FC, useContext, useEffect, useRef } from 'react';
import { AudioRecordinDeviceIcon } from '../action-bar/device';
import './index.css';
import classnames from 'classnames';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { Popover } from '@onlineclass/components/popover';
export const StreamWindowContext = createContext<StreamWindowContext | null>(null);

const streamWindowActionItems = [
  {
    icon: <SvgImg size={20} type={SvgIconEnum.FCR_MUTE}></SvgImg>,
    label: '申请打开麦克风',
  },
  {
    icon: <SvgImg size={20} type={SvgIconEnum.FCR_CAMERA}></SvgImg>,
    label: '申请打开摄像头',
  },
  {
    icon: <SvgImg size={20} type={SvgIconEnum.FCR_HOST}></SvgImg>,
    label: '授权',
  },
  {
    icon: <SvgImg size={20} type={SvgIconEnum.FCR_REWARD}></SvgImg>,
    label: '奖励',
  },
  {
    icon: <SvgImg size={20} type={SvgIconEnum.FCR_ONELEAVE}></SvgImg>,
    label: '踢人',
  },
];

interface StreamWindowContext {
  stream: EduStreamUI;
  placement: StreamWindowPlacement;
}
export const StreamWindow: FC = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);

  return (
    <div className="fcr-stream-window-wrap">
      <StreamPlaceHolder></StreamPlaceHolder>
      {streamWindowContext?.stream.isCameraDeviceEnabled && <StreamPlayer></StreamPlayer>}
      <UserInteract></UserInteract>
    </div>
  );
});

const StreamPlaceHolder: FC = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const stream = streamWindowContext?.stream;
  return (
    <div className={'fcr-stream-window-placeholder'}>
      {streamWindowContext?.placement === 'main-view' ? (
        <div className={'fcr-stream-window-placeholder-rounded'}>
          {generateShortUserName(stream?.fromUser.userName || '')}
        </div>
      ) : (
        <div className={'fcr-stream-window-placeholder-text'}>{stream?.fromUser.userName}</div>
      )}
    </div>
  );
});

const StreamPlayer = observer(() => {
  const ref = useRef<HTMLDivElement | null>(null);
  const streamWindowContext = useContext(StreamWindowContext);
  const stream = streamWindowContext?.stream;
  const {
    classroomStore: {
      mediaStore: { setupLocalVideo },
    },
  } = useStore();
  useEffect(() => {
    if (stream?.isLocal && ref.current) {
      setupLocalVideo(ref.current, false);
    }
  }, [stream]);

  return <div ref={ref} className="fcr-stream-window-player"></div>;
});

const UserInteract = observer(() => {
  return (
    <div className="fcr-stream-window-interact">
      <StudentInteractGroup></StudentInteractGroup>
      <StreamActions></StreamActions>
      <StreamWindowUserLabel></StreamWindowUserLabel>
    </div>
  );
});

const StreamActions = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);

  const placement = streamWindowContext?.placement;
  const {
    layoutUIStore: { showStatusBar },
  } = useStore();
  return (
    <div
      className={classnames('fcr-stream-window-actions', {
        'fcr-stream-window-actions-anim': showStatusBar && placement === 'main-view',
      })}>
      <div className="fcr-stream-window-actions-item fcr-bg-brand-6">
        <span>Unmute</span>
      </div>
      <Popover
        overlayInnerStyle={{ width: 'auto' }}
        placement="bottomLeft"
        mouseEnterDelay={0}
        content={<StreamActionPopover></StreamActionPopover>}>
        <div className="fcr-stream-window-actions-item fcr-bg-brand-6">
          <SvgImg type={SvgIconEnum.FCR_MOBILE_MORE} size={30}></SvgImg>
        </div>
      </Popover>
    </div>
  );
});

const StreamActionPopover = () => {
  const streamWindowContext = useContext(StreamWindowContext);

  return (
    <div className="fcr-stream-window-actions-popover">
      <div className="fcr-stream-window-actions-popover-name">
        {streamWindowContext?.stream.fromUser.userName}
      </div>
      <div className="fcr-stream-window-actions-popover-items">
        {streamWindowActionItems.map((item) => {
          return (
            <div key={item.label} className="fcr-stream-window-actions-popover-item">
              {item.icon}
              <div className="fcr-stream-window-actions-popover-item-label">{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StudentInteractGroup = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const stream = streamWindowContext?.stream;
  const {
    classroomStore: {
      userStore: { rewards },
    },
    layoutUIStore: { showStatusBar },
  } = useStore();
  const reward = rewards.get(stream?.fromUser.userUuid || '');
  const placement = streamWindowContext?.placement;

  return (
    <div
      className={classnames('fcr-stream-window-student-interact-group', {
        'fcr-stream-window-student-interact-group-anim': showStatusBar && placement === 'main-view',
      })}>
      <div className="fcr-stream-window-student-interact-item fcr-bg-yellowwarm">
        <SvgImg type={SvgIconEnum.FCR_HOST} size={30}></SvgImg>
      </div>
      <div className="fcr-stream-window-student-interact-item  fcr-bg-brand-6">
        <SvgImg type={SvgIconEnum.FCR_STAR} size={30}></SvgImg>
        <span>{reward || 0}</span>
      </div>
      <div className="fcr-stream-window-student-interact-item  fcr-bg-brand-6">
        <SvgImg type={SvgIconEnum.FCR_STUDENT_RASIEHAND} size={30}></SvgImg>
      </div>
    </div>
  );
});
const StreamWindowUserLabel = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const stream = streamWindowContext?.stream;
  const placement = streamWindowContext?.placement;
  const {
    layoutUIStore: { showActiobBar },
  } = useStore();
  return (
    <div
      className={classnames('fcr-stream-window-user-label', {
        'fcr-stream-window-user-label-anim': showActiobBar && placement === 'main-view',
      })}>
      {stream?.role === EduRoleTypeEnum.teacher && (
        <div className="fcr-stream-window-user-role">
          <AudioRecordinDeviceIcon size={24}></AudioRecordinDeviceIcon>
          <span>host</span>
        </div>
      )}
      <div className="fcr-stream-window-user-name">{stream?.userName}</div>
    </div>
  );
});
