import { FC, PropsWithChildren } from 'react';
import classnames from 'classnames';
import './index.css';
import { useStore } from '@ui-scene/utils/hooks/use-store';
import { ClassDuration } from './class-duration';
import { observer } from 'mobx-react';
import { StatusBarInfo, StatusBarRoomName } from './room-info';
import { FullscreenButton } from './fullscreen';
import { getConfig } from '@ui-scene/utils/launch-options-holder';
import { Leave } from './leave';

export const StatusBar = observer(() => {
  const {
    layoutUIStore: { setIsPointingBar, noAvailabelStream },
  } = useStore();
  const { logo } = getConfig();
  return (
    <div
      className={classnames('fcr-status-bar', {
        'fcr-bg-transparent': noAvailabelStream,
      })}
      onMouseEnter={() => {
        setIsPointingBar(true);
      }}
      onMouseLeave={() => {
        setIsPointingBar(false);
      }}>
      <div className="fcr-status-bar-left">
        <>
          {logo && (<div className="fcr-status-bar-logo"><img src={logo as string}></img></div>)}
          <StatusBarInfo />
        </>
      </div>
      <StatusBarRoomName></StatusBarRoomName>
      <div className="fcr-status-bar-right">
        <ClassDuration></ClassDuration>
        <FullscreenButton></FullscreenButton>
        <Leave></Leave>
      </div>
    </div>
  );
});

export const StatusBarItemWrapper: FC<PropsWithChildren<any>> = (props) => {
  const { children, ...others } = props;
  return (
    <div {...others} className="fcr-status-bar-item-wrapper">
      {children}
    </div>
  );
};
