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
import { InteractLabelGroup } from '../common/interact-labels';
import { themeVal } from '@ui-kit-utils/tailwindcss';
import { useDeviceSwitch } from '@onlineclass/utils/hooks/use-device-switch';
import { useVideoRenderable } from '@onlineclass/utils/hooks/use-video-renderable';
import { EduRoleTypeEnum } from 'agora-edu-core';
import { usePinStream } from '@onlineclass/utils/hooks/use-pin-stream';
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
        <AudioVolumeEffect></AudioVolumeEffect>
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
          <span>{stream?.fromUser.userName}</span>
          {stream?.isLocal && <span>&nbsp;(you)</span>}
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
    streamUIStore: { updateVideoDom, removeVideoDom },
    deviceSettingUIStore: { isLocalMirrorEnabled },
  } = useStore();
  const { pinStream } = usePinStream();
  const { videoRenderable } = useVideoRenderable();
  const handleDoubleClick = () => {
    if (stream) {
      pinStream(stream.stream.streamUuid);
    }
  };
  useEffect(() => {
    if (stream) {
      if (stream.isLocal) {
        ref.current &&
          videoRenderable &&
          setupLocalVideo(ref.current, isLocalMirrorEnabled, renderMode);
      } else {
        if (ref.current) {
          if (videoRenderable) {
            updateVideoDom(stream.stream.streamUuid, ref.current);
          } else {
            removeVideoDom(stream.stream.streamUuid);
          }
        }
        return () => {
          removeVideoDom(stream.stream.streamUuid);
        };
      }
    }
  }, [stream, stream?.isLocal, stream?.stream.streamUuid, videoRenderable]);

  return (
    <div ref={ref} onDoubleClick={handleDoubleClick} className="fcr-stream-window-player"></div>
  );
});

const UserInteract = observer(() => {
  const {
    layoutUIStore: { showStatusBar, showActiobBar },
  } = useStore();
  const streamWindowContext = useContext(StreamWindowContext);
  return (
    <div
      className={classnames(
        'fcr-stream-window-interact',
        `fcr-stream-window-interact-${streamWindowContext?.labelSize}`,
        {
          'fcr-stream-window-interact-with-status-bar-visible':
            streamWindowContext?.topLabelAnimation && showStatusBar,
          'fcr-stream-window-interact-with-action-bar-visible':
            streamWindowContext?.bottomLabelAnimation && showActiobBar,
        },
      )}>
      <div className="fcr-stream-window-interact-top">
        <InteractLabelGroup
          userUuid={streamWindowContext?.stream.fromUser.userUuid}
          placement={streamWindowContext?.placement}></InteractLabelGroup>
        <StreamActions></StreamActions>
      </div>
      <div className="fcr-stream-window-interact-bottom">
        <StreamWindowUserLabel></StreamWindowUserLabel>

        <StreamMuteIcon></StreamMuteIcon>
      </div>
    </div>
  );
});
const StreamMuteIcon = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const streamWindowMouseContext = useContext(StreamWindowMouseContext);

  const {
    statusBarUIStore: { isHost },
  } = useStore();
  const showAudioMuteAction =
    streamWindowMouseContext?.mouseEnterWindow &&
    isHost &&
    streamWindowContext?.stream.role === EduRoleTypeEnum.student;
  const showMicIcon = streamWindowContext?.showMicrophoneIconOnBottomRight && !showAudioMuteAction;
  const { handleMicrophoneClick } = useDeviceSwitch(streamWindowContext?.stream);
  return (
    <>
      {showAudioMuteAction && (
        <div
          onClick={handleMicrophoneClick}
          className={classnames(
            `fcr-stream-window-mute-icon fcr-stream-window-mute-icon-${streamWindowContext?.labelSize} fcr-bg-brand-6`,
          )}>
          <span> {streamWindowContext?.stream.isMicStreamPublished ? 'Mute' : 'Unmute'}</span>
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
    <div className={classnames('fcr-stream-window-actions', `fcr-stream-window-actions-${size}`)}>
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
    presentationUIStore: { pinnedUserUuid },
    boardApi: { grantPrivilege },
    classroomStore: {
      userStore: { kickOutOnceOrBan },
    },
    statusBarUIStore: { isHost },
  } = useStore();
  const { pinStream, removePinnedStream } = usePinStream();
  const streamWindowContext = useContext(StreamWindowContext);

  const pinned = pinnedUserUuid === streamWindowContext?.stream.fromUser.userUuid;

  const { cameraTooltip, micTooltip, handleCameraClick, handleMicrophoneClick } = useDeviceSwitch(
    streamWindowContext?.stream,
  );
  const userUuid = streamWindowContext?.stream.fromUser.userUuid || '';
  const streamUuid = streamWindowContext?.stream.stream.streamUuid || '';

  const showStreamWindowHostAction =
    isHost && streamWindowContext?.stream.role === EduRoleTypeEnum.student;

  const streamWindowActionItems = [
    {
      icon: (
        <SvgImg
          size={20}
          colors={{ iconPrimary: colors['custom-2'] }}
          type={SvgIconEnum.FCR_MUTE}></SvgImg>
      ),
      label: micTooltip,
      onClick: handleMicrophoneClick,
      visible: showStreamWindowHostAction,
    },
    {
      icon: (
        <SvgImg
          size={20}
          colors={{ iconPrimary: colors['custom-2'] }}
          type={SvgIconEnum.FCR_CAMERA}></SvgImg>
      ),
      label: cameraTooltip,
      onClick: handleCameraClick,
      visible: showStreamWindowHostAction,
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
      visible: showStreamWindowHostAction,
    },
    {
      icon: <SvgImg size={20} type={SvgIconEnum.FCR_REWARD}></SvgImg>,
      label: 'Reward',
      onClick: () => {
        if (userUuid) sendReward(userUuid);
      },
      visible: showStreamWindowHostAction,
    },
    {
      icon: <SvgImg size={20} type={SvgIconEnum.FCR_PIN}></SvgImg>,
      label: pinned ? 'Unpin' : 'Pin',
      onClick: async () => {
        pinned ? removePinnedStream() : pinStream(streamUuid);
      },
      visible: true,
    },
    {
      icon: (
        <SvgImg
          size={20}
          colors={{ iconPrimary: colors['red'][6] }}
          type={SvgIconEnum.FCR_ONELEAVE}></SvgImg>
      ),
      label: 'Remove',
      onClick: async () => {
        await kickOutOnceOrBan(userUuid, false);
      },
      visible: showStreamWindowHostAction,
    },
  ];
  return (
    <div className="fcr-stream-window-actions-popover">
      <div className="fcr-stream-window-actions-popover-name">
        {streamWindowContext?.stream.fromUser.userName}
      </div>
      <div className="fcr-stream-window-actions-popover-items">
        {streamWindowActionItems
          .filter((item) => item.visible)
          .map((item, index) => {
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
                {index % 2 === 1 && (
                  <div className="fcr-stream-window-actions-popover-divider"></div>
                )}
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

  return true ? (
    <div
      className={classnames(
        'fcr-stream-window-user-label',
        `fcr-stream-window-user-label-${streamWindowContext?.labelSize}`,
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
  ) : (
    <div></div>
  );
});
const AudioVolumeEffect = observer(
  ({
    duration = 3000,
    minTriggerVolume = 35,
  }: {
    duration?: number;
    minTriggerVolume?: number;
  }) => {
    const streamWindowContext = useContext(StreamWindowContext);
    const stream = streamWindowContext?.stream;
    const {
      streamUIStore: { localVolume, remoteStreamVolume },
      deviceSettingUIStore: { isAudioRecordingDeviceEnabled },
    } = useStore();
    const [showAudioVolumeEffect, setShowAudioVolumeEffect] = useState(false);
    const timer = useRef<number | null>(null);
    const showAudioEffect = () => {
      setShowAudioVolumeEffect(true);
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => {
        setShowAudioVolumeEffect(false);
        timer.current = null;
      }, duration);
    };
    useEffect(() => {
      if (stream?.stream.isLocal) {
        if (localVolume > minTriggerVolume && isAudioRecordingDeviceEnabled) {
          showAudioEffect();
        }
      } else {
        const remoteVolume = remoteStreamVolume(stream);
        if (remoteVolume > minTriggerVolume && stream?.isMicStreamPublished) {
          showAudioEffect();
        }
      }
    }, [
      localVolume,
      remoteStreamVolume(stream),
      isAudioRecordingDeviceEnabled,
      stream?.isMicStreamPublished,
    ]);
    return showAudioVolumeEffect ? <div className={'fcr-audio-volume-effect'}></div> : null;
  },
);
