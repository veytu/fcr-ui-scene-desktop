import {
  AgoraEduClassroomEvent,
  EduClassroomConfig,
  EduEventCenter,
  LeaveReason,
} from 'agora-edu-core';
import { bound } from 'agora-rte-sdk';
import { EduUIStoreBase } from './base';

export class NotiticationUIStore extends EduUIStoreBase {
  @bound
  private _handleClassroomEvent(event: AgoraEduClassroomEvent, param: any) {
    // kick out
    if (event === AgoraEduClassroomEvent.KickOut) {
      const user = param;

      const { sessionInfo } = EduClassroomConfig.shared;

      if (user.userUuid === sessionInfo.userUuid) {
        this.classroomStore.connectionStore.leaveClassroom(LeaveReason.kickOut);
      }
    }
    // // teacher turn on my mic
    // if (event === AgoraEduClassroomEvent.TeacherTurnOnMyMic) {
    //   this.shareUIStore.addToast(transI18n('toast2.teacher.turn.on.my.mic'));
    // }
    // // teacher turn off my mic
    // if (event === AgoraEduClassroomEvent.TeacherTurnOffMyMic) {
    //   this.shareUIStore.addToast(transI18n('toast2.teacher.turn.off.my.mic'), 'error');
    // }
    // // teacher turn on my mic
    // if (event === AgoraEduClassroomEvent.TeacherTurnOnMyCam) {
    //   this.shareUIStore.addToast(transI18n('toast2.teacher.turn.on.my.cam'));
    // }
    // // teacher turn off my mic
    // if (event === AgoraEduClassroomEvent.TeacherTurnOffMyCam) {
    //   this.shareUIStore.addToast(transI18n('toast2.teacher.turn.off.my.cam'), 'error');
    // }
    // // teacher grant permission
    // if (event === AgoraEduClassroomEvent.TeacherGrantPermission) {
    //   this.shareUIStore.addToast(transI18n('toast2.teacher.grant.permission'));
    // }
    // // teacher revoke permission
    // if (event === AgoraEduClassroomEvent.TeacherRevokePermission) {
    //   this.shareUIStore.addToast(transI18n('toast2.teacher.revoke.permission'));
    // }
    // // user accpeted to stage
    // if (event === AgoraEduClassroomEvent.UserAcceptToStage) {
    //   this.shareUIStore.addToast(transI18n('toast2.teacher.accept.onpodium'));
    // }
    // // teacher leave stage
    // if (event === AgoraEduClassroomEvent.UserLeaveStage) {
    //   this.shareUIStore.addToast(transI18n('toast2.teacher.revoke.onpodium'));
    // }
    // // reward received
    // if (
    //   event === AgoraEduClassroomEvent.RewardReceived ||
    //   event === AgoraEduClassroomEvent.BatchRewardReceived
    // ) {
    //   const users: { userUuid: string; userName: string }[] = param;
    //   const userNames = users.map((user) => user.userName);
    //   if (users.length > 3) {
    //     this.shareUIStore.addToast(
    //       transI18n('toast2.teacher.reward2', {
    //         reason1: userNames
    //           .slice(0, 3)

    //           .join(','),
    //         reason2: userNames.length,
    //       }),
    //     );
    //   } else {
    //     this.shareUIStore.addToast(
    //       transI18n('toast2.teacher.reward', { reason: userNames.join(',') }),
    //     );
    //   }
    // }
    // // capture screen permission denied received
    // if (event === AgoraEduClassroomEvent.CaptureScreenPermissionDenied) {
    //   this.shareUIStore.addToast(transI18n('toast2.screen_permission_denied'), 'error');
    // }
    // // user join group
    // if (event === AgoraEduClassroomEvent.UserJoinGroup) {
    //   const { role } = EduClassroomConfig.shared.sessionInfo;
    //   const { groupUuid, users }: { groupUuid: string; users: [] } = param;
    //   const { teacherList, studentList, assistantList } =
    //     this.classroomStore.userStore.mainRoomDataStore;

    //   const teachers = this._filterUsers(users, teacherList);
    //   const students = this._filterUsers(users, studentList);
    //   const assistants = this._filterUsers(users, assistantList);

    //   const isCurrentRoom = this.classroomStore.groupStore.currentSubRoom === groupUuid;

    //   if (isCurrentRoom) {
    //     if (teachers.length) {
    //       if (role === EduRoleTypeEnum.student) {
    //         this.shareUIStore.addToast(
    //           transI18n('fcr_group_enter_group', {
    //             reason1: transI18n('role.teacher'),
    //             reason2: teachers.join(','),
    //           }),
    //         );
    //       }
    //     }

    //     if (assistants.length) {
    //       if (role === EduRoleTypeEnum.student) {
    //         this.shareUIStore.addToast(
    //           transI18n('fcr_group_enter_group', {
    //             reason1: transI18n('role.assistant'),
    //             reason2: assistants.join(','),
    //           }),
    //         );
    //       }
    //     }

    //     if (students.length) {
    //       if ([EduRoleTypeEnum.teacher, EduRoleTypeEnum.assistant].includes(role)) {
    //         this.shareUIStore.addToast(
    //           transI18n('fcr_group_enter_group', {
    //             reason1: transI18n('role.student'),
    //             reason2: students.join(','),
    //           }),
    //         );
    //       }
    //     }
    //   }
    // }
    // // user leave group
    // if (event === AgoraEduClassroomEvent.UserLeaveGroup) {
    //   const { role } = EduClassroomConfig.shared.sessionInfo;
    //   const { groupUuid, users }: { groupUuid: string; users: [] } = param;
    //   const { teacherList, studentList, assistantList } =
    //     this.classroomStore.userStore.mainRoomDataStore;

    //   const teachers = this._filterUsers(users, teacherList);
    //   const students = this._filterUsers(users, studentList);
    //   const assistants = this._filterUsers(users, assistantList);

    //   const isCurrentRoom = this.classroomStore.groupStore.currentSubRoom === groupUuid;

    //   if (isCurrentRoom) {
    //     if (teachers.length) {
    //       if (role === EduRoleTypeEnum.student) {
    //         this.shareUIStore.addToast(
    //           transI18n('fcr_group_exit_group', {
    //             reason1: transI18n('role.teacher'),
    //             reason2: teachers.join(','),
    //           }),
    //           'warning',
    //         );
    //       }
    //     }

    //     if (assistants.length) {
    //       if (role === EduRoleTypeEnum.student) {
    //         this.shareUIStore.addToast(
    //           transI18n('fcr_group_exit_group', {
    //             reason1: transI18n('role.assistant'),
    //             reason2: assistants.join(','),
    //           }),
    //           'warning',
    //         );
    //       }
    //     }

    //     if (students.length) {
    //       if ([EduRoleTypeEnum.teacher, EduRoleTypeEnum.assistant].includes(role)) {
    //         this.shareUIStore.addToast(
    //           transI18n('fcr_group_exit_group', {
    //             reason1: transI18n('role.student'),
    //             reason2: students.join(','),
    //           }),
    //           'warning',
    //         );
    //       }
    //     }
    //   }
    // }

    // if (event === AgoraEduClassroomEvent.RejectedToGroup) {
    //   const { inviting } = param;
    //   const { role } = EduClassroomConfig.shared.sessionInfo;
    //   if (role === EduRoleTypeEnum.student && inviting) {
    //     this.shareUIStore.addConfirmDialog(
    //       transI18n('fcr_group_help_title'),
    //       transI18n('fcr_group_help_teacher_busy_msg'),
    //       {
    //         actions: ['ok'],
    //       },
    //     );
    //   }
    // }
  }
  onDestroy(): void {}
  onInstall(): void {
    EduEventCenter.shared.onClassroomEvents(this._handleClassroomEvent);
  }
}
