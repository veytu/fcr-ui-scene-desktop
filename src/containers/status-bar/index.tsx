import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { FC, useEffect, useState } from 'react';
import classnames from 'classnames';
import { ToolTip } from '@onlineclass/components/tooltip';
import { DoubleDeckPopoverWithTooltip, PopoverWithTooltip } from '@onlineclass/components/popover';
import './index.css';
import { NetworkDetail, NetworkConnection } from './network';
import { Share } from './share';
import { LayoutSwitch } from './layout-switch';
export const StatusBar = () => {
  return (
    <div className="fcr-status-bar">
      <div className="fcr-status-bar-left">
        <div className="fcr-status-bar-logo">
          <SvgImg type={SvgIconEnum.FCR_BTN_LOADING} size={32}></SvgImg>
        </div>
        <StatusBarInfo />
        <StatusBarRoomName></StatusBarRoomName>
      </div>
      <div className="fcr-status-bar-right">
        <RecordStatus></RecordStatus>
        <ClassDuration></ClassDuration>
        <Layout></Layout>
        <FullscreenButton></FullscreenButton>
      </div>
    </div>
  );
};

const StatusBarItemWrapper: FC = (props) => {
  const { children, ...others } = props;
  return (
    <div {...others} className="fcr-status-bar-item-wrapper">
      {children}
    </div>
  );
};
const StatusBarInfo: FC = () => {
  return (
    <StatusBarItemWrapper>
      <div className="fcr-status-bar-info">
        <DoubleDeckPopoverWithTooltip
          doulebDeckPopoverProps={{
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
          <span>234 223 223</span>
        </div>
        <PopoverWithTooltip
          popoverProps={{
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
  return (
    <StatusBarItemWrapper>
      <div className={classnames('fcr-status-bar-room-name')}>
        How to build a good model with C4D？
      </div>
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
const Layout = () => {
  return (
    <StatusBarItemWrapper>
      <PopoverWithTooltip
        popoverProps={{
          placement: 'bottomLeft',
          overlayInnerStyle: { width: 'auto' },
          content: <LayoutSwitch></LayoutSwitch>,
        }}
        toolTipProps={{ content: 'Switch Layout' }}>
        <div className="fcr-status-bar-layout">
          <SvgImg type={SvgIconEnum.FCR_TOPWINDOWS}></SvgImg>
          <span>Layout</span>
          <SvgImg type={SvgIconEnum.FCR_DROPDOWN} size={20}></SvgImg>
        </div>
      </PopoverWithTooltip>
    </StatusBarItemWrapper>
  );
};
const ClassDuration = () => {
  return (
    <ToolTip content={'Class time'}>
      <StatusBarItemWrapper>
        <div className="fcr-status-bar-class-duration">59:59</div>
      </StatusBarItemWrapper>
    </ToolTip>
  );
};
const RecordStatus = () => {
  return (
    <StatusBarItemWrapper>
      <div className="fcr-status-bar-record">
        <div className="fcr-status-bar-record-status">
          <SvgImg type={SvgIconEnum.FCR_RECORDING_STOP}></SvgImg>
          <span>Recording</span>
        </div>
        <ToolTip content="Click to pause">
          <div className="fcr-status-bar-record-action fcr-divider">
            <SvgImg type={SvgIconEnum.FCR_STOP}></SvgImg>
          </div>
        </ToolTip>
      </div>
    </StatusBarItemWrapper>
  );
};