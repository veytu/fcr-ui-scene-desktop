import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.css';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { EduRoleTypeEnum } from 'agora-edu-core';
import { Layout } from '@onlineclass/uistores/type';
const interactLabelGroupSizeMap = {
  'status-bar': 'normal',
  'list-view': 'small',
  'main-view': 'large',
};
export const InteractLabelGroup = observer(
  ({
    userUuid = '',
    placement = 'list-view',
  }: {
    userUuid?: string;
    placement?: 'status-bar' | 'list-view' | 'main-view';
  }) => {
    const {
      classroomStore: {
        userStore: { rewards, users },
      },
      streamUIStore: { isUserGranted },
      presentationUIStore: { pinnedUserUuid },
      layoutUIStore: { layout },
    } = useStore();
    const currentUser = users.get(userUuid);
    const reward = rewards.get(userUuid);
    const isGranted = isUserGranted(userUuid);
    const showReward = currentUser?.userRole === EduRoleTypeEnum.student;
    const showPinned =
      pinnedUserUuid === userUuid && placement !== 'status-bar' && layout !== Layout.Grid;
    return (
      <div
        className={classnames(
          'fcr-stream-window-student-interact-group',
          `fcr-stream-window-student-interact-group-${interactLabelGroupSizeMap[placement]}`,
        )}>
        {isGranted && (
          <div className="fcr-stream-window-student-interact-item fcr-bg-yellowwarm">
            <SvgImg type={SvgIconEnum.FCR_HOST}></SvgImg>
          </div>
        )}
        {showReward && (
          <div className="fcr-stream-window-student-interact-item  fcr-bg-brand-6">
            <SvgImg type={SvgIconEnum.FCR_STAR}></SvgImg>
            <span>{reward || 0}</span>
          </div>
        )}

        {showPinned && (
          <div className="fcr-stream-window-student-interact-item  fcr-bg-1">
            <SvgImg type={SvgIconEnum.FCR_PIN}></SvgImg>
          </div>
        )}

        {/* <div className="fcr-stream-window-student-interact-item  fcr-bg-brand-6">
          <SvgImg
            type={SvgIconEnum.FCR_STUDENT_RASIEHAND}
            ></SvgImg>
        </div> */}
      </div>
    );
  },
);
