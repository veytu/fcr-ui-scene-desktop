import './index.css';
import { observer } from 'mobx-react';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { ToolTip } from '@onlineclass/components/tooltip';
import { StatusBarItemWrapper } from '..';
import classnames from 'classnames';
export const ClassDuration = observer(() => {
  const {
    statusBarUIStore: { classStatusText, afterClass },
  } = useStore();
  return (
    <ToolTip content={'Class time'}>
      <StatusBarItemWrapper>
        <div
          className={classnames('fcr-status-bar-class-duration', {
            'fcr-status-bar-class-duration-danger': afterClass,
          })}>
          {classStatusText}
        </div>
      </StatusBarItemWrapper>
    </ToolTip>
  );
});
