import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.css';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
export const StudentInteractLabelGroup = observer(
  ({ userUuid, size }: { userUuid: string; size: 'large' | 'normal' | 'small' }) => {
    const {
      classroomStore: {
        userStore: { rewards },
      },
      streamUIStore: { isUserGranted },
    } = useStore();
    const reward = rewards.get(userUuid);
    const isGranted = isUserGranted(userUuid);
    return (
      <div
        className={classnames(
          'fcr-stream-window-student-interact-group',
          `fcr-stream-window-student-interact-group-${size}`,
        )}>
        {isGranted && (
          <div className="fcr-stream-window-student-interact-item fcr-bg-yellowwarm">
            <SvgImg type={SvgIconEnum.FCR_HOST}></SvgImg>
          </div>
        )}
        <div className="fcr-stream-window-student-interact-item  fcr-bg-brand-6">
          <SvgImg type={SvgIconEnum.FCR_STAR}></SvgImg>
          <span>{reward || 0}</span>
        </div>
        {/* <div className="fcr-stream-window-student-interact-item  fcr-bg-brand-6">
          <SvgImg
            type={SvgIconEnum.FCR_STUDENT_RASIEHAND}
            ></SvgImg>
        </div> */}
      </div>
    );
  },
);
