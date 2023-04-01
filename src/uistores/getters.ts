import { extractUserStreams } from '@onlineclass/utils/stream';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { EduClassroomConfig, EduClassroomStore, iterateMap, iterateSet } from 'agora-edu-core';
import { AgoraRteVideoSourceType } from 'agora-rte-sdk';
import { computed } from 'mobx';
import { computedFn } from 'mobx-utils';
export class Getters {
  get roomName() {
    return EduClassroomConfig.shared.sessionInfo.roomName;
  }
  get roomUuid() {
    return EduClassroomConfig.shared.sessionInfo.roomUuid;
  }
  @computed
  get userList() {
    return iterateMap(this._classroomStore.userStore.users, {
      onMap(key, item) {
        return item;
      },
    }).list;
  }
  userCameraStreamByUserUuid = computedFn((userUuid: string) => {
    const user = this._classroomStore.userStore.users.get(userUuid);
    const userMap = new Map().set(userUuid, user);
    const { streamByUserUuid, streamByStreamUuid } = this._classroomStore.streamStore;
    const cameraStreams = extractUserStreams(userMap, streamByUserUuid, streamByStreamUuid, [
      AgoraRteVideoSourceType.Camera,
    ]);
    return new EduStreamUI(Array.from(cameraStreams)[0]);
  });

  constructor(private _classroomStore: EduClassroomStore) {}
}
