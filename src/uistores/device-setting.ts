import { observable } from 'mobx';
import { EduUIStoreBase } from './base';

/**
 * 设备设置
 */
/** @en
 *
 */
export class DeviceSettingUIStore extends EduUIStoreBase {
  @observable
  virtualBackgroundId?: string;

  setVirtualBackground(backgroundId: string) {}

  setBeautyFilter() {}

  setCamera() {}

  setMicrophone() {}

  setSpeaker() {}

  setupLocalVideo(dom: HTMLElement, mirror: boolean) {
    this.classroomStore.mediaStore.setupLocalVideo(dom, mirror);
  }

  onInstall(): void {
    this.classroomStore.mediaStore.enableLocalVideo(true);
  }

  onDestroy(): void {}
}
