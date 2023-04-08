import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { EduRoleTypeEnum, iterateMap } from 'agora-edu-core';
import { bound } from 'agora-rte-sdk';
import { computed } from 'mobx';
import { EduUIStoreBase } from './base';
import { computedFn } from 'mobx-utils';
export class ParticipantsUIStore extends EduUIStoreBase {
  get isHost() {
    return this.getters.isHost;
  }
  @computed
  get participantList() {
    const { list } = iterateMap(this.classroomStore.userStore.users, {
      onFilter(key, item) {
        return item.userRole !== EduRoleTypeEnum.teacher;
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
    return list;
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
  rewardsByUserUuid = computedFn((userUuid: string) => {
    return this.classroomStore.userStore.rewards.get(userUuid) || 0;
  });
  onDestroy(): void {}
  onInstall(): void {}
}
