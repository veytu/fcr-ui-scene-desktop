import { SvgIconEnum, SvgImg } from "@components/svg-img"
import { ToolTip } from "@components/tooltip";
import { useStore } from "@ui-scene/utils/hooks/use-store";
import { useI18n } from 'agora-common-libs';
import { observer } from "mobx-react";
import './index.css'
import { useEffect, useMemo, useRef, useState } from "react";
import { AGServiceErrorCode, EduClassroomConfig } from "agora-edu-core";
import { AGError } from "agora-rte-sdk";
import classNames from "classnames";
import { ToastApi } from "@components/toast";

export const RequestHelp = observer(() => {
    const transI18n = useI18n();
    const {
        layoutUIStore: { addDialog },
        breakoutUIStore: { studentInvite, teacherGroupUuid, addToast, rejectInvite, studentInviteTeacher, currentSubRoomInfo },
        classroomStore,
      } = useStore();
      const teacherGroupUuidRef = useRef<string | undefined>(teacherGroupUuid);
      useEffect(() => {
        teacherGroupUuidRef.current = teacherGroupUuid;
      }, [teacherGroupUuid]);
      const { currentSubRoom } = classroomStore.groupStore;
      const isTeacherIn = useMemo(() => teacherGroupUuid === currentSubRoom, [teacherGroupUuid, currentSubRoom]);
      const { userUuid, userName } = EduClassroomConfig.shared.sessionInfo;    
      const teachers = classroomStore.userStore.mainRoomDataStore.teacherList;
      const assistants = classroomStore.userStore.mainRoomDataStore.assistantList;
      const teacherUuid = teachers.keys().next().value;
      const handleClick = () => {
        if (teacherGroupUuid && isTeacherIn) {
            ToastApi.open({
              toastProps: {
                content: transI18n('fcr_group_teacher_exist_hint'),
                type: 'normal',
              },
            })
            return;
          }
        if (!studentInvite.isInvite) {
         
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
              })
              return;
            }
          
            const assistantUuids = Array.from(assistants.keys());
        
            addDialog('confirm', {
              title: transI18n('fcr_group_help_title'),
              content: transI18n('fcr_group_help_content'),
              onOk: () => {
                if (teacherGroupUuidRef.current === currentSubRoom) {
                  addToast({text: transI18n('fcr_group_teacher_exist_hint')})
                  return;
                }
                ToastApi.open({
                  toastProps: {
                    content: transI18n('fcr_group_help_send'),
                    type: 'normal',
                  },
                });
                const studentGroupInfo = {
                  groupUuid: currentSubRoom as string,
                  groupName: currentSubRoomInfo && currentSubRoomInfo.groupName || '',
                }
                const studentInfo = {
                  id: userUuid,
                  name: userName,
                  isInvite: true,
                }
                studentInviteTeacher(studentGroupInfo, studentInfo, teacherUuid)
             
              },
              okText: transI18n('fcr_group_button_invite'),
              cancelText: transI18n('fcr_group_button_cancel'),
            });
        } else {
          const studentGroupInfo = {
            groupUuid: currentSubRoom as string,
            groupName: currentSubRoomInfo && currentSubRoomInfo.groupName || '',
          }
          const studentInfo = {
            id: userUuid,
            name: userName,
            isInvite: false,
          }
          ToastApi.open({
            toastProps: {
              content: transI18n('fcr_group_help_cancel'),
              type: 'normal',
            },
          });
          studentInviteTeacher(studentGroupInfo, studentInfo, teacherUuid)
          
            
        }
        
      };
    return (
        <ToolTip
            trigger="hover" 
            content={studentInvite.isInvite ? transI18n('fcr_group_tip_breakout_rooms_cancel_help') : transI18n('fcr_group_tip_breakout_rooms_help')}
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
                    <div className="fcr-action-bar-item-text">{!isTeacherIn && studentInvite.isInvite ? transI18n('fcr_group_label_group_cancel_help') : transI18n('fcr_group_label_group_help')}</div>
                </div>
            </div>
        </ToolTip>
        
    )
})
