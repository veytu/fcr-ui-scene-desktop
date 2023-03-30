import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { FC, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { ToolTip } from '@onlineclass/components/tooltip';
import { DoubleDeckPopoverWithTooltip, PopoverWithTooltip } from '@onlineclass/components/popover';
import './index.css';
import { NetworkDetail, NetworkConnection } from './network';
import { Share } from './share';
import { LayoutSwitch } from './layout-switch';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { ClassDuration } from './class-duration';
import { RecordStatus } from './record-status';
import { AgoraOnlineclassSDK } from '@onlineclass/index';
import ClipboardJS from 'clipboard';
import { ToastApi } from '@onlineclass/components/toast';
import { observer } from 'mobx-react';

export const StatusBar = observer(() => {
  const {
    layoutUIStore: { showStatusBar, setIsPointingBar },
  } = useStore();
  const { logo } = AgoraOnlineclassSDK;
  return (
    <div
      className={classnames('fcr-status-bar', { 'fcr-status-bar-hide': !showStatusBar })}
      onMouseEnter={() => {
        setIsPointingBar(true);
      }}
      onMouseLeave={() => {
        setIsPointingBar(false);
      }}>
      <div className="fcr-status-bar-left">
        {logo && (
          <div className="fcr-status-bar-logo">
            <img src={logo}></img>
          </div>
        )}

        <StatusBarInfo />
        <StatusBarRoomName></StatusBarRoomName>
      </div>
      <div className="fcr-status-bar-right">
        <RecordStatus></RecordStatus>
        <ClassDuration></ClassDuration>
        <LayoutSwitch></LayoutSwitch>
        <FullscreenButton></FullscreenButton>
      </div>
    </div>
  );
});

export const StatusBarItemWrapper: FC = (props) => {
  const { children, ...others } = props;
  return (
    <div {...others} className="fcr-status-bar-item-wrapper">
      {children}
    </div>
  );
};
const StatusBarInfo: FC = () => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const {
    statusBarUIStore: { roomUuid },
    layoutUIStore: { setHasPopoverShowed },
  } = useStore();
  useEffect(() => {
    let clipboard: ClipboardJS | undefined;
    if (ref.current) {
      clipboard = new ClipboardJS(ref.current);
      clipboard.on('success', () => {
        ToastApi.open({
          toastProps: {
            type: 'info',
            content: 'copy success',
          },
        });
      });
    }
    return () => {
      clipboard?.destroy();
    };
  }, []);
  return (
    <StatusBarItemWrapper>
      <div className="fcr-status-bar-info">
        <DoubleDeckPopoverWithTooltip
          doulebDeckPopoverProps={{
            onVisibleChange(visible) {
              if (visible) {
                setHasPopoverShowed(true);
              } else {
                setHasPopoverShowed(false);
              }
            },
            placement: 'bottomRight',
            topDeckContent: <NetworkConnection></NetworkConnection>,
            bottomDeckContent: <NetworkDetail></NetworkDetail>,
          }}
          toolTipProps={{ content: 'Show Network Details' }}>
          <div className="fcr-status-bar-info-network">
            <SvgImg type={SvgIconEnum.FCR_V2_SIGNAL_GOOD}></SvgImg>
          </div>
        </DoubleDeckPopoverWithTooltip>
        <div className={classnames('fcr-status-bar-info-id', 'fcr-divider')}>
          <span>ID:</span>
          <span ref={ref} data-clipboard-text={roomUuid}>
            {roomUuid}
          </span>
        </div>
        <PopoverWithTooltip
          popoverProps={{
            onVisibleChange(visible) {
              if (visible) {
                setHasPopoverShowed(true);
              } else {
                setHasPopoverShowed(false);
              }
            },
            overlayInnerStyle: {
              width: 'auto',
            },
            content: <Share></Share>,
          }}
          toolTipProps={{ content: 'Sharing conference chain' }}>
          <div className="fcr-status-bar-info-share">
            <SvgImg type={SvgIconEnum.FCR_SHARE}></SvgImg>
          </div>
        </PopoverWithTooltip>
      </div>
    </StatusBarItemWrapper>
  );
};
const StatusBarRoomName = () => {
  const {
    statusBarUIStore: { roomName },
  } = useStore();
  return (
    <StatusBarItemWrapper>
      <div className={classnames('fcr-status-bar-room-name')}>{roomName}</div>
    </StatusBarItemWrapper>
  );
};
const FullscreenButton = () => {
  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  };
  const handleFullscreenChanged = () => {
    if (document.fullscreenElement) {
      setFullscreen(true);
    } else {
      setFullscreen(false);
    }
  };
  useEffect(() => {
    document.body.addEventListener('fullscreenchange', handleFullscreenChanged);
    () => document.body.removeEventListener('fullscreenchange', handleFullscreenChanged);
  }, []);
  return (
    <ToolTip placement="bottomRight" content={'Full-screen mode in the webpage'}>
      <StatusBarItemWrapper>
        <div onClick={toggleFullscreen} className="fcr-status-bar-fullscreen">
          <SvgImg
            type={
              fullscreen ? SvgIconEnum.FCR_WINDOW_SMALLER : SvgIconEnum.FCR_WINDOW_BIGGER
            }></SvgImg>
        </div>
      </StatusBarItemWrapper>
    </ToolTip>
  );
};
