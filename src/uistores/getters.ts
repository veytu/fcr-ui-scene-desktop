import { ConfirmDialogProps } from '@components/dialog/confirm-dialog';
import { extractUserStreams } from '@onlineclass/utils/stream';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { EduClassroomConfig, EduRoleTypeEnum, EduStream } from 'agora-edu-core';
import { AgoraRteVideoSourceType } from 'agora-rte-sdk';
import { action, computed, observable } from 'mobx';
import { computedFn } from 'mobx-utils';
import { OnlineclassUIStore } from '.';
import { DialogType } from './type';
import { v4 as uuidv4 } from 'uuid';
import { ClassDialogProps } from '@components/dialog/class-dialog';

export class Getters {
  constructor(private _classroomUIStore: OnlineclassUIStore) {}

  @observable dialogMap: Map<string, { type: DialogType }> = new Map();

  hasDialogOf(type: DialogType) {
    let exist = false;
    this.dialogMap.forEach(({ type: dialogType }) => {
      if (dialogType === type) {
        exist = true;
      }
    });

    return exist;
  }

  addDialog(type: 'confirm', params: ConfirmDialogProps): void;
  addDialog(type: 'device-settings'): void;
  addDialog(type: 'participants'): void;
  addDialog(type: 'class-info', params: ClassDialogProps): void;

  @action.bound
  addDialog(type: unknown, params?: unknown) {
    this.dialogMap.set(uuidv4(), { ...(params as any), type: type as DialogType });
  }

  @action.bound
  deleteDialog = (type: string) => {
    this.dialogMap.delete(type);
  };

  get classroomUIStore() {
    return this._classroomUIStore;
  }

  get boardApi() {
    return this._classroomUIStore.boardApi;
  }
  get chatApi() {
    return this._classroomUIStore.chatApi;
  }
  get eduTool() {
    return this._classroomUIStore.eduToolApi;
  }
  @computed
  get isGranted() {
    return this._classroomUIStore.boardApi.granted;
  }

  get roomName() {
    return EduClassroomConfig.shared.sessionInfo.roomName;
  }
  get roomUuid() {
    return EduClassroomConfig.shared.sessionInfo.roomUuid;
  }

  get isHost() {
    return EduClassroomConfig.shared.sessionInfo.role === EduRoleTypeEnum.teacher;
  }

  get isStudent() {
    return EduClassroomConfig.shared.sessionInfo.role === EduRoleTypeEnum.student;
  }
  @computed
  get localUser() {
    return this._classroomUIStore.classroomStore.userStore.localUser;
  }
  @computed
  get videoStreams() {
    const { streamByUserUuid, streamByStreamUuid } =
      this._classroomUIStore.classroomStore.streamStore;
    const videoStreams = extractUserStreams(
      this._classroomUIStore.classroomStore.userStore.users,
      streamByUserUuid,
      streamByStreamUuid,
      [AgoraRteVideoSourceType.Camera, AgoraRteVideoSourceType.ScreenShare],
    );
    return videoStreams;
  }
  @computed
  get videoUIStreams() {
    return Array.from(this.videoStreams).map((stream) => new EduStreamUI(stream));
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

  @computed
  get screenShareUIStream() {
    const streamUuid = this._classroomUIStore.classroomStore.roomStore
      .screenShareStreamUuid as string;
    const stream =
      this._classroomUIStore.classroomStore.streamStore.streamByStreamUuid.get(streamUuid);
    return stream ? new EduStreamUI(stream) : null;
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

  get viewportBoundaries() {
    return this._classroomUIStore.layoutUIStore.viewportBoundaries;
  }

  get activeWidgetIds() {
    return this._classroomUIStore.widgetUIStore.widgetInstanceList.map((w) => w.widgetId);
  }
}
