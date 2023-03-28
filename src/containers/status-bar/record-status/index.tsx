import './index.css';
import { observer } from 'mobx-react';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { StatusBarItemWrapper } from '..';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { ToolTip } from '@onlineclass/components/tooltip';
import { themeVal } from '@onlineclass/utils/tailwindcss';
const colors = themeVal('colors');

export const RecordStatus = observer(() => {
  const {
    statusBarUIStore: { isRecording },
  } = useStore();
  return (
    <StatusBarItemWrapper>
      <div className="fcr-status-bar-record">
        <div className="fcr-status-bar-record-status">
          <SvgImg
            colors={{
              iconPrimary: isRecording ? colors['red.6'] : colors['notsb-inverse'],
            }}
            type={SvgIconEnum.FCR_RECORDING_STOP}></SvgImg>
          <span>Recording</span>
        </div>
        <ToolTip content="Click to pause">
          <div className="fcr-status-bar-record-action fcr-divider">
            <SvgImg
              type={isRecording ? SvgIconEnum.FCR_STOP : SvgIconEnum.FCR_RECORDING_PLAY}></SvgImg>
          </div>
        </ToolTip>
      </div>
    </StatusBarItemWrapper>
  );
});
