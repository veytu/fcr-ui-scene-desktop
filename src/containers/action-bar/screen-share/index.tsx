import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { ActionBarItem } from '..';
import { observer } from 'mobx-react';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { themeVal } from '@ui-kit-utils/tailwindcss';
import { InfoToolTip } from '@components/tooltip/info';
import { Button } from '@components/button';
import { createPortal } from 'react-dom';

export const ScreenShare = observer(() => {
  const {
    actionBarUIStore: { isLocalScreenSharing, startLocalScreenShare },
  } = useStore();
  const colors = themeVal('colors');
  const handleScreenShare = () => {
    if (!isLocalScreenSharing) {
      startLocalScreenShare();
    }
  };
  const icon = isLocalScreenSharing
    ? SvgIconEnum.FCR_SCREENSHARING_ON
    : SvgIconEnum.FCR_SCREENSHARING;
  const colorByStatus = isLocalScreenSharing ? colors['red']['6'] : colors['green'];
  const ScreenShareToolTip = isLocalScreenSharing ? InfoToolTip : ToolTip;
  return (
    <>
      {isLocalScreenSharing && <ScreenShareStatusBar></ScreenShareStatusBar>}
      <ScreenShareToolTip
        mouseEnterDelay={isLocalScreenSharing ? 0 : 1}
        content={
          isLocalScreenSharing ? (
            <ScreenSharingTooltipContent></ScreenSharingTooltipContent>
          ) : (
            'ScreenShare'
          )
        }>
        <ActionBarItem
          onClick={handleScreenShare}
          icon={{
            type: icon,
            colors: { iconPrimary: colorByStatus },
          }}
          text={<span style={{ color: colorByStatus }}>ScreenShare</span>}></ActionBarItem>
      </ScreenShareToolTip>
    </>
  );
});
const ScreenSharingTooltipContent = observer(() => {
  const {
    actionBarUIStore: { stopLocalScreenShare },
  } = useStore();
  return (
    <div className="fcr-action-bar-screen-share-tooltip">
      <span>Click to Stop Sharing</span>
      <Button onClick={stopLocalScreenShare} size="XS" shape="rounded" styleType="danger">
        Stop Sharing
      </Button>
    </div>
  );
});

const ScreenShareStatusBar = observer(() => {
  const {
    actionBarUIStore: { stopLocalScreenShare },
  } = useStore();
  return createPortal(
    <div className="fcr-screen-share-status-bar">
      <span>Screen Sharing...</span>
      <Button onClick={stopLocalScreenShare} size="XS" shape="rounded" styleType="danger">
        Stop Sharing
      </Button>
    </div>,
    document.body,
  );
});
