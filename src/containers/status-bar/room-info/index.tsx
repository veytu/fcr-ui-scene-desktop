import { DoubleDeckPopoverWithTooltip, PopoverWithTooltip } from '@components/popover';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { ToastApi } from '@components/toast';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import ClipboardJS from 'clipboard';
import { FC, useEffect, useRef } from 'react';
import { StatusBarItemWrapper } from '..';
import { NetworkConnection, NetworkDetail } from '../network';
import { Share } from '../share';
import classnames from 'classnames';

import './index.css';
export const StatusBarInfo: FC = () => {
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
          toolTipProps={{ content: 'Show Network Details', placement: 'bottomLeft' }}>
          <div className="fcr-status-bar-info-network">
            <SvgImg type={SvgIconEnum.FCR_V2_SIGNAL_GOOD} size={20}></SvgImg>
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
            <SvgImg type={SvgIconEnum.FCR_SHARE} size={20}></SvgImg>
          </div>
        </PopoverWithTooltip>
      </div>
    </StatusBarItemWrapper>
  );
};
export const StatusBarRoomName = () => {
  const {
    statusBarUIStore: { roomName },
  } = useStore();
  return (
    <StatusBarItemWrapper>
      <div className={classnames('fcr-status-bar-room-name')}>{roomName}</div>
    </StatusBarItemWrapper>
  );
};
