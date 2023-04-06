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
import { observable, action, runInAction } from 'mobx';
import { EduUIStoreBase } from './base';
import { DeviceSettingUIStore } from './device-setting';
import { ActionBarUIStore } from './action-bar';
import { OnlineclassContext } from './context';
import { Getters } from './getters';
import { LayoutUIStore } from './layout';
import { StatusBarUIStore } from './status-bar';
import { GalleryUIStore } from './gallery-view';
import { StreamUIStore } from './stream';
import { Board } from '../extension/board';
import { WidgetUIStore } from './widget';
import { PresentationUIStore } from './presentaion-view';
import { SubscriptionUIStore } from './subscription';

export class OnlineclassUIStore {
  @observable
  private _installed = false;
  @observable
  private _devicePretestFinished = false;
  readonly getters: Getters;
  readonly classroomStore: EduClassroomStore;
  readonly layoutUIStore: LayoutUIStore;
  readonly statusBarUIStore: StatusBarUIStore;
  readonly deviceSettingUIStore: DeviceSettingUIStore;
  readonly actionBarUIStore: ActionBarUIStore;
  readonly galleryUIStore: GalleryUIStore;
  readonly streamUIStore: StreamUIStore;
  readonly widgetUIStore: WidgetUIStore;
  readonly presentationUIStore: PresentationUIStore;
  readonly subscriptionUIStore: SubscriptionUIStore;

  readonly boardApi = new Board();
  constructor() {
    this.classroomStore = EduStoreFactory.createWithType(EduRoomTypeEnum.RoomSmallClass);
    this.getters = new Getters(this);
    this.layoutUIStore = new LayoutUIStore(this.classroomStore, this.getters);
    this.statusBarUIStore = new StatusBarUIStore(this.classroomStore, this.getters);
    this.deviceSettingUIStore = new DeviceSettingUIStore(this.classroomStore, this.getters);
    this.actionBarUIStore = new ActionBarUIStore(this.classroomStore, this.getters);
    this.galleryUIStore = new GalleryUIStore(this.classroomStore, this.getters);
    this.streamUIStore = new StreamUIStore(this.classroomStore, this.getters);
    this.widgetUIStore = new WidgetUIStore(this.classroomStore, this.getters);
    this.presentationUIStore = new PresentationUIStore(this.classroomStore, this.getters);
    this.subscriptionUIStore = new SubscriptionUIStore(this.classroomStore, this.getters);
  }

  get initialized() {
    return this._installed;
  }

  get devicePretestFinished() {
    return this._devicePretestFinished;
  }

  @bound
  initialize() {
    if (this._installed) {
      return;
    }
    Object.getOwnPropertyNames(this).forEach((propertyName) => {
      if (propertyName.endsWith('UIStore')) {
        const uiStore = this[propertyName as keyof typeof this];
        if (uiStore instanceof EduUIStoreBase) {
          uiStore.onInstall();
        }
      }
    });

    this.classroomStore.initialize();

    runInAction(() => {
      this._installed = true;
    });
    //@ts-ignore
    window.globalStore = this;
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
        const uiStore = this[propertyName as keyof typeof this];

        if (uiStore instanceof EduUIStoreBase) {
          uiStore.onDestroy();
        }
      }
    });
    OnlineclassContext.reset();
  }
}
