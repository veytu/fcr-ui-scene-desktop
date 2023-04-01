import { EduUIStoreBase } from './base';
export class StreamUIStore extends EduUIStoreBase {
  userCameraStreamByUserUuid = this.getters.userCameraStreamByUserUuid;
  onDestroy(): void {}
  onInstall(): void {}
}
