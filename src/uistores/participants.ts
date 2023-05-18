import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { EduRoleTypeEnum, iterateMap } from 'agora-edu-core';
import { bound } from 'agora-rte-sdk';
import { action, computed, observable } from 'mobx';
import { EduUIStoreBase } from './base';
import { computedFn } from 'mobx-utils';
export enum ParticipantsTableSortKeysEnum {
  Auth = 'Auth',
  Camera = 'Camera',
  Microphone = 'Microphone',
  Reward = 'Reward',
}
export type ParticipantsOrderDirection = 'asc' | 'desc';
export class ParticipantsUIStore extends EduUIStoreBase {
  @observable participantsDialogVisible = false;
  @action.bound
  setParticipantsDialogVisible(visible: boolean) {
    this.participantsDialogVisible = visible;
  }
  @observable orderKey = 'Auth';
  @action.bound
  setOrderKey(orderKey: string) {
    this.orderKey = orderKey;
  }
  @observable orderDirection: ParticipantsOrderDirection = 'asc';
  @action.bound
  setOrderDirection(orderDirection: 'asc' | 'desc') {
    this.orderDirection = orderDirection;
  }
  participants = [];
  tableIconSize = 28;
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
      if (this.orderKey === ParticipantsTableSortKeysEnum.Auth) {
        if (
          this.getters.boardApi.grantedUsers.has(prev.user.userUuid) &&
          !this.getters.boardApi.grantedUsers.has(next.user.userUuid)
        ) {
          return this.orderDirection === 'asc' ? -1 : 1;
        } else if (
          this.getters.boardApi.grantedUsers.has(next.user.userUuid) &&
          !this.getters.boardApi.grantedUsers.has(prev.user.userUuid)
        ) {
          return this.orderDirection === 'asc' ? 1 : -1;
        }
        return 0;
      }
      if (this.orderKey === ParticipantsTableSortKeysEnum.Camera) {
        if (prev.stream?.isVideoStreamPublished && !next.stream?.isVideoStreamPublished) {
          return this.orderDirection === 'asc' ? -1 : 1;
        } else if (next.stream?.isVideoStreamPublished && !prev.stream?.isVideoStreamPublished) {
          return this.orderDirection === 'asc' ? 1 : -1;
        }
        return 0;
      }
      if (this.orderKey === ParticipantsTableSortKeysEnum.Microphone) {
        if (prev.stream?.isMicStreamPublished && !next.stream?.isMicStreamPublished) {
          return this.orderDirection === 'asc' ? -1 : 1;
        } else if (next.stream?.isMicStreamPublished && !prev.stream?.isMicStreamPublished) {
          return this.orderDirection === 'asc' ? 1 : -1;
        }
        return 0;
      }
      if (this.orderKey === ParticipantsTableSortKeysEnum.Reward) {
        const getRewardCount = (userUuid: string) => {
          return this.classroomStore.userStore.rewards.get(userUuid) || 0;
        };
        if (getRewardCount(prev.user.userUuid) > getRewardCount(next.user.userUuid)) {
          return this.orderDirection === 'asc' ? -1 : 1;
        } else if (getRewardCount(next.user.userUuid) > getRewardCount(prev.user.userUuid)) {
          return this.orderDirection === 'asc' ? 1 : -1;
        }
        return 0;
      }
      return 0;
    });
  }

  @computed get participantStudentList() {
    return this.participantList.filter(({ user }) => user.userRole === EduRoleTypeEnum.student);
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

  onDestroy(): void {
    this._disposers.forEach((d) => d());
    this._disposers = [];
  }
  onInstall(): void {}
}
