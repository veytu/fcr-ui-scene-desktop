import { useStore } from '@onlineclass/utils/hooks/use-store';
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
import { Avatar } from '@components/avatar';
import { Layout } from '@onlineclass/uistores/type';

import { SvgaPlayer } from '@components/svga-player';
import { SoundPlayer } from '@components/sound-player';
import RewardSVGA from './assets/svga/reward.svga';
import RewardSound from './assets/audio/reward.mp3';

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
        {streamWindowContext?.streamPlayerVisible && (
          <StreamPlayer key={streamWindowContext.stream.stream.streamUuid}></StreamPlayer>
        )}
        <UserInteract></UserInteract>
        <AwardAnimations></AwardAnimations>
        {<AudioVolumeEffect></AudioVolumeEffect>}
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
        <Avatar size={81} textSize={30} nickName={stream?.fromUser.userName || ''}></Avatar>
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
    streamUIStore: { updateVideoDom, removeVideoDom, pinDisabled },
    deviceSettingUIStore: { isLocalMirrorEnabled },
  } = useStore();
  const { addPin } = usePinStream();
  const { videoRenderable } = useVideoRenderable();
  const handleDoubleClick = () => {
    if (stream) {
      !pinDisabled && addPin(stream.stream.streamUuid);
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
    layoutUIStore: { showStatusBar, showActiobBar, showListView, layout },
  } = useStore();
  const streamWindowContext = useContext(StreamWindowContext);
  return (
    <div
      className={classnames(
        'fcr-stream-window-interact',
        `fcr-stream-window-interact-${streamWindowContext?.labelSize}`,
        {
          'fcr-stream-window-interact-with-status-bar-visible':
            (streamWindowContext?.topLabelAnimation &&
              showStatusBar &&
              layout !== Layout.ListOnTop) ||
            (streamWindowContext?.topLabelAnimation &&
              !showListView &&
              showStatusBar &&
              layout === Layout.ListOnTop),
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

        <StreamBottomRightAudioStatus></StreamBottomRightAudioStatus>
      </div>
    </div>
  );
});
const MuteIcon = ({ size, visible }: { size: 'large' | 'small'; visible: boolean }) => {
  const streamWindowContext = useContext(StreamWindowContext);

  const { handleMicrophoneClick } = useDeviceSwitch(streamWindowContext?.stream);

  return visible ? (
    <div
      onClick={handleMicrophoneClick}
      className={classnames(
        `fcr-stream-window-mute-icon fcr-stream-window-mute-icon-${size} fcr-bg-brand-6`,
      )}>
      <span> {streamWindowContext?.stream.isMicStreamPublished ? 'Mute' : 'Unmute'}</span>
    </div>
  ) : null;
};
const StreamBottomRightAudioStatus = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const streamWindowMouseContext = useContext(StreamWindowMouseContext);
  const {
    statusBarUIStore: { isHost },
  } = useStore();
  const showAudioMuteAction =
    streamWindowMouseContext?.mouseEnterWindow &&
    isHost &&
    streamWindowContext?.stream.role === EduRoleTypeEnum.student &&
    streamWindowContext.renderAtListView;
  const showMicIcon = streamWindowContext?.showMicrophoneIconOnBottomRight && !showAudioMuteAction;

  return (
    <>
      <MuteIcon size="small" visible={!!showAudioMuteAction}></MuteIcon>
      {showMicIcon && (
        <div className="fcr-stream-window-bottom-right-mic">
          <AudioRecordinDeviceIcon
            size={18}
            stream={streamWindowContext.stream}></AudioRecordinDeviceIcon>
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
    participantsUIStore: { sendReward },
    streamUIStore: { pinnedStreamUuid, pinDisabled },
    boardApi: { grantPrivilege },
    classroomStore: {
      userStore: { kickOutOnceOrBan },
    },
    statusBarUIStore: { isHost },
  } = useStore();
  const { addPin, removePin } = usePinStream();

  const pinned = pinnedStreamUuid === streamWindowContext?.stream.stream.streamUuid;

  const {
    cameraTooltip,
    micTooltip,
    handleCameraClick,
    handleMicrophoneClick,
    micEnabled,
    cameraEnabled,
  } = useDeviceSwitch(streamWindowContext?.stream);
  const userUuid = streamWindowContext?.stream.fromUser.userUuid || '';
  const streamUuid = streamWindowContext?.stream.stream.streamUuid || '';

  const showStreamWindowHostAction =
    isHost && streamWindowContext?.stream.role === EduRoleTypeEnum.student;
  const streamWindowActionItems = [
    {
      key: 'mic',
      icon: (
        <SvgImg
          size={20}
          colors={{ iconSecondary: colors['red']['6'] }}
          type={micEnabled ? SvgIconEnum.FCR_NOMUTE : SvgIconEnum.FCR_MUTE}></SvgImg>
      ),
      label: micTooltip,
      onClick: handleMicrophoneClick,
      visible: showStreamWindowHostAction,
    },
    {
      key: 'camera',

      icon: (
        <SvgImg
          size={20}
          colors={{ iconSecondary: colors['red']['6'] }}
          type={cameraEnabled ? SvgIconEnum.FCR_CAMERAOFF : SvgIconEnum.FCR_CAMERA}></SvgImg>
      ),
      label: cameraTooltip,
      onClick: handleCameraClick,
      visible: showStreamWindowHostAction,
    },
    {
      key: 'auth',

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
      key: 'reward',

      icon: <SvgImg size={20} type={SvgIconEnum.FCR_REWARD}></SvgImg>,
      label: 'Reward',
      onClick: () => {
        if (userUuid) sendReward(userUuid);
      },
      visible: showStreamWindowHostAction,
    },
    {
      key: 'pin',

      icon: (
        <SvgImg size={20} type={pinned ? SvgIconEnum.FCR_REMOVE_PIN : SvgIconEnum.FCR_PIN}></SvgImg>
      ),
      label: pinned ? 'Remove Pin' : 'Add Pin',
      onClick: async () => {
        pinned ? removePin() : addPin(streamUuid);
      },
      visible: !pinDisabled,
    },
    {
      key: 'remove',

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
  const streamWindowActionVisibleItems = streamWindowActionItems.filter((item) => item.visible);

  const showAudioMuteAction =
    streamWindowMouseContext?.mouseEnterWindow &&
    isHost &&
    streamWindowContext?.stream.role === EduRoleTypeEnum.student &&
    streamWindowContext.renderAtMainView;
  useEffect(() => {
    if (!streamWindowMouseContext?.mouseEnterWindow) {
      setPopoverVisibel(false);
    }
  }, [streamWindowMouseContext?.mouseEnterWindow]);

  return streamWindowActionVisibleItems.length > 0 ? (
    <div className={classnames('fcr-stream-window-actions', `fcr-stream-window-actions-${size}`)}>
      <MuteIcon size="large" visible={!!showAudioMuteAction}></MuteIcon>
      {streamWindowMouseContext?.mouseEnterWindow && (
        <Popover
          visible={popoverVisible}
          onVisibleChange={setPopoverVisibel}
          overlayInnerStyle={{ width: 'auto' }}
          placement="bottomRight"
          mouseEnterDelay={0}
          content={
            <StreamActionPopover
              userName={streamWindowContext?.stream.userName || ''}
              items={streamWindowActionVisibleItems}
              onItemClick={() => setPopoverVisibel(false)}></StreamActionPopover>
          }>
          <div className="fcr-stream-window-actions-item fcr-bg-brand-6">
            <SvgImg
              type={SvgIconEnum.FCR_MOBILE_MORE}
              size={streamWindowContext?.labelIconSize}></SvgImg>
          </div>
        </Popover>
      )}
    </div>
  ) : null;
});

const StreamActionPopover = observer(
  ({
    onItemClick,
    userName,
    items,
  }: {
    onItemClick: () => void;
    userName: string;
    items: {
      key: string;
      icon: JSX.Element;
      label: string;
      onClick: () => void;
      visible: boolean;
    }[];
  }) => {
    return (
      <div className="fcr-stream-window-actions-popover">
        <div className="fcr-stream-window-actions-popover-name">{userName}</div>
        <div className="fcr-stream-window-actions-popover-items">
          {items.map((item, index) => {
            const addDivider =
              index !== items.length - 1 && (item.key === 'camera' || item.key === 'pin');

            return (
              <>
                <div
                  key={item.key}
                  className="fcr-stream-window-actions-popover-item"
                  onClick={() => {
                    item.onClick();
                    onItemClick();
                  }}>
                  {item.icon}
                  <div className="fcr-stream-window-actions-popover-item-label">{item.label}</div>
                </div>
                {addDivider && <div className="fcr-stream-window-actions-popover-divider"></div>}
              </>
            );
          })}
        </div>
      </div>
    );
  },
);

const StreamWindowUserLabel = observer(() => {
  const streamWindowContext = useContext(StreamWindowContext);
  const stream = streamWindowContext?.stream;
  const streamWindowMouseContext = useContext(StreamWindowMouseContext);

  return streamWindowMouseContext?.mouseEnterClass ? (
    <div
      className={classnames(
        'fcr-stream-window-user-label',
        `fcr-stream-window-user-label-${streamWindowContext?.labelSize}`,
      )}>
      {streamWindowContext?.showHostLabel && (
        <div className="fcr-stream-window-user-role">
          {streamWindowContext.showMicrophoneIconOnRoleLabel && (
            <AudioRecordinDeviceIcon
              stream={streamWindowContext.stream}
              size={streamWindowContext?.audioIconSize}></AudioRecordinDeviceIcon>
          )}

          <span>Host</span>
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

const AwardAnimations = observer(() => {
  const {
    streamUIStore: { streamAwardAnims, removeAward },
  } = useStore();
  const streamWindowContext = useContext(StreamWindowContext);
  const stream = streamWindowContext?.stream;
  return stream ? (
    <div className="fcr-stream-window-reward-anim">
      {streamAwardAnims(stream).map((anim: { id: string; userUuid: string }) => {
        return (
          <SvgaPlayer
            key={anim.id}
            style={{ position: 'absolute' }}
            url={RewardSVGA}
            onFinish={() => {
              removeAward(anim.id);
            }}></SvgaPlayer>
        );
      })}

      {streamAwardAnims(stream).map((anim: { id: string; userUuid: string }) => {
        return <SoundPlayer url={RewardSound} key={anim.id} />;
      })}
    </div>
  ) : null;
});
