import { computed } from 'mobx';
import { EduUIStoreBase } from './base';
import { computedFn } from 'mobx-utils';
export class GalleryUIStore extends EduUIStoreBase {
  @computed
  get currentUser() {
    if (this.getters.userList.length === 1) {
      return this.getters.userList[0];
    }
    return this.getters.userList[0];
  }
  @computed
  get isSingleUser() {
    return this.getters.userList.length === 1;
  }
  onDestroy(): void {}
  onInstall(): void {}
}
