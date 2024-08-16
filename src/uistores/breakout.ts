import { Log, bound, transI18n } from 'agora-common-libs';
import { EduUIStoreBase } from './base';
import { action, computed, observable, reaction, runInAction, when } from 'mobx';
import {
  AgoraEduClassroomEvent,
  ClassroomState,
  EduClassroomConfig,
  EduEventCenter,
  EduRoleTypeEnum,
  GroupDetail,
  GroupState,
  PatchGroup,
  SceneType,
} from 'agora-edu-core';
import difference from 'lodash/difference';
import range from 'lodash/range';
import findLast from 'lodash/findLast';
import { v4 as uuidv4 } from 'uuid';
import { AGRtcConnectionType, AGRtcState, AgoraRteCustomMessage, AgoraRteScene, Scheduler } from 'agora-rte-sdk';
import { isInvisible, isTeacher } from '@ui-scene/utils/check';
import {
  CustomMessageAcceptInviteType,
  CustomMessageCancelInviteType,
  CustomMessageCommandType,
  CustomMessageData,
  CustomMessageInviteType,
  CustomMessageRejectInviteType,
  CustomMessageTeacherCloseGroupType,
  RejectToGroupArgs,
} from './type';
import { AgoraExtensionRoomEvent } from '@ui-scene/extension/events';
import { Children, useContext } from 'react';
import { getRandomInt } from '@ui-scene/utils';
import { ToastApi } from '@components/toast';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { jsonstring } from 'agora-rte-sdk/lib/core/utils/utils';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

enum GroupMethod {
  Auto = 1,
  Manual = 2,
}

interface GroupInfoProps {
  groupUuid: string;
  groupName: string;
}
interface StudentInfoProps {
  id: string;
  name: string;
  isInvite: boolean;
}

interface MemberProps {
  userUuid: string | undefined,
  [porperty: string]: any
}

@Log.attach()
export class BreakoutUIStore extends EduUIStoreBase {
  /**
   * 每个分组学生最大15人
   */
  static readonly MAX_USER_COUNT = 15;

  /**
   * 总分组数
   */
  static readonly MAX_GROUP_COUNT = 20;
  /**
   * 当前分组序号
   */
  private _groupSeq = 0;
  /**
   * 请求中状态
   */
  private _requestLock = new Set();

  /**
   * 分组邀请所对应的窗口ID
   */
  private _dialogsMap = new Map<string, string>();
  /**
   * 消息提示
   */
  @observable
  private _toasts: { text: string; id: string }[] = [];
  /**
   * 请求帮助列表
   */
  @observable
  private _helpRequestList: { groupName: string; groupUuid: string }[] = [];
  @observable
  private _inviteStudentTask: any = undefined;
  @observable
  private _studentInvites: any = [];
  @observable
  private _studentInvite: any = {};
  @observable
  private _cancelGroupUuid = '';
  @observable
  private _studentInviteTasks: any = [];
  @observable
  private _inviteGroups: any = [];
  /**
   * 分组窗口是否打开
   */
  @observable
  private _dialogVisible = false;
  /**
   * 创建步骤:
   * 0 选择自动\手动分组界面
   * 1 分组界面
   */
  @observable
  private _wizardState = 0;
  /**
   * 正在加入分组中
   */
  @observable
  private _isJoiningSubRoom = false;
  @observable
  private _initGroupInfo: any;
  /**
   * 本地分组暂存信息
   */
  @observable
  private _localGroups: Map<string, GroupDetail> = new Map();
  @observable studentGroupInvites: CustomMessageInviteType = {
    groupUuid: '',
    groupName: '',
    isInvite: false,
    inviteStudentTask: undefined,
    userName: '',
    userUuid: '',
  };
  @observable
  private _inviteStudents: { userUuid: string }[] = [];
  /**
    * 已选中的未分组的成员
    */
  @observable selectedUnGroupMember: MemberProps[] = [];
  /**
    * 已选中的已分组的成员
    */
  @observable selectedGroupMember: MemberProps[] = [];
  /**
    * 已选中的分组
    */
  @observable selectedGroup: any = {};

  /**
   * 正在加入分组
   */
  @computed
  get isJoiningSubRoom() {
    return this._isJoiningSubRoom;
  }

  @computed
  get studentInvites() {
    return this._studentInvites ? [...this._studentInvites] : [];
  }
  /**
   * 请求列表
   */
  @computed
  get helpRequestList() {
    return this._helpRequestList;
  }
  /**
   * 分组窗口
   */
  @computed
  get breakoutDialogVisible() {
    return this._dialogVisible;
  }
  @computed
  get studentInvite() {
    return this._studentInvite;
  }
  /**
   * 当前创建步骤
   */
  @computed
  get wizardState() {
    return this._wizardState;
  }
  /**
   * 提示列表
   */
  @computed
  get toasts() {
    return this._toasts;
  }
  /**
    * 储存已选中的未分组成员
    */
  @action.bound
  setSelectedUnGroupMember(member: MemberProps) {
    this.selectedUnGroupMember.push(member);
  }

  /**
   * 移除已选中的未分组成员
   */
  @action.bound
  removeSelectedUnGroupMember(member: MemberProps) {
    const newData = this.selectedUnGroupMember.filter((item: { userUuid: string | undefined; }) => item.userUuid !== member.userUuid)
    this.selectedUnGroupMember = newData;
  }


  /**
     * 储存已选中的已分组成员
     */
  @action.bound
  setSelectedGroupMember(member: MemberProps) {
    this.selectedGroupMember.push(member);
  }

  /**
    * 移除已选中的已分组成员
    */
  @action.bound
  removeSelectedGroupMember(member: MemberProps) {
    const newData = this.selectedGroupMember.filter((item: MemberProps) => item.userUuid !== member.userUuid)
    this.selectedGroupMember = newData;
  }

  /**
       * 储存已选中的分组
       */
  @action.bound
  setSelectedGroup(group: any) {
    this.selectedGroup = group;
  }

  @action.bound
  setTaskStop(tasks: any[], index: number) {
    if (tasks[index]?.inviteStudentTask && tasks[index]?.inviteStudentTask?.__timer) {
      clearInterval(tasks[index]?.inviteStudentTask.__timer);
      tasks[index].inviteStudentTask.__running = false;
    }
    tasks.splice(index, 1);
  }
  /**
   * 分组列表
   */
  @computed
  get groups() {
    const list: {
      id: string;
      text: string;
      sort: number;
      children: { id: string; text: string }[];
    }[] = [];

    const unknownName = transI18n('fcr_group_tips_unknown_username');

    const users = this.mainRoomUsers;

    const teacherList = this.mainRoomTeachers;

    const assistantList = this.mainRoomAssistants;

    this.groupDetails.forEach((group, groupUuid) => {
      const students = new Map<string, { id: string; text: string; notJoined?: boolean }>();

      group.users.forEach(({ userUuid, notJoined }) => {
        if (!teacherList.has(userUuid) && !assistantList.has(userUuid)) {
          students.set(userUuid, {
            id: userUuid,
            text: users.get(userUuid)?.userName || unknownName,
            notJoined,
          });
        }
      });

      const tree = {
        id: groupUuid,
        text: group.groupName,
        sort: group.sort || 0,
        children: [...students.values()],
      };

      list.push(tree);
    });

    list.sort(({ sort: sort1 }, { sort: sort2 }) => {
      return sort1 - sort2;
    });

    return list;
  }

  /**
   * 分组详情
   */
  @computed
  get groupDetails() {
    const { groupDetails } = this.classroomStore.groupStore;
    this._localGroups.values();
    const localGroups = this._localGroups;
    return this.groupState === GroupState.OPEN ? groupDetails : localGroups;
  }

  /**
 * 是否开启分组讨论
 */
  @computed
  get isStartDiscussion() {
    return this.classroomStore.groupStore.state === GroupState.OPEN
  }

  /**
   * 学生列表
   */
  @computed
  get students() {
    const list: { userUuid: string; userName: string; groupUuid: string | undefined }[] = [];

    this.mainRoomStudents.forEach((user) => {
      const groupUuid = this.getUserGroupUuid(user.userUuid);

      list.push({
        userUuid: user.userUuid,
        userName: user.userName,
        groupUuid,
      });
    });

    return list;
  }

  /**
   * 未分组学生列表
   */
  @computed
  get ungroupedCount() {
    const count = this.students.reduce((prev, { groupUuid }) => {
      if (!groupUuid) {
        prev += 1;
      }

      return prev;
    }, 0);
    return count;
  }

  @computed
  get numberToBeAssigned() {
    return this.mainRoomStudents.size;
  }
  @computed
  get mainRoomUsers() {
    if (this.classroomStore.connectionStore.classroomState !== ClassroomState.Connected) {
      return new Map();
    }
    return this.classroomStore.userStore.mainRoomDataStore.users;
  }
  @computed
  get mainRoomStudents() {
    if (this.classroomStore.connectionStore.classroomState !== ClassroomState.Connected) {
      return new Map();
    }
    return this.classroomStore.userStore.mainRoomDataStore.studentList;
  }
  @computed
  get mainRoomTeachers() {
    if (this.classroomStore.connectionStore.classroomState !== ClassroomState.Connected) {
      return new Map();
    }
    return this.classroomStore.userStore.mainRoomDataStore.teacherList;
  }

  @computed
  get mainRoomAssistants() {
    if (this.classroomStore.connectionStore.classroomState !== ClassroomState.Connected) {
      return new Map();
    }
    return this.classroomStore.userStore.mainRoomDataStore.assistantList;
  }

  /**
   * 未分组用户列表
   */
  @computed
  get ungroupedList() {
    this._localGroups.values();
    const studentList = this.mainRoomStudents;
    const ungrouped: { id: string; text: string }[] = [];

    studentList.forEach((student, studentUuid) => {
      const groupUuid = this.getUserGroupUuid(studentUuid);
      const user = this.getGroupUserByUuid(studentUuid);

      if (!groupUuid && !user?.notJoined) {
        ungrouped.push({ id: studentUuid, text: student.userName });
      }
    });

    return ungrouped;
  }

  /**
   * 当前是否开放分组
   */
  @computed
  get groupState() {
    return this.classroomStore.groupStore.state;
  }
  @action.bound
  setStudentInvitesEmpty() {
    for (let i = 0; i < this.students.length; i++) {
      const index = this._studentInviteTasks.findIndex(
        (v: any) => v.userUuid === this.students[i].userUuid,
      );
      if (index > -1) {
        if (this._studentInviteTasks[index]?.inviteStudentTask?.stop) {
          this._studentInviteTasks[index]?.inviteStudentTask?.stop();
        }

        this._studentInviteTasks.splice(index, 1);
      }
    }
    this._studentInvites = [];
    const message: CustomMessageData<CustomMessageTeacherCloseGroupType> = {
      cmd: CustomMessageCommandType.teacherCloseGroup,
      data: true,
    };
    this.classroomStore.connectionStore.mainRoomScene?.localUser?.sendCustomChannelMessage(
      'flexMsg',
      message,
      false,
    );
  }
  /**
   * 当前房间
   */
  @computed
  get currentSubRoomInfo() {
    const { groupUuidByUserUuid } = this.classroomStore.groupStore;
    const currentSubRoom = groupUuidByUserUuid.get(EduClassroomConfig.shared.sessionInfo.userUuid);
    if (currentSubRoom) {
      const groupInfo = this.groupDetails.get(currentSubRoom);

      return groupInfo;
    }
  }

  /**
   * 老师所在房间
   */
  @computed
  get teacherGroupUuid() {
    if (this.classroomStore.connectionStore.classroomState !== ClassroomState.Connected) {
      return undefined;
    }
    const teachers = this.classroomStore.userStore.mainRoomDataStore.teacherList;

    if (teachers.size) {
      const teacherUuid = teachers.keys().next().value;
      const { groupUuidByUserUuid } = this.classroomStore.groupStore;

      const teacherGroupUuid = groupUuidByUserUuid.get(teacherUuid);
      return teacherGroupUuid;
    }
    return undefined;
  }

  /**
* 老师是否在某个房间
*/
  @action.bound
  teacherInCurrentRoom(groupId: string) {
    return (
      !!this.teacherGroupUuid &&
      this.teacherGroupUuid === groupId
    );
  }

  @action.bound
  studentInviteTeacher(
    groupInfo: GroupInfoProps,
    studentInfo: StudentInfoProps,
    teacherUuid: string,
  ) {
    const { userUuid } = EduClassroomConfig.shared.sessionInfo;
    const item = this.studentGroupInvites;
    item.groupUuid = this.classroomStore.groupStore.currentSubRoom as string;
    item.groupName = groupInfo.groupName;
    item.isInvite = studentInfo.isInvite;
    item.userName = studentInfo.name;
    item.userUuid = userUuid;
    this._initGroupInfo = groupInfo;
    this._studentInvite = {
      groupUuid: this.classroomStore.groupStore.currentSubRoom as string,
      groupName: groupInfo.groupName,
      isInvite: studentInfo.isInvite,
      id: userUuid,
      name: studentInfo.name,
    };
    if (studentInfo.isInvite) {
      const intervalInMs = getRandomInt(2000, 4000);
      if (this._inviteStudentTask?.stop) {
        this._inviteStudentTask?.stop();
      }
      this._inviteStudentTask = Scheduler.shared.addIntervalTask(
        () => {
          if (this._inviteStudentTask?.isStopped) return;
          const message: CustomMessageData<CustomMessageInviteType> = {
            cmd: CustomMessageCommandType.inviteTeacher,
            data: { ...item, inviteStudentTask: this._inviteStudentTask },
          };
          this.classroomStore.connectionStore.mainRoomScene?.localUser?.sendCustomPeerMessage(
            'flexMsg',
            message,
            teacherUuid,
            false,
          );
        },
        intervalInMs,
        true,
      );
    } else {
      if (this._inviteStudentTask?.stop) {
        this._inviteStudentTask?.stop();
      }
      this._studentInvite.isInvite = false;
      const message: CustomMessageData<CustomMessageCancelInviteType> = {
        cmd: CustomMessageCommandType.cancelInvite,
        data: {
          groupUuid: this.classroomStore.groupStore.currentSubRoom as string,
          groupName: groupInfo.groupName,
          isInvite: false,
          userUuid: userUuid,
          userName: studentInfo.name,
        },
      };
      this.classroomStore.connectionStore.mainRoomScene?.localUser?.sendCustomPeerMessage(
        'flexMsg',
        message,
        teacherUuid,
        false,
      );
    }
  }
  @action.bound
  setDialogVisible(visible: boolean) {
    this._dialogVisible = visible;
  }

  @action.bound
  setWizardState(state: 0 | 1) {
    this._wizardState = state;
  }

  /**
   * 获取学生所在组ID
   * @param userUuid
   */
  @bound
  getUserGroupUuid(userUuid: string) {
    const map: Map<string, string> = new Map();

    this.groupDetails.forEach((group, groupUuid) => {
      group.users.forEach(({ userUuid, notJoined }) => {
        if (!notJoined) {
          map.set(userUuid, groupUuid);
        }
      });
    });

    return map.get(userUuid);
  }
  /**
   * 获取学生所在组信息
   * @param userUuid
   */
  @bound
  getUserGroupInfo(userUuid: string) {
    const groupId = this.getUserGroupUuid(userUuid);
    return groupId && this.groupDetails.get(groupId);
  }
  /**
   * 获取学生信息
   * @param userUuid
   */
  @bound
  getGroupUserByUuid(userUuid: string) {
    return this.classroomStore.groupStore.userByUuid.get(userUuid);
  }

  /**
   * 获取用户token
   * @param groupUuid
   */
  @bound
  async getUserToken(groupUuid: string) {
    //获取本地配置
    const { userUuid, role, userName } = EduClassroomConfig.shared.sessionInfo;
    console.log(' userUuid, role, userName', userUuid, role, userName);
    
    const data =await this.classroomStore.api.entry({
      roomUuid: groupUuid,
      userUuid,
      role,
      userName
    });
    debugger
    console.log('getUserToken data',JSON.stringify(data));

    return data
  }

  /**
   * 设置分组用户列表
   * @param groupUuid
   * @param users
   */
  @action.bound
  setGroupUsers(groupUuid: string, users: string[]) {
    this.logger.info('Set group users', groupUuid, users);

    const patches: PatchGroup[] = [];

    this.groupDetails.forEach((group, uuid) => {
      if (groupUuid === uuid) {
        const groupUsers = group.users.map(({ userUuid }) => userUuid);

        const removeUsers = difference(groupUsers, users);

        const addUsers = difference(users, groupUsers);

        patches.push({
          groupUuid,
          addUsers,
          removeUsers,
        });
      }
    });

    patches.forEach(({ removeUsers = [], addUsers = [], groupUuid }) => {
      const groupDetail = this._localGroups.get(groupUuid);

      if (groupDetail) {
        const users = addUsers.map((userUuid) => ({ userUuid }));

        const newUsers = groupDetail.users
          .filter(({ userUuid }) => !removeUsers.includes(userUuid))
          .concat(users);

        groupDetail.users = newUsers;

        this._localGroups.set(groupUuid, groupDetail);
      }
    });
  }

  /**
   * 重命名组
   * @param groupUuid 分组ID
   * @param groupName 新分组名
   */
  @action.bound
  renameGroupName(groupUuid: string, groupName: string) {
    if (this._isGroupExisted({ groupUuid, groupName })) {
      this.addToast({ text: transI18n('fcr_group_tips_name_already_exists') });
      return;
    }

    if (this.groupState === GroupState.OPEN) {
      this.classroomStore.groupStore.updateGroupInfo([
        {
          groupUuid,
          groupName,
        },
      ]);
    } else {
      const groupDetail = this._localGroups.get(groupUuid);

      if (groupDetail) {
        groupDetail.groupName = groupName;
        this._localGroups.set(groupUuid, groupDetail);
      }
    }
  }

  getLastOrder() {
    const last = findLast(this.groups, () => true);

    return last?.sort ?? 0;
  }

  /**
   * 新增组
   */
  @action.bound
  addGroup() {
    if (this.groupDetails.size >= BreakoutUIStore.MAX_GROUP_COUNT) {
      this.addToast({
        text: transI18n('fcr_group_tips_group_number_exceeds', {
          reason1: BreakoutUIStore.MAX_GROUP_COUNT,
        }),
      });
      return;
    }
    const newGroup = { groupUuid: uuidv4(), groupName: this._generateGroupName() };

    if (this._isGroupExisted(newGroup)) {
      newGroup.groupName += ' 1';
    }

    if (this.groupState === GroupState.OPEN) {
      this.classroomStore.groupStore.addGroups([
        {
          groupName: newGroup.groupName,
          users: [],
          sort: this.getLastOrder() + 1,
        },
      ]);
    } else {
      this._localGroups.set(newGroup.groupUuid, {
        groupName: newGroup.groupName,
        users: [],
        sort: this.getLastOrder() + 1,
      });
    }

    this.addToast({ text: transI18n('fcr_group_tips_group_added') });
  }

  @action.bound
  addToast(message: { text: string }) {
    const id = uuidv4();
    Scheduler.shared.addDelayTask(() => {
      runInAction(() => {
        this._toasts = this._toasts.filter((item) => id !== item.id);
      });
    }, Scheduler.Duration.second(3));

    this._toasts = this._toasts.slice(this._toasts.length - 6, this.toasts.length);

    this._toasts.unshift({ id, text: message.text });
  }

  /**
   * 删除组
   * @param groupUuid 组id
   */
  @action.bound
  removeGroup(groupUuid: string) {
    if (this.groupState === GroupState.OPEN) {
      this.classroomStore.groupStore.removeGroups([groupUuid]);
    } else {
      this._localGroups.delete(groupUuid);
    }
  }

  /**
   * 移动用户
   * @param fromGroupUuid
   * @param toGroupUuid
   * @param user
   */
  @action.bound
  async moveUserToGroup(fromGroupUuid: string, toGroupUuid: string, userUuid: string | string[]) {
    try {
      const group = this.groupDetails.get(toGroupUuid);

      if (group) {
        const studentsCount = group.users.reduce((total, { userUuid }) => {
          if (this.classroomStore.userStore.studentList.get(userUuid)) total += 1;
          return total;
        }, 0);
        // check students number
        if (studentsCount >= BreakoutUIStore.MAX_USER_COUNT) {
          this.addToast({
            text: transI18n('fcr_group_tips_group_is_full', {
              reason1: BreakoutUIStore.MAX_USER_COUNT,
            }),
          });
          return;
        }
      }

      if (this.groupState === GroupState.OPEN) {
        if (!toGroupUuid) {
          return;
        }
        //未分组成员移动
        if (!fromGroupUuid) {
          await this.classroomStore.groupStore.updateGroupUsers(
            [
              {
                groupUuid: toGroupUuid,
                addUsers: typeof userUuid === 'string' ? [userUuid] : Array.isArray(userUuid) ? [...userUuid] : [],
              },
            ],
            true,
          );
          this.selectedUnGroupMember?.map(item => this.removeSelectedUnGroupMember(item));
        } else {
          //已分组成员移动
          await this.classroomStore.groupStore.moveUsersToGroup(fromGroupUuid, toGroupUuid, [...userUuid]);
          this.selectedGroupMember?.map(item => this.removeSelectedGroupMember(item));
        }
      } else {
        const fromGroup = this._localGroups.get(fromGroupUuid);
        const toGroup = this._localGroups.get(toGroupUuid);

        //已分组成员移动
        if (fromGroup) {
          fromGroup.users = fromGroup.users.filter(({ userUuid: uuid }) => uuid !== userUuid);
          // toGroup.users = toGroup.users.concat([{ userUuid }]);
          this._localGroups.set(fromGroupUuid, fromGroup);
          // this._localGroups.set(toGroupUuid, toGroup);
          this.selectedGroupMember?.map(item => this.removeSelectedGroupMember(item));
        }

        if (toGroup) {
          if (typeof userUuid === 'string') {
            toGroup.users = toGroup.users.concat([{ userUuid }]);
          } else if (Array.isArray(userUuid)) {
            const arr = userUuid?.map(item => ({ userUuid: item }))
            toGroup.users = toGroup.users.concat(arr);
          }
          this._localGroups.set(toGroupUuid, toGroup);
          fromGroup ? null : this.selectedUnGroupMember?.map(item => this.removeSelectedUnGroupMember(item));
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  /**
   * 用户组互换
   * @param userUuid1
   * @param userUuid2
   */
  @bound
  interchangeGroup(userUuid1: string, userUuid2: string) {
    const patches: PatchGroup[] = [];

    let groupUuid1 = '';
    let groupUuid2 = '';

    if (this.groupState === GroupState.CLOSE) {
      throw new Error('invalid group state');
    }

    this.classroomStore.groupStore.groupDetails.forEach(({ users }, gropuUuid) => {
      const hasUser1 = users.some(({ userUuid }) => userUuid === userUuid1);
      if (hasUser1) {
        groupUuid1 = gropuUuid;
      }

      const hasUser2 = users.find(({ userUuid }) => userUuid === userUuid2);
      if (hasUser2) {
        groupUuid2 = gropuUuid;
      }
    });

    if (groupUuid1 && groupUuid2) {
      patches.push({
        groupUuid: groupUuid1,
        addUsers: [userUuid2],
        removeUsers: [userUuid1],
      });

      patches.push({
        groupUuid: groupUuid2,
        addUsers: [userUuid1],
        removeUsers: [userUuid2],
      });

      this.classroomStore.groupStore.updateGroupUsers(patches);
    } else {
      this.logger.info('cannot know which group the user is in');
    }
  }

  /**
* 旁听讨论 | 结束旁听
* @param groupUuid 分组id
* @param isAttend 是否旁听
*/
  @bound
  async attendDiscussion(groupId: string, isAttend: boolean) {
    try {
      const { streamStore, groupStore, connectionStore } = this.classroomStore;
      console.log('this.classroomStore.streamStore.streamByStreamUuid', JSON.stringify(this.classroomStore.streamStore.streamByStreamUuid));
      this.getters.classroomUIStore.subscriptionUIStore.setActive('');
      const currentGroup = this.groupDetails.get(groupId);
      console.log('currentGroup', JSON.stringify(currentGroup));


      // console.log("🚀 ~ BreakoutUIStore ~ attendDiscussion ~ connectionStore:", JSON.stringify(connectionStore.mainRoomScene))

      // Array.from(streamStore.streamByStreamUuid.values()).map(stream => {
      //   debugger
      //   const target = currentGroup?.users?.find(user => user?.userUuid == stream?.fromUser?.userUuid);
      //   if (target) {
      //     const { currentSubRoom } = groupStore;
      //     console.log("🚀 ~ BreakoutUIStore ~ attendDiscussion ~ roomUuid:", currentSubRoom)
      //     const roomScene = connectionStore.subRoomScene;
      //     console.log('connectionStore.subRoomScene', JSON.stringify(connectionStore.subRoomScene));

      //     streamStore.muteRemoteAudioStream(stream, isAttend, roomScene);
      //   }
      // })
    } catch (error) {
      console.log('error', error);
    }
  }

  @bound
  async startGroup({ copyBoardState }: { copyBoardState: boolean }) {
    const groupDetails: GroupDetail[] = [];

    if (!this._localGroups.size) {
      this.addToast({ text: transI18n('fcr_group_tips_no_groups_to_start') });
      return;
    }

    const lockName = 'start-group';
    if (this._requestLock.has(lockName)) {
      this.addToast({ text: transI18n('fcr_group_tips_initializing') });
      return;
    }
    try {
      this._requestLock.add(lockName);
      this._localGroups.forEach((group) => {
        groupDetails.push({
          groupName: group.groupName,
          users: group.users,
          sort: group.sort,
        });
      });

      // stop carousel
      await this.classroomStore.roomStore.stopCarousel();
      await this.classroomStore.groupStore.startGroup(groupDetails, copyBoardState);
      this.getters.boardApi.saveAttributes();
    } catch (e) {
      // this.shareUIStore.addGenericErrorDialog(e as AGError);
    } finally {
      this._requestLock.delete(lockName);
    }
  }

  /**
   * 结束分组
   */
  @bound
  async stopGroup() {
    const lockName = 'stop-group';
    if (this._requestLock.has(lockName)) {
      this.addToast({ text: transI18n('fcr_group_tips_stopping') });
      return;
    }
    try {
      this._requestLock.add(lockName);

      if (this.groupState === GroupState.OPEN) {
        await this.classroomStore.groupStore.stopGroup();
      }
      runInAction(() => {
        this._localGroups = new Map();
        this._groupSeq = 0;
        this._wizardState = 0;
      });
    } catch (e) {
      // this.shareUIStore.addGenericErrorDialog(e as AGError);
    } finally {
      this._requestLock.delete(lockName);
    }
  }

  /**
   * 创建分组
   * @param type 1 auto 2 manual MANUAL
   * @param group
   */
  @action.bound
  createGroups(type: 1 | 2, count: number) {
    this._localGroups = new Map();
    this._groupSeq = 0;

    if (type === GroupMethod.Manual) {
      range(0, count).forEach((i) => {
        const groupDetail = {
          groupName: this._generateGroupName(),
          users: [],
          sort: i,
        };

        this._localGroups.set(`${uuidv4()}`, groupDetail);
      });
    } else if (type === GroupMethod.Auto) {
      const groupIds: string[] = [];
      range(0, count).forEach((i) => {
        const groupDetail = {
          groupName: this._generateGroupName(),
          users: [],
          sort: i,
        };

        const groupId = `${uuidv4()}`;

        groupIds.push(groupId);

        this._localGroups.set(groupId, groupDetail);
      });
      let index = 0;
      this.classroomStore.userStore.studentList.forEach((user, userUuid) => {
        index = index % count;
        const groupId = groupIds[index];
        const groupDetail = this._localGroups.get(groupId);
        if (groupDetail && groupDetail.users.length < BreakoutUIStore.MAX_USER_COUNT) {
          groupDetail.users.push({ userUuid });
        }
        index += 1;
      });
    }
  }

  /**
   * 获取分组内当前人数
   * @param groupUuid
   * @returns
   */
  @bound
  getGroupUserCount(groupUuid: string) {
    return this.groupDetails.get(groupUuid)?.users.reduce((prev, { userUuid }) => {
      if (this.mainRoomStudents.has(userUuid)) prev += 1;
      return prev;
    }, 0);
  }
  /**
   * 加入子房间
   * @param groupUuid
   */
  @bound
  async joinSubRoom(groupUuid: string) {
    if (groupUuid === this.classroomStore.groupStore.currentSubRoom) {
      this.addToast({ text: transI18n('fcr_group_tips_already_in_group') });
      return;
    }
    const lockName = 'join-sub-room';
    if (this._requestLock.has(lockName)) {
      this.addToast({ text: transI18n('fcr_group_tips_joining') });
      return;
    }
    try {
      this._requestLock.add(lockName);
      if (!this.classroomStore.groupStore.currentSubRoom) {
        await this.classroomStore.groupStore.updateGroupUsers([
          {
            groupUuid: groupUuid,
            addUsers: [EduClassroomConfig.shared.sessionInfo.userUuid],
          },
        ]);
      } else {
        await this.classroomStore.groupStore.moveUsersToGroup(
          this.classroomStore.groupStore.currentSubRoom,
          groupUuid,
          [EduClassroomConfig.shared.sessionInfo.userUuid],
        );
      }
    } catch (e) {
    } finally {
      this._requestLock.delete(lockName);
    }
  }

  /**
   * 发送广播消息
   * @param message
   * @returns
   */
  @bound
  broadcastMessage(message: string) {
    try {
      message = message.trim().replaceAll('\n', '');

      if (!message) {
        return;
      }

      this.classroomStore.groupStore.broadcastMessage(message);
    } catch (e) {
      // this.shareUIStore.addGenericErrorDialog(e as AGError);
    }
  }
  @action.bound
  reduceStudentInvites(studentInvites: { groupUuid: string }[], groupUuid: string) {
    const index = studentInvites.findIndex(
      (item: { groupUuid: string }) => item.groupUuid === groupUuid,
    );
    if (index > -1) {
      studentInvites.splice(index, 1);
    }
  }
  @action.bound
  async acceptInvite(groupUuid: string) {
    const teachers = this.classroomStore.userStore.mainRoomDataStore.teacherList;
    if (teachers.size) {
      const teacherUuid = teachers.keys().next().value;
      const assistants = this.classroomStore.userStore.mainRoomDataStore.assistantList;
      const assistantUuids = Array.from(assistants.keys());
      const message: CustomMessageData<CustomMessageAcceptInviteType> = {
        cmd: CustomMessageCommandType.teacherAcceptInvite,
        data: {
          groupUuid: groupUuid,
        },
      };
      this.classroomStore.connectionStore.mainRoomScene?.localUser?.sendCustomChannelMessage(
        'flexMsg',
        message,
        false,
      );
      if (this.teacherGroupUuid && this.teacherGroupUuid !== groupUuid) {
        this.classroomStore.groupStore.moveUsersToGroup(this.teacherGroupUuid, groupUuid, [
          teacherUuid,
        ]);
      } else {
        this.classroomStore.groupStore.updateGroupUsers(
          [
            {
              groupUuid: groupUuid,
              addUsers: [teacherUuid].concat(assistantUuids),
            },
          ],
          false,
        );
      }
    }
    //@ts-ignore
    const idx = this._inviteGroups.findIndex((v) => v.groupUuid === groupUuid);
    this._inviteGroups.splice(idx, 1);
    this.changeReduceInviteGroup(this._inviteGroups);
    await sleep(800);
    console.log('acceptInviteacceptInviteacceptInviteacceptInviteacceptInvite');
    const groupStudents = this.students.filter((v) => v.groupUuid === groupUuid);
    for (let i = 0; i < groupStudents.length; i++) {
      const index = this._studentInviteTasks.findIndex(
        (v: any) => v.userUuid === groupStudents[i].userUuid,
      );
      if (index > -1) {
        this.setTaskStop(this._studentInviteTasks, index);
      }
    }

    this.reduceStudentInvites(this._studentInvites, groupUuid);
    this.setCancelGroupUuid(groupUuid);
  }

  @action.bound
  async rejectInvite(groupUuid: string) {
    const message: CustomMessageData<CustomMessageRejectInviteType> = {
      cmd: CustomMessageCommandType.teacherRejectInvite,
      data: {
        groupUuid: groupUuid,
      },
    };
    this.classroomStore.connectionStore.mainRoomScene?.localUser?.sendCustomChannelMessage(
      'flexMsg',
      message,
      false,
    );
    const groupStudents = this.students.filter((v) => v.groupUuid === groupUuid);
    //@ts-ignore
    const idx = this._inviteGroups.findIndex((v) => v.groupUuid === groupUuid);
    this._inviteGroups.splice(idx, 1);
    this.changeReduceInviteGroup(this._inviteGroups);
    await sleep(1000);
    for (let i = 0; i < groupStudents.length; i++) {
      const index = this._studentInviteTasks.findIndex(
        (v: any) => v.userUuid.trim() === groupStudents[i].userUuid.trim(),
      );
      console.log(
        'this._studentInviteTasks',
        this._studentInviteTasks,
        this.students,
        groupStudents[i].userUuid.trim(),
        index,
      );
      if (index > -1) {
        this.setTaskStop(this._studentInviteTasks, index);
      }
    }

    this.reduceStudentInvites(this._studentInvites, groupUuid);
    this.setCancelGroupUuid(groupUuid);
  }

  @action.bound
  async leaveSubRoom() {
    const lockName = 'leave-sub-room';
    if (this._requestLock.has(lockName)) {
      this.addToast({ text: transI18n('fcr_group_tips_leaving') });
      return;
    }
    if (this._studentInvite) {
      this._studentInvite.isInvite = false;
    }

    try {
      this._requestLock.add(lockName);
      const currentRoomUuid = this.classroomStore.groupStore.currentSubRoom;
      const { userUuid, userName } = EduClassroomConfig.shared.sessionInfo;
      if (currentRoomUuid) {
        await this.classroomStore.groupStore.removeGroupUsers(currentRoomUuid, [userUuid]);
        if (this._inviteStudentTask?.stop) {
          this._inviteStudentTask?.stop();
        }
        const teachers = this.classroomStore.userStore.mainRoomDataStore.teacherList;
        const teacherUuid = teachers.keys().next().value;
        const message: CustomMessageData<CustomMessageCancelInviteType> = {
          cmd: CustomMessageCommandType.cancelInvite,
          data: {
            groupUuid: this._initGroupInfo && this._initGroupInfo.groupUuid,
            groupName: (this._initGroupInfo && this._initGroupInfo?.groupName) || '',
            isInvite: false,
            userUuid: userUuid,
            userName: userName,
          },
        };
        this.classroomStore.connectionStore.mainRoomScene?.localUser?.sendCustomPeerMessage(
          'flexMsg',
          message,
          teacherUuid,
          false,
        );
      }
    } catch (e) {
    } finally {
      this._requestLock.delete(lockName);
    }
  }

  private _isGroupExisted({ groupName, groupUuid }: { groupName: string; groupUuid: string }) {
    return this.groups.some(({ text, id }) => groupName === text && id !== groupUuid);
  }

  private _generateGroupName() {
    const nextSeq = (this._groupSeq += 1);

    return `${transI18n('fcr_group_label_default_name')} ${nextSeq.toString().padStart(2, '0')}`;
  }

  @action
  private _setConnectionState(state: boolean) {
    this._isJoiningSubRoom = state;
  }

  private async _waitUntilLeft() {
    await when(() => this.classroomStore.connectionStore.rtcState === AGRtcState.Idle);
  }

  private async _waitUntilConnected() {
    if (
      [AGRtcState.Connecting, AGRtcState.Reconnecting].includes(
        this.classroomStore.connectionStore.rtcState,
      )
    ) {
      await when(() => this.classroomStore.connectionStore.rtcState === AGRtcState.Connected);
    }
  }

  private async _waitUntilJoined() {
    if (this._isJoiningSubRoom) {
      await when(() => !this._isJoiningSubRoom);
    }
  }

  private _grantWhiteboard() {
    this.getters.boardApi.grantPrivilege(EduClassroomConfig.shared.sessionInfo.userUuid, true);
  }

  @bound
  private async _joinSubRoom() {
    await this._waitUntilJoined();

    this._setConnectionState(true);

    const roomUuid = this.classroomStore.groupStore.currentSubRoom;

    if (!roomUuid) {
      this.logger.error('cannot find roomUuid');
      this._setConnectionState(false);
      return;
    }

    let joinSuccess = false;
    try {
      if (isTeacher()) {
        this.logger.info("remove teacher's stream");
        await this.classroomStore.connectionStore.scene?.localUser?.deleteLocalMediaStream();
        this.logger.info("remove teacher's stream success");
      }

      await this._waitUntilConnected();

      if (this.classroomStore.connectionStore.rtcSubState !== AGRtcState.Idle) {
        this.classroomStore.mediaStore.stopScreenShareCapture();
        this.classroomStore.connectionStore.leaveRTC(AGRtcConnectionType.sub);
      }

      await this.classroomStore.connectionStore.leaveRTC();

      await this._waitUntilLeft();
      while (true) {
        try {
          await this.classroomStore.connectionStore.joinSubRoom(roomUuid);
          await this.getters.classroomUIStore.enableDualStream(
            this.classroomStore.connectionStore.scene,
          );
          await this.classroomStore.connectionStore.joinRTC();
        } catch (e) {
          this.logger.error('change sub room err', e);
          await sleep(1000);
          continue;
        }
        break;
      }

      joinSuccess = true;
    } catch (e) {
      //   this.shareUIStore.addGenericErrorDialog(e as AGError);
    } finally {
      this._setConnectionState(false);
    }

    if (joinSuccess && EduClassroomConfig.shared.sessionInfo.role === EduRoleTypeEnum.student) {
      this._grantWhiteboard();
    }
  }

  @bound
  private async _copyRoomContent() {
    this.getters.boardApi.loadAttributes();
  }

  @bound
  private async _leaveSubRoom() {
    await this._waitUntilJoined();
    this._setConnectionState(true);
    try {
      await this.classroomStore.connectionStore.leaveSubRoom();

      await when(() => this.classroomStore.connectionStore.rtcState === AGRtcState.Idle);

      await this.classroomStore.connectionStore.joinRTC();
      //@ts-ignore
      await this.classroomStore.connectionStore._entry(
        EduClassroomConfig.shared.sessionInfo,
        SceneType.Main,
      );
    } catch (e) {
      //   this.shareUIStore.addGenericErrorDialog(e as AGError);
    } finally {
      this._setConnectionState(false);
    }
  }

  @bound
  private async _changeSubRoom() {
    await this._waitUntilJoined();

    this._setConnectionState(true);

    const roomUuid = this.classroomStore.groupStore.currentSubRoom;

    if (!roomUuid) {
      this.logger.error('cannot find roomUuid');
      this._setConnectionState(false);
      return;
    }

    let joinSuccess = false;
    try {
      if (isTeacher()) {
        this.logger.info("remove teacher's stream");
        await this.classroomStore.connectionStore.scene?.localUser?.deleteLocalMediaStream();
        this.logger.info("remove teacher's stream success");
      }

      await this.classroomStore.connectionStore.leaveSubRoom();

      await this._waitUntilLeft();

      while (true) {
        try {
          await this.classroomStore.connectionStore.joinSubRoom(roomUuid);

          await this.classroomStore.connectionStore.joinRTC();
        } catch (e) {
          this.logger.error('join sub room err', e);
          await sleep(1000);
          continue;
        }
        break;
      }

      joinSuccess = true;
    } catch (e) {
      this.logger.error('cannot change sub room', e);
    } finally {
      this._setConnectionState(false);
    }
    if (joinSuccess && EduClassroomConfig.shared.sessionInfo.role === EduRoleTypeEnum.student) {
      this._grantWhiteboard();
    }
  }

  @bound
  private async _handleClassroomEvent(type: AgoraEduClassroomEvent, args: any) {
    if (type === AgoraEduClassroomEvent.JoinSubRoom) {
      this._joinSubRoom();
    }
    if (type === AgoraEduClassroomEvent.LeaveSubRoom) {
      this._leaveSubRoom();
    }

    if (type === AgoraEduClassroomEvent.InvitedToGroup) {
      const { groupUuid, groupName, inviter = 'Student' } = args;
      const isTeacher = this.getters.isHost;

      if (isTeacher) {
        runInAction(() => {
          this._helpRequestList.push({
            groupUuid,
            groupName,
          });
        });
      } else {
        const title = isTeacher ? transI18n('fcr_group_help_title') : transI18n('fcr_group_join');
        const content = isTeacher
          ? transI18n('fcr_group_confirm_ask_for_help', { reason1: inviter, reason2: groupName })
          : transI18n('fcr_group_invitation', { reason1: groupName });
        const ok = transI18n('fcr_group_button_join');
        const cancel = transI18n('fcr_group_button_later');
        const dialogId = uuidv4();
        this.getters.classroomUIStore.layoutUIStore.addDialog('confirm', {
          id: dialogId,
          title,
          content,
          onOk: () => {
            this.classroomStore.groupStore.acceptGroupInvite(groupUuid);
          },
          onClose: () => {
            this.classroomStore.groupStore.rejectGroupInvite(groupUuid);
          },
          okText: ok,
          cancelText: cancel,
        });

        this._dialogsMap.set(groupUuid, dialogId);
      }
    }

    if (type === AgoraEduClassroomEvent.RejectedToGroup) {
      const { groupUuid, removeProgress } = args as RejectToGroupArgs;
      const isLocal = removeProgress.some(
        (item) => item.userUuid === EduClassroomConfig.shared.sessionInfo.userUuid,
      );
      const isTeacher = this.getters.isHost;
      const dialogId = this._dialogsMap.get(groupUuid);
      if (isLocal) {
        if (dialogId) {
          this.getters.classroomUIStore.layoutUIStore.deleteDialog(dialogId);
        }
        if (isTeacher) {
          runInAction(() => {
            const group = this._helpRequestList.find((item) => groupUuid === item.groupUuid);
            this._helpRequestList = this._helpRequestList.filter(
              (item) => groupUuid !== item.groupUuid,
            );
          });
        }
      }
    }

    if (type === AgoraEduClassroomEvent.MoveToOtherGroup) {
      if (this._studentInvite?.isInvite) {
        ToastApi.open({
          toastProps: {
            type: 'normal',
            content: transI18n('fcr_move_group_tips', { reason: this._initGroupInfo?.groupName }),
          },
        });
        const userUuid = EduClassroomConfig.shared.sessionInfo.userUuid;
        const userName = EduClassroomConfig.shared.sessionInfo.userName;
        this._studentInvite.isInvite = false;
        if (this._inviteStudentTask?.stop) {
          this._inviteStudentTask?.stop();
        }
        const teachers = this.classroomStore.userStore.mainRoomDataStore.teacherList;
        const teacherUuid = teachers.keys().next().value;
        const message: CustomMessageData<CustomMessageCancelInviteType> = {
          cmd: CustomMessageCommandType.cancelInvite,
          data: {
            groupUuid: this._initGroupInfo && this._initGroupInfo.groupUuid,
            groupName: (this._initGroupInfo && this._initGroupInfo?.groupName) || '',
            isInvite: false,
            userUuid: userUuid,
            userName: userName,
          },
        };
        this.classroomStore.connectionStore.mainRoomScene?.localUser?.sendCustomPeerMessage(
          'flexMsg',
          message,
          teacherUuid,
          false,
        );
        await sleep(2000);
        this._changeSubRoom();
      } else {
        this._changeSubRoom();
      }
    }
  }
  @computed
  get inviteStudents() {
    return [...this._inviteStudents];
  }
  @computed
  get inviteGroups() {
    console.log('inviteGroupsinviteGroups', this._inviteGroups);
    return [...this._inviteGroups];
  }
  @action.bound
  changeInviteGroup(arr: any, index: number, isShow: boolean) {
    arr[index].isShow = isShow;
    this._inviteGroups = [...arr];
  }
  @action.bound
  changeReduceInviteGroup(arr: any, isOut = false, index = -1) {
    if (isOut) {
      arr.splice(index, 1);
      this._inviteGroups = [...arr];
    } else {
      this._inviteGroups = [...arr];
    }
  }
  @computed
  get cancelGroupUuid() {
    return this._cancelGroupUuid;
  }
  @action.bound
  setCancelGroupUuid(uuid: string) {
    this._cancelGroupUuid = uuid;
  }
  @action.bound
  private _onReceivePeerMessage(message: AgoraRteCustomMessage) {
    const data = message.payload;
    const cmd = data.cmd;
    switch (cmd) {
      case CustomMessageCommandType.inviteTeacher: {
        const { userUuid, inviteStudentTask } = message.payload.data;
        const index = this._studentInviteTasks.findIndex((v: any) => v.userUuid === userUuid);
        if (index === -1) {
          this._studentInviteTasks.push({ userUuid, inviteStudentTask });
        }
        console.log('this._studentInviteTasks', this._studentInviteTasks);
        if (
          index > -1 &&
          (!this._studentInviteTasks[index]?.inviteStudentTask ||
            (this._studentInviteTasks[index]?.inviteStudentTask &&
              !this._studentInviteTasks[index]?.inviteStudentTask.__running))
        ) {
          this._studentInviteTasks.splice(index, 1);
        }
        // if (this._cancelGroupUuid === message.payload.data.groupUuid) {
        //   this._cancelGroupUuid = ''
        //   break
        // }
        const studentInvite = this._studentInvites.find(
          (v: { groupUuid: string }) => v.groupUuid === message.payload.data.groupUuid,
        );
        if (studentInvite) {
          const stu = studentInvite.children.find(
            (v: { userUuid: string }) => v.userUuid === message.payload.data.userUuid,
          );
          if (!stu) {
            studentInvite.children.push({
              userUuid: message.payload.data.userUuid,
              userName: message.payload.data.userName,
            });
            this._inviteStudents.push({
              userUuid: message.payload.data.userUuid,
              userName: message.payload.data.userName,
            });
            const group = this._inviteGroups.find(
              (v: { groupUuid: string }) => v.groupUuid === message.payload.data.groupUuid,
            );
            if (!group) {
              this._inviteGroups.push({
                groupUuid: message.payload.data.groupUuid,
                isShow: false,
              });
            }
          }
          this._studentInvites = [...studentInvite];
          console.log(
            '_onReceivePeerMessage_onReceivePeerMessage',
            this._studentInviteTasks,
            inviteStudentTask,
            this._studentInvites,
          );
        } else {
          const obj = {
            groupUuid: message.payload.data.groupUuid,
            groupName: message.payload.data.groupName,
            isInvite: message.payload.data.isInvite,
            children: [
              {
                userUuid: message.payload.data.userUuid,
                userName: message.payload.data.userName,
              },
            ],
          };
          this._studentInvites.push(obj);
          this._inviteStudents = [
            {
              userUuid: message.payload.data.userUuid,
              userName: message.payload.data.userName,
            },
          ];
          this._inviteGroups = [
            {
              groupUuid: message.payload.data.groupUuid,
              isShow: false,
            },
          ];
        }
        console.log('CustomMessageCommandType.inviteTeacher', this._studentInviteTasks);
        break;
      }
      case CustomMessageCommandType.cancelInvite: {
        const item = this._studentInvites.find(
          (v: { groupUuid: string }) => v.groupUuid === message.payload.data.groupUuid,
        );
        if (item) {
          const index = item.children.findIndex(
            (v: { userUuid: string }) => v.userUuid === message.payload.data.userUuid,
          );
          if (index > -1) {
            item.children.splice(index, 1);
            this._inviteStudents.splice(index, 1);
            if (item.children.length === 0) {
              this._cancelGroupUuid = message.payload.data.groupUuid;
              const lists = this._studentInvites.filter(
                (v: { groupUuid: string }) => v.groupUuid !== message.payload.data.groupUuid,
              );
              this._studentInvites = [...lists] || [];
            }
          }
          const idx = this._inviteGroups.findIndex(
            (v: { groupUuid: any }) => v.groupUuid === message.payload.data.groupUuid,
          );
          if (idx > -1) {
            this._inviteGroups.splice(idx, 1);
          }
        }
        break;
      }
      default: {
        break;
      }
    }
  }
  @action.bound
  private _onReceiveChannelMessage(message: AgoraRteCustomMessage) {
    const data: any = message.payload;
    const cmd = data.cmd;
    switch (cmd) {
      case CustomMessageCommandType.teacherRejectInvite: {
        const groupUuid = data?.data?.groupUuid || '';
        if (groupUuid === this.classroomStore.groupStore.currentSubRoom) {
          ToastApi.open({
            toastProps: {
              type: 'info',
              content: transI18n('fcr_group_help_teacher_busy_msg'),
            },
          });
          if (this._inviteStudentTask?.stop) {
            this._inviteStudentTask?.stop();
          }
          this._studentInvite.isInvite = false;
        }
        break;
      }
      case CustomMessageCommandType.teacherAcceptInvite: {
        const groupUuid = data?.data?.groupUuid || '';
        if (groupUuid === this.classroomStore.groupStore.currentSubRoom) {
          ToastApi.open({
            toastProps: {
              type: 'info',
              content: transI18n('fcr_group_teacher_join'),
            },
          });
          if (this._inviteStudentTask?.stop) {
            this._inviteStudentTask?.stop();
          }
          this._studentInvite.isInvite = false;
        }
        break;
      }
      case CustomMessageCommandType.teacherCloseGroup: {
        if (this._inviteStudentTask?.stop) {
          this._inviteStudentTask?.stop();
        }
        this._studentInvite.isInvite = false;
        break;
      }
    }
  }
  onInstall() {
    this.classroomStore.roomStore.addCustomMessageObserver({
      onReceiveChannelMessage: this._onReceiveChannelMessage,
      onReceivePeerMessage: this._onReceivePeerMessage,
    });
    this._disposers.push(
      reaction(
        () => this.getters.boardApi.mounted,
        (mounted) => {
          if (mounted && this.getters.isGranted) {
            this._copyRoomContent();
          }
        },
      ),
      reaction(
        () => this.groupState,
        () => {
          if (this.groupState) {
            this._wizardState = 1;
          }
        },
      ),
    );
    EduEventCenter.shared.onClassroomEvents(this._handleClassroomEvent);
  }

  onDestroy() {
    EduEventCenter.shared.onClassroomEvents(this._handleClassroomEvent);
    this._disposers.forEach((d) => d());
    this._disposers = [];
  }
}
