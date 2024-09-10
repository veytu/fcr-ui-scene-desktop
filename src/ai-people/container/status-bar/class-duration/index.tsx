import './index.css';
import { observer } from 'mobx-react';
import { ToolTip } from '@components/tooltip';
import { StatusBarItemWrapper } from '..';
import classnames from 'classnames';
import { useI18n } from 'agora-common-libs';
import { useStore } from '@ui-scene/ai-people/utils/hooks/use-store';
export const ClassDuration = observer(() => {
  const transI18n = useI18n();
  const {
    statusBarUIStore: { classStatusText, afterClass },
  } = useStore();
  return (
    <ToolTip content={transI18n('fcr_room_tips_class_time')}>
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
