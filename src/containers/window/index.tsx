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
import { Layout } from '@onlineclass/uistores/type';
import { StudentInteractLabelGroup } from '../common/student-interact-labels';
import { themeVal } from '@ui-kit-utils/tailwindcss';
const colors = themeVal('colors');
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
        className={classnames('fcr-stream-window-wrap')}
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
    <div
      className={classnames(
        'fcr-stream-window-placeholder',
        streamWindowContext?.streamWindowBackgroundColorCls,
      )}>
      {streamWindowContext?.showRoundedNamePlaceholder ? (
        <div className={'fcr-stream-window-placeholder-rounded'}>
          {generateShortUserName(stream?.fromUser.userName || '')}
        </div>
      ) : (
        <div className={'fcr-stream-window-placeholder-text'}>
          {stream?.fromUser.userName}
          {stream?.isLocal && ' (you)'}
        </div>
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
    layoutUIStore: { layout, setLayout },
    streamUIStore: { updateVideoDom, removeVideoDom },
    presentationUIStore: { pinStream },
  } = useStore();
  const handleDoubleClick = () => {
    if (stream) {
      if (layout === Layout.Grid) setLayout(Layout.ListOnTop);
      pinStream(stream.stream.streamUuid);
    }
  };
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

  return (
    <div ref={ref} onDoubleClick={handleDoubleClick} className="fcr-stream-window-player"></div>
  );
});

const UserInteract = observer(() => {
  const {
    layoutUIStore: { showStatusBar },
  } = useStore();
  const streamWindowContext = useContext(StreamWindowContext);

  return (
    <div className="fcr-stream-window-interact">
      {streamWindowContext?.showInteractLabels && (
        <div
          className={classnames('fcr-stream-window-student-interact-group-wrap', {
            'fcr-stream-window-student-interact-group-anim':
              showStatusBar && streamWindowContext?.topLabelAnimation,
          })}>
          <StudentInteractLabelGroup
            userUuid={streamWindowContext.stream.fromUser.userUuid}
            size={streamWindowContext.labelSize as 'large' | 'small'}></StudentInteractLabelGroup>
        </div>
      )}
      {streamWindowContext?.showActions && <StreamActions></StreamActions>}
      <StreamMuteIcon></StreamMuteIcon>
      <StreamWindowUserLabel></StreamWindowUserLabel>
    </div>
  );
});
const StreamMuteIcon = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const streamWindowMouseContext = useContext(StreamWindowMouseContext);

  const {
    layoutUIStore: { showStatusBar },
  } = useStore();
  const showAudioMuteAction =
    streamWindowMouseContext?.mouseEnterWindow && streamWindowContext?.showActions;
  const showMicIcon = streamWindowContext?.showMicrophoneIconOnBottomRight && !showAudioMuteAction;
  return (
    <>
      {showAudioMuteAction && (
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
      )}
      {showMicIcon && (
        <div className="fcr-stream-window-bottom-right-mic">
          <AudioRecordinDeviceIcon size={18}></AudioRecordinDeviceIcon>
        </div>
      )}
    </>
  );
});

const StreamActions = observer(() => {
  const [popoverVisible, setPopoverVisibel] = useState(false);
  const streamWindowContext = useContext(StreamWindowContext);
  const streamWindowMouseContext = useContext(StreamWindowMouseContext);
  const size = streamWindowContext?.labelSize;
  const {
    layoutUIStore: { showStatusBar },
  } = useStore();
  useEffect(() => {
    if (!streamWindowMouseContext?.mouseEnterWindow) {
      setPopoverVisibel(false);
    }
  }, [streamWindowMouseContext?.mouseEnterWindow]);
  return (
    <div
      className={classnames('fcr-stream-window-actions', `fcr-stream-window-actions-${size}`, {
        'fcr-stream-window-actions-anim': showStatusBar && streamWindowContext?.topLabelAnimation,
      })}>
      {streamWindowMouseContext?.mouseEnterWindow && (
        <Popover
          visible={popoverVisible}
          onVisibleChange={setPopoverVisibel}
          overlayInnerStyle={{ width: 'auto' }}
          placement="bottomRight"
          mouseEnterDelay={0}
          content={
            <StreamActionPopover onItemClick={() => setPopoverVisibel(false)}></StreamActionPopover>
          }>
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

const StreamActionPopover = observer(({ onItemClick }: { onItemClick: () => void }) => {
  const {
    participantsUIStore: { sendReward },
    boardApi: { grantPrivilege },
  } = useStore();

  const streamWindowContext = useContext(StreamWindowContext);
  const userUuid = streamWindowContext?.stream.fromUser.userUuid || '';

  const streamWindowActionItems = [
    {
      icon: (
        <SvgImg
          size={20}
          colors={{ iconPrimary: colors['custom-2'] }}
          type={SvgIconEnum.FCR_MUTE}></SvgImg>
      ),
      label: 'Ask to Unmute',
      onClick: () => {},
    },
    {
      icon: (
        <SvgImg
          size={20}
          colors={{ iconPrimary: colors['custom-2'] }}
          type={SvgIconEnum.FCR_CAMERA}></SvgImg>
      ),
      label: 'Ask to turn on Camera',
      onClick: () => {},
    },
    {
      icon: (
        <SvgImg
          size={20}
          type={SvgIconEnum.FCR_HOST}
          colors={{ iconPrimary: colors['yellow'] }}></SvgImg>
      ),
      label: 'Grant Authorization',
      onClick: () => {
        grantPrivilege(userUuid, true);
      },
    },
    {
      icon: <SvgImg size={20} type={SvgIconEnum.FCR_REWARD}></SvgImg>,
      label: 'Reward',
      onClick: () => {
        if (userUuid) sendReward(userUuid);
      },
    },
    {
      icon: (
        <SvgImg
          size={20}
          colors={{ iconPrimary: colors['red'][6] }}
          type={SvgIconEnum.FCR_ONELEAVE}></SvgImg>
      ),
      label: 'Remove',
      onClick: () => {},
    },
  ];
  return (
    <div className="fcr-stream-window-actions-popover">
      <div className="fcr-stream-window-actions-popover-name">
        {streamWindowContext?.stream.fromUser.userName}
      </div>
      <div className="fcr-stream-window-actions-popover-items">
        {streamWindowActionItems.map((item, index) => {
          return (
            <>
              <div
                key={item.label}
                className="fcr-stream-window-actions-popover-item"
                onClick={() => {
                  item.onClick();
                  onItemClick();
                }}>
                {item.icon}
                <div className="fcr-stream-window-actions-popover-item-label">{item.label}</div>
              </div>
              {index % 2 === 1 && <div className="fcr-stream-window-actions-popover-divider"></div>}
            </>
          );
        })}
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
          {streamWindowContext.showMicrophoneIconOnRoleLabel && (
            <AudioRecordinDeviceIcon
              size={streamWindowContext?.audioIconSize}></AudioRecordinDeviceIcon>
          )}

          <span>host</span>
        </div>
      )}
      {streamWindowContext?.showNameOnBottomLeft && (
        <div className="fcr-stream-window-user-name">{stream?.userName}</div>
      )}
    </div>
  ) : null;
});
