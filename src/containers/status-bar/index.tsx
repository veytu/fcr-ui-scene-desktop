import { FC } from 'react';
import classnames from 'classnames';
import './index.css';

import { LayoutSwitch } from './layout-switch';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { ClassDuration } from './class-duration';
import { RecordStatus } from './record-status';
import { AgoraOnlineclassSDK } from '@onlineclass/index';

import { observer } from 'mobx-react';
import { StatusBarInfo, StatusBarRoomName } from './room-info';
import { FullscreenButton } from './fullscreen';

export const StatusBar = observer(() => {
  const {
    layoutUIStore: { showStatusBar, setIsPointingBar, noAvailabelStream },
  } = useStore();
  const { logo } = AgoraOnlineclassSDK;
  return (
    <div
      className={classnames('fcr-status-bar', {
        'fcr-status-bar-hide': !showStatusBar,
        'fcr-bg-transparent': noAvailabelStream,
      })}
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

export const StatusBarItemWrapper: FC<React.PropsWithChildren> = (props) => {
  const { children, ...others } = props;
  return (
    <div {...others} className="fcr-status-bar-item-wrapper">
      {children}
    </div>
  );
};
