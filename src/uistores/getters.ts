import { extractUserStreams } from '@onlineclass/utils/stream';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { EduClassroomConfig, EduStream } from 'agora-edu-core';
import { AgoraRteVideoSourceType } from 'agora-rte-sdk';
import { computed } from 'mobx';
import { computedFn } from 'mobx-utils';
import { OnlineclassUIStore } from '.';

export class Getters {
  constructor(private _classroomUIStore: OnlineclassUIStore) {}

  get boardApi() {
    return this._classroomUIStore.boardApi;
  }

  get roomName() {
    return EduClassroomConfig.shared.sessionInfo.roomName;
  }
  get roomUuid() {
    return EduClassroomConfig.shared.sessionInfo.roomUuid;
  }

  @computed
  get cameraStreams() {
    const { streamByUserUuid, streamByStreamUuid } =
      this._classroomUIStore.classroomStore.streamStore;
    const cameraStreams = extractUserStreams(
      this._classroomUIStore.classroomStore.userStore.users,
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

  get layoutReady() {
    return this._classroomUIStore.layoutUIStore.layoutReady;
  }

  get isBoardWidgetActive() {
    return this._classroomUIStore.widgetUIStore.widgetInstanceList.some((widget) => {
      return widget.widgetName === 'netlessBoard';
    });
  }
}
