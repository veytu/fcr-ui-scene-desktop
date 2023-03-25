import { ConvertMediaOptionsConfig } from '@onlineclass/type';
import {
  AGServiceErrorCode,
  EduClassroomConfig,
  EduClassroomStore,
  EduRoomTypeEnum,
  EduStoreFactory,
  LeaveReason,
  Platform,
} from 'agora-edu-core';
import { AGError, bound } from 'agora-rte-sdk';
import { EduUIStoreBase } from './base';
import { Getters } from './getters';
import { LayoutUIStore } from './layout';

export class OnlineclassUIStore {
  private _installed = false;
  private _getters: Getters;
  classroomStore: EduClassroomStore;

  layoutUIStore: LayoutUIStore;
  constructor() {
    this.classroomStore = EduStoreFactory.createWithType(EduRoomTypeEnum.RoomSmallClass);
    this._getters = new Getters(this.classroomStore);
    this.layoutUIStore = new LayoutUIStore(this.classroomStore, this._getters);
  }
  @bound
  initialize() {
    if (this._installed) {
      return;
    }
    this._installed = true;
    Object.getOwnPropertyNames(this).forEach((propertyName) => {
      if (propertyName.endsWith('UIStore')) {
        const uiStore = this[propertyName];
        if (uiStore instanceof EduUIStoreBase) {
          uiStore.onInstall();
        }
      }
    });

    this.classroomStore.initialize();

    //@ts-ignore
    window.globalStore = this;
  }
  @bound
  async join() {
    const { joinClassroom, joinRTC } = this.classroomStore.connectionStore;
    try {
      await joinClassroom();
    } catch (e) {
      if (AGError.isOf(e as AGError, AGServiceErrorCode.SERV_CANNOT_JOIN_ROOM)) {
        return this.classroomStore.connectionStore.leaveClassroom(LeaveReason.kickOut);
      }

      return this.classroomStore.connectionStore.leaveClassroom(
        LeaveReason.leave,
        new Promise((resolve) => {
          //   this.shareUIStore.addGenericErrorDialog(e as AGError, {
          //     onOK: resolve,
          //     okBtnText: transI18n('toast.leave_room'),
          //   });
        }),
      );
    }

    try {
      const lowStreamCameraEncoderConfigurations = (
        EduClassroomConfig.shared.rteEngineConfig.rtcConfigs as ConvertMediaOptionsConfig
      )?.defaultLowStreamCameraEncoderConfigurations;

      const enableDualStream = EduClassroomConfig.shared.platform !== Platform.H5;
      await this.classroomStore.mediaStore.enableDualStream(enableDualStream);

      await this.classroomStore.mediaStore.setLowStreamParameter(
        lowStreamCameraEncoderConfigurations || EduClassroomConfig.defaultLowStreamParameter(),
      );
    } catch (e) {
      //   this.shareUIStore.addGenericErrorDialog(e as AGError);
    }

    try {
      await joinRTC();
    } catch (e) {
      //   this.shareUIStore.addGenericErrorDialog(e as AGError);
    }
  }
  @bound
  destroy() {
    this.classroomStore.destroy();
    Object.getOwnPropertyNames(this).forEach((propertyName) => {
      if (propertyName.endsWith('UIStore')) {
        const uiStore = this[propertyName];

        if (uiStore instanceof EduUIStoreBase) {
          uiStore.onDestroy();
        }
      }
    });
  }
}
