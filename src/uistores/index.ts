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
import { observable, action } from 'mobx';
import { EduUIStoreBase } from './base';
import { DeviceSettingUIStore } from './device-setting';
import { ActionBarUIStore } from './action-bar';
import { OnlineclassContext } from './context';
import { Getters } from './getters';
import { LayoutUIStore } from './layout';
import { StatusBarUIStore } from './status-bar';

export class OnlineclassUIStore {
  // @observable
  private _installed = false;
  @observable
  private _devicePretestFinished = false;
  private _getters: Getters;

  classroomStore: EduClassroomStore;
  layoutUIStore: LayoutUIStore;
  statusBarUIStore: StatusBarUIStore;
  deviceSettingUIStore: DeviceSettingUIStore;
  actionBarUIStore: ActionBarUIStore;
  constructor() {
    this.classroomStore = EduStoreFactory.createWithType(EduRoomTypeEnum.RoomSmallClass);
    this._getters = new Getters(this.classroomStore);
    this.layoutUIStore = new LayoutUIStore(this.classroomStore, this._getters);
    this.statusBarUIStore = new StatusBarUIStore(this.classroomStore, this._getters);
    this.deviceSettingUIStore = new DeviceSettingUIStore(this.classroomStore, this._getters);
    this.actionBarUIStore = new ActionBarUIStore(this.classroomStore, this._getters);
  }

  get initialized() {
    return this._installed;
  }

  get devicePretestFinished() {
    return this._devicePretestFinished;
  }

  @action.bound
  // @bound
  initialize() {
    if (this._installed) {
      return;
    }
    Object.getOwnPropertyNames(this).forEach((propertyName) => {
      if (propertyName.endsWith('UIStore')) {
        const uiStore = this[propertyName];
        if (uiStore instanceof EduUIStoreBase) {
          uiStore.onInstall();
        }
      }
    });

    this.classroomStore.initialize();

    this._installed = true;
    //@ts-ignore
    // window.globalStore = this;
  }

  @action.bound
  setDevicePretestFinished() {
    this._devicePretestFinished = true;
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
    OnlineclassContext.reset();
  }
}
