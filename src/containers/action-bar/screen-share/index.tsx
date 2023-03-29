import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ToolTip } from '@onlineclass/components/tooltip';
import { ActionBarItem } from '..';
import { observer } from 'mobx-react';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { themeVal } from '@onlineclass/utils/tailwindcss';
const colors = themeVal('colors');
export const ScreenShare = observer(() => {
  const {
    actionBarUIStore: { isLocalScreenSharing, startLocalScreenShare, stopLocalScreenShare },
  } = useStore();
  const handleScreenShare = () => {
    if (!isLocalScreenSharing) {
      startLocalScreenShare();
    }
  };
  const icon = isLocalScreenSharing
    ? SvgIconEnum.FCR_SCREENSHARING_ON
    : SvgIconEnum.FCR_SCREENSHARING;
  const colorByStatus = isLocalScreenSharing ? colors['red']['6'] : colors['green'];
  return (
    <ToolTip content={'ScreenShare'}>
      <ActionBarItem
        onClick={handleScreenShare}
        icon={{
          type: icon,
          colors: { iconPrimary: colorByStatus },
        }}
        text={<span style={{ color: colorByStatus }}>ScreenShare</span>}></ActionBarItem>
    </ToolTip>
  );
});
