import { computed } from 'mobx';
import { EduUIStoreBase } from './base';
export class StreamUIStore extends EduUIStoreBase {
  @computed
  get cameraUIStreams() {
    return this.getters.cameraUIStreams;
  }
  onDestroy(): void {}
  onInstall(): void {}
}
