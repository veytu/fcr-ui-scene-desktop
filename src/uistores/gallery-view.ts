import { action, computed, observable, reaction, runInAction } from 'mobx';
import { EduUIStoreBase } from './base';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
export class GalleryUIStore extends EduUIStoreBase {
  @observable mainViewStreamUuid: string | null = null;
  pageSize = 25;
  @observable currentPage = 1;
  @computed
  get mainViewStream() {
    if (!this.mainViewStreamUuid) return null;
    const stream = this.classroomStore.streamStore.streamByStreamUuid.get(this.mainViewStreamUuid);
    if (stream) return new EduStreamUI(stream);
    return null;
  }
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
  @action.bound
  private _handleMainCameraStream() {
    if (!this.getters.screenShareUIStream) {
      if (this.getters.cameraUIStreams.length === 1) {
        this.mainViewStreamUuid = this.getters.cameraUIStreams[0].stream.streamUuid;
      } else {
        this.mainViewStreamUuid = null;
      }
    }
  }
  onDestroy(): void {}
  onInstall(): void {
    this._disposers.push(
      reaction(
        () => {
          return this.getters.screenShareUIStream;
        },
        (screenShareUIStream) => {
          if (screenShareUIStream) {
            this.mainViewStreamUuid = screenShareUIStream.stream.streamUuid;
          } else {
            this._handleMainCameraStream();
          }
        },
      ),
    );
    this._disposers.push(
      reaction(() => {
        return this.getters.cameraUIStreams;
      }, this._handleMainCameraStream),
    );
  }
}
