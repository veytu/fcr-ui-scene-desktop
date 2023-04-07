import { useStore } from '@onlineclass/utils/hooks/use-store';
import { generateShortUserName } from '@onlineclass/utils/short-name';
import { observer } from 'mobx-react';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { AudioRecordinDeviceIcon } from '../action-bar/device';
import './index.css';
import classnames from 'classnames';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { Popover } from '@components/popover';
import { StreamWindowContext, StreamWindowMouseContext } from './context';

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

export const StreamWindow: FC = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const [mouseEnter, setMouseEnter] = useState(false);
  const {
    layoutUIStore: { mouseEnterClass },
  } = useStore();
  return (
    <StreamWindowMouseContext.Provider
      value={{ mouseEnterWindow: mouseEnter, mouseEnterClass: mouseEnterClass }}>
      <div
        className="fcr-stream-window-wrap"
        onMouseLeave={() => {
          setMouseEnter(false);
        }}
        onMouseEnter={() => {
          setMouseEnter(true);
        }}>
        <StreamPlaceHolder></StreamPlaceHolder>
        {streamWindowContext?.streamPlayerVisible && <StreamPlayer></StreamPlayer>}
        <UserInteract></UserInteract>
      </div>
    </StreamWindowMouseContext.Provider>
  );
});

const StreamPlaceHolder: FC = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const stream = streamWindowContext?.stream;
  return (
    <div className={'fcr-stream-window-placeholder'}>
      {streamWindowContext?.showRoundedNamePlaceholder ? (
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
  const renderMode = streamWindowContext?.renderMode;
  const stream = streamWindowContext?.stream;
  const {
    classroomStore: {
      mediaStore: { setupLocalVideo },
    },
    streamUIStore: { updateVideoDom, removeVideoDom },
  } = useStore();

  useEffect(() => {
    if (stream) {
      if (stream.isLocal) {
        ref.current && setupLocalVideo(ref.current, false, renderMode);
      } else {
        if (ref.current) {
          updateVideoDom(stream.stream.streamUuid, ref.current);
        }
        return () => {
          removeVideoDom(stream.stream.streamUuid);
        };
      }
    }
  }, [stream, stream?.isLocal, stream?.stream.streamUuid]);

  return <div ref={ref} className="fcr-stream-window-player"></div>;
});

const UserInteract = () => {
  const streamWindowContext = useContext(StreamWindowContext);

  return (
    <div className="fcr-stream-window-interact">
      {streamWindowContext?.showInteractLabels && (
        <StudentInteractLabelGroup></StudentInteractLabelGroup>
      )}
      {streamWindowContext?.showActions && <StreamActions></StreamActions>}
      {streamWindowContext?.showActions && <StreamMuteIcon></StreamMuteIcon>}
      <StreamWindowUserLabel></StreamWindowUserLabel>
    </div>
  );
};
const StreamMuteIcon = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const streamWindowMouseContext = useContext(StreamWindowMouseContext);

  const {
    layoutUIStore: { showStatusBar },
  } = useStore();
  return streamWindowMouseContext?.mouseEnterWindow ? (
    <div
      className={classnames(
        `fcr-stream-window-mute-icon fcr-stream-window-mute-icon-${streamWindowContext?.labelSize} fcr-bg-brand-6`,
        {
          'fcr-stream-window-mute-icon-anim':
            showStatusBar && streamWindowContext?.topLabelAnimation,
        },
      )}>
      <span>Unmute</span>
    </div>
  ) : null;
});

const StreamActions = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const streamWindowMouseContext = useContext(StreamWindowMouseContext);
  const size = streamWindowContext?.labelSize;
  const {
    layoutUIStore: { showStatusBar },
  } = useStore();
  return (
    <div
      className={classnames('fcr-stream-window-actions', `fcr-stream-window-actions-${size}`, {
        'fcr-stream-window-actions-anim': showStatusBar && streamWindowContext?.topLabelAnimation,
      })}>
      {streamWindowMouseContext?.mouseEnterWindow && (
        <Popover
          overlayInnerStyle={{ width: 'auto' }}
          placement="bottomRight"
          mouseEnterDelay={0}
          content={<StreamActionPopover></StreamActionPopover>}>
          <div className="fcr-stream-window-actions-item fcr-bg-brand-6">
            <SvgImg
              type={SvgIconEnum.FCR_MOBILE_MORE}
              size={streamWindowContext?.labelIconSize}></SvgImg>
          </div>
        </Popover>
      )}
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

const StudentInteractLabelGroup = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const stream = streamWindowContext?.stream;

  const {
    classroomStore: {
      userStore: { rewards },
    },
    layoutUIStore: { showStatusBar },
  } = useStore();
  const reward = rewards.get(stream?.fromUser.userUuid || '');
  return (
    <div
      className={classnames(
        'fcr-stream-window-student-interact-group',
        `fcr-stream-window-student-interact-group-${streamWindowContext?.labelSize}`,
        {
          'fcr-stream-window-student-interact-group-anim':
            showStatusBar && streamWindowContext?.topLabelAnimation,
        },
      )}>
      <div className="fcr-stream-window-student-interact-item fcr-bg-yellowwarm">
        <SvgImg type={SvgIconEnum.FCR_HOST} size={streamWindowContext?.labelIconSize}></SvgImg>
      </div>
      <div className="fcr-stream-window-student-interact-item  fcr-bg-brand-6">
        <SvgImg type={SvgIconEnum.FCR_STAR} size={streamWindowContext?.labelIconSize}></SvgImg>
        <span>{reward || 0}</span>
      </div>
      <div className="fcr-stream-window-student-interact-item  fcr-bg-brand-6">
        <SvgImg
          type={SvgIconEnum.FCR_STUDENT_RASIEHAND}
          size={streamWindowContext?.labelIconSize}></SvgImg>
      </div>
    </div>
  );
});

const StreamWindowUserLabel = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const stream = streamWindowContext?.stream;
  const streamWindowMouseContext = useContext(StreamWindowMouseContext);

  const {
    layoutUIStore: { showActiobBar },
  } = useStore();
  return streamWindowMouseContext?.mouseEnterClass ? (
    <div
      className={classnames(
        'fcr-stream-window-user-label',
        `fcr-stream-window-user-label-${streamWindowContext?.labelSize}`,
        {
          'fcr-stream-window-user-label-anim':
            showActiobBar && streamWindowContext?.bottomLabelAnimation,
        },
      )}>
      {streamWindowContext?.showHostLabel && (
        <div className="fcr-stream-window-user-role">
          <AudioRecordinDeviceIcon
            size={streamWindowContext?.audioIconSize}></AudioRecordinDeviceIcon>
          <span>host</span>
        </div>
      )}
      {streamWindowContext?.showNameOnBottomLeft && (
        <div className="fcr-stream-window-user-name">{stream?.userName}</div>
      )}
    </div>
  ) : null;
});
