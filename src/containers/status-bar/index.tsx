import { FC } from 'react';
import classnames from 'classnames';
import './index.css';

import { LayoutSwitch } from './layout-switch';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { ClassDuration } from './class-duration';
import { RecordStatus } from './record-status';

import { observer } from 'mobx-react';
import { StatusBarInfo, StatusBarRoomName } from './room-info';
import { FullscreenButton } from './fullscreen';
import { getConfig } from '@onlineclass/utils/launch-options-holder';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { Layout } from '@onlineclass/uistores/type';
import { StatusBarWidgetSlot } from './widgets';
import { StudentInteractLabelGroup } from '../common/student-interact-labels';
import { ToolTip } from '@components/tooltip';

export const StatusBar = observer(() => {
  const {
    layoutUIStore: { showStatusBar, setIsPointingBar, noAvailabelStream },
    statusBarUIStore: { localUser, isStudent },
  } = useStore();
  const { logo } = getConfig();
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
        <>
          {logo && (
            <div className="fcr-status-bar-logo">
              <img src={logo as string}></img>
            </div>
          )}

          <StatusBarInfo />
          <StatusBarRoomName></StatusBarRoomName>
        </>
      </div>
      <div className="fcr-status-bar-right">
        <StatusBarWidgetSlot></StatusBarWidgetSlot>
        {isStudent && localUser && (
          <StudentInteractLabelGroup
            userUuid={localUser.userUuid}
            size={'normal'}></StudentInteractLabelGroup>
        )}

        <RecordStatus></RecordStatus>
        <ClassDuration></ClassDuration>
        <LayoutSwitch></LayoutSwitch>
        <FullscreenButton></FullscreenButton>
      </div>
      <StatusBarCollapeButton></StatusBarCollapeButton>
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
const StatusBarCollapeButton = observer(() => {
  const {
    presentationUIStore: { showListView, toggleShowListView },
    layoutUIStore: { layout },
  } = useStore();
  const visible = !showListView && layout === Layout.ListOnTop;
  return visible ? (
    <ToolTip placement="bottom" content={'Show lectern'}>
      <div className="fcr-status-bar-collapse-button" onClick={toggleShowListView}>
        <SvgImg type={SvgIconEnum.FCR_UP2} size={48}></SvgImg>
      </div>
    </ToolTip>
  ) : null;
});
