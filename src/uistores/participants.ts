import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { EduRoleTypeEnum, iterateMap } from 'agora-edu-core';
import { bound } from 'agora-rte-sdk';
import { action, computed, observable } from 'mobx';
import { EduUIStoreBase } from './base';
import { computedFn } from 'mobx-utils';
export class ParticipantsUIStore extends EduUIStoreBase {
  get isHost() {
    return this.getters.isHost;
  }
  isHostByUserRole = (role: EduRoleTypeEnum) => {
    return role === EduRoleTypeEnum.teacher;
  };
  @observable searchKey = '';
  @action.bound
  setSearchKey(text: string) {
    this.searchKey = text;
  }
  @computed
  get participantList() {
    const { list } = iterateMap(this.classroomStore.userStore.users, {
      onFilter: (_, item) => {
        return item.userName.includes(this.searchKey);
      },
      onMap: (_, item) => {
        const stream = this.getters.userCameraStreamByUserUuid(item.userUuid);
        const uiStream = stream ? new EduStreamUI(stream) : undefined;
        return {
          user: item,
          stream: uiStream,
        };
      },
    });
    return list.sort((prev, next) => {
      if (this.isHostByUserRole(prev.user.userRole)) {
        return -1;
      } else if (this.isHostByUserRole(next.user.userRole)) {
        return 1;
      }
      if (
        this.getters.boardApi.grantedUsers.has(prev.user.userUuid) &&
        !this.getters.boardApi.grantedUsers.has(next.user.userUuid)
      ) {
        return -1;
      } else if (
        this.getters.boardApi.grantedUsers.has(next.user.userUuid) &&
        !this.getters.boardApi.grantedUsers.has(prev.user.userUuid)
      ) {
        return 1;
      }
      return 0;
    });
  }
  @bound
  sendReward(userUuid: string) {
    const { sendRewards } = this.classroomStore.roomStore;
    return sendRewards([
      {
        userUuid,
        changeReward: 1,
      },
    ]);
  }
  @bound
  grantPrivilege(userUuid: string, granted: boolean) {
    return this.getters.boardApi.grantPrivilege(userUuid, granted);
  }
  rewardsByUserUuid = computedFn((userUuid: string) => {
    return this.classroomStore.userStore.rewards.get(userUuid) || 0;
  });

  onDestroy(): void {}
  onInstall(): void {}
}
