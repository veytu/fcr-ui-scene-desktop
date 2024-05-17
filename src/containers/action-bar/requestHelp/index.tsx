import { SvgIconEnum, SvgImg } from "@components/svg-img"
import { ToolTip } from "@components/tooltip";
import { useStore } from "@ui-scene/utils/hooks/use-store";
import { useI18n } from 'agora-common-libs';
import { observer } from "mobx-react";
import './index.css'
import { useEffect, useMemo, useRef, useState } from "react";
import { ToastApi } from "@components/toast";
import { AGServiceErrorCode } from "agora-edu-core";
import { AGError } from "agora-rte-sdk";
import classNames from "classnames";

export const RequestHelp = observer(() => {
    const transI18n = useI18n();
    const [isHasRequest, setIsHasRequest] = useState(false)
    const {
        layoutUIStore: { addDialog, showStatusBar },
        breakoutUIStore: { teacherGroupUuid },
        classroomStore,
      } = useStore();
      const teacherGroupUuidRef = useRef<string | undefined>(teacherGroupUuid);
      useEffect(() => {
        teacherGroupUuidRef.current = teacherGroupUuid;
      }, [teacherGroupUuid]);
      const { currentSubRoom } = classroomStore.groupStore;
      const isTeacherIn = useMemo(() => teacherGroupUuid === currentSubRoom, [teacherGroupUuid, currentSubRoom]);
      const handleClick = () => {
        console.log(teacherGroupUuid, isTeacherIn)
        if (teacherGroupUuid && isTeacherIn) {
            ToastApi.open({
              toastProps: {
                content: transI18n('fcr_group_teacher_exist_hint'),
                type: 'info',
              },
            });
            return;
          }
        if (!isHasRequest) {
            const { updateGroupUsers, currentSubRoom } = classroomStore.groupStore;
            const teachers = classroomStore.userStore.mainRoomDataStore.teacherList;
            const assistants = classroomStore.userStore.mainRoomDataStore.assistantList;
        
            if (!teachers.size && !assistants.size) {
              addDialog('confirm', {
                title: transI18n('fcr_group_help_title'),
                content: transI18n('fcr_group_teacher_not_in_classroom'),
                cancelButtonVisible: false,
              });
              return;
            }
            if (teacherGroupUuidRef.current === currentSubRoom) {
              ToastApi.open({
                toastProps: {
                  content: transI18n('fcr_group_teacher_exist_hint'),
                  type: 'normal',
                },
              });
              return;
            }
        
            const teacherUuid = teachers.keys().next().value;
            const assistantUuids = Array.from(assistants.keys());
        
            addDialog('confirm', {
              title: transI18n('fcr_group_help_title'),
              content: transI18n('fcr_group_help_content'),
              onOk: () => {
                if (teacherGroupUuidRef.current === currentSubRoom) {
                  ToastApi.open({
                    toastProps: {
                      content: transI18n('fcr_group_teacher_exist_hint'),
                      type: 'normal',
                    },
                  });
                  return;
                }
                updateGroupUsers(
                  [
                    {
                      groupUuid: currentSubRoom as string,
                      addUsers: [teacherUuid].concat(assistantUuids),
                    },
                  ],
                  true,
                ).catch((e) => {
                  if (AGError.isOf(e, AGServiceErrorCode.SERV_USER_BEING_INVITED)) {
                    addDialog('confirm', {
                      title: transI18n('fcr_group_help_title'),
                      content: transI18n('fcr_group_teacher_is_helping_others_msg'),
                      cancelButtonVisible: false,
                    });
                  }
                });
                setIsHasRequest(!isHasRequest)
              },
              okText: transI18n('fcr_group_button_invite'),
              cancelText: transI18n('fcr_group_button_cancel'),
            });
        } else {
            // TODO: cancel request
            ToastApi.open({
              toastProps: {
                content: transI18n('fcr_group_help_cancel'),
                type: 'info',
              },
            });
            setIsHasRequest(false);
        }
        
      };
    return (
        <ToolTip
            trigger="hover" 
            content={isHasRequest ? transI18n('fcr_group_tip_breakout_rooms_cancel_help') : transI18n('fcr_group_tip_breakout_rooms_help')}
            overlayInnerStyle={{
                fontSize: '14px',
                fontWeight: 400,
            }}
        >
            <div className='fcr-action-bar-item-wrapper group' onClick={handleClick}>
                <div className={classNames("fcr-action-bar-item",  isTeacherIn && 'disabled')}>
                    <div className="fcr-action-bar-item-icon">
                        <SvgImg type={SvgIconEnum.FCR_GROUP_HELP} size={32} ></SvgImg>
                    </div>
                    <div className="fcr-action-bar-item-text">{!isTeacherIn && isHasRequest ? transI18n('fcr_group_label_group_cancel_help') : transI18n('fcr_group_label_group_help')}</div>
                </div>
            </div>
        </ToolTip>
        
    )
})
