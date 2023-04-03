import { extractUserStreams } from '@onlineclass/utils/stream';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { EduClassroomConfig, EduClassroomStore, EduStream } from 'agora-edu-core';
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
  get cameraStreams() {
    const { streamByUserUuid, streamByStreamUuid } = this._classroomStore.streamStore;
    const cameraStreams = extractUserStreams(
      this._classroomStore.userStore.users,
      streamByUserUuid,
      streamByStreamUuid,
      [AgoraRteVideoSourceType.Camera],
    );
    return cameraStreams;
  }
  @computed
  get cameraUIStreams() {
    return Array.from(this.cameraStreams).map((stream) => new EduStreamUI(stream));
  }
  userCameraStreamByUserUuid = computedFn((userUuid: string) => {
    const cameraStreams: EduStream[] = [];
    this.cameraStreams.forEach((stream) => {
      if (stream.fromUser.userUuid === userUuid) cameraStreams.push(stream);
    });
    return cameraStreams[0];
  });

  constructor(private _classroomStore: EduClassroomStore) {}
}
