import { action, computed, observable, reaction } from 'mobx';
import { EduUIStoreBase } from './base';
import { Log } from 'agora-rte-sdk';
@Log.attach({ proxyMethods: false })
export class PresentationUIStore extends EduUIStoreBase {
  private _cacheBoardEnableStatus = false;
  @observable boardViewportSize?: { width: number; height: number };
  pageSize = 6;
  @observable currentPage = 1;
  @action.bound
  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  @computed
  get isListViewFloat() {
    return this.isBoardWidgetActive;
  }

  @computed get isBoardWidgetActive() {
    return this.getters.isBoardWidgetActive;
  }
  @computed get mainViewStream() {
    if (this.isBoardWidgetActive) return null;
    //观众优先展示屏幕分享
    if (this.getters.screenShareUIStream && !this.getters.isLocalScreenSharing)
      return this.getters.screenShareUIStream;
    //如果有pin，展示pin
    if (this.getters.pinnedUIStream) {
      return this.getters.pinnedUIStream;
    }
    //默认逻辑，如果有老师展示老师，没老师展示学生
    if (this.getters.teacherUIStream) return this.getters.teacherUIStream;
    return this.getters.localCameraStream;
  }

  @computed get totalPage() {
    return Math.ceil(this.getters.cameraUIStreams.length / this.pageSize);
  }
  @computed get showPager() {
    return this.totalPage > 1;
  }
  @computed get listViewStreamsByPage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.getters.cameraUIStreams.slice(start, end);
  }

  onDestroy(): void {
    this._disposers.forEach((d) => d());
    this._disposers = [];
  }
  onInstall(): void {
    this._disposers.push(
      reaction(
        () => this.classroomStore.streamStore.localShareStreamUuid,
        () => {
          const screenShareEnabled = !!this.classroomStore.streamStore.localShareStreamUuid;
          if (screenShareEnabled) {
            if (this.isBoardWidgetActive) {
              this._cacheBoardEnableStatus = true;
              this.getters.boardApi.disable();
            }
          } else {
            if (this._cacheBoardEnableStatus) this.getters.boardApi.enable();
            this._cacheBoardEnableStatus = false;
          }
        },
      ),
    );
  }
}
