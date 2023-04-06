import { action, computed, observable, reaction, runInAction } from 'mobx';
import { EduUIStoreBase } from './base';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
export class GalleryUIStore extends EduUIStoreBase {
  @observable mainViewStream: EduStreamUI | null = null;
  pageSize = 25;
  @observable currentPage = 1;
  @computed get showPager() {
    return this.totalPage > 1;
  }
  @computed get totalPage() {
    return Math.ceil(this.getters.cameraUIStreams.length / this.pageSize);
  }
  @computed get streamsByPage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.getters.cameraUIStreams.slice(start, end);
  }
  @action.bound
  setCurrentPage(page: number) {
    this.currentPage = page;
  }
  onDestroy(): void {}
  onInstall(): void {
    this._disposers.push(
      reaction(
        () => {
          return this.getters.cameraUIStreams;
        },
        (cameraUIStreams) => {
          if (cameraUIStreams.length === 1) {
            runInAction(() => {
              this.mainViewStream = cameraUIStreams[0];
            });
          } else {
            this.mainViewStream = null;
          }
        },
      ),
    );
  }
}
