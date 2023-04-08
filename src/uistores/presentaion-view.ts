import { action, computed, observable, reaction, runInAction } from 'mobx';
import { EduUIStoreBase } from './base';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { AgoraRteEventType, Lodash } from 'agora-rte-sdk';
export class PresentationUIStore extends EduUIStoreBase {
  @observable isMainViewStreamPinned = false;
  @observable mainViewStream: EduStreamUI | null = null;
  @observable showListView = true;
  pageSize = 6;
  @observable currentPage = 1;
  @action.bound
  setCurrentPage(page: number) {
    this.currentPage = page;
  }
  @action.bound
  toggleShowListView() {
    this.showListView = !this.showListView;
  }
  @action.bound
  pinStream(streamUuid: string) {
    this.isMainViewStreamPinned = true;
    this.setMainViewStream(streamUuid);
  }
  @action.bound
  removePinnedStream() {
    this.isMainViewStreamPinned = false;
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

  @action
  setMainViewStream(streamUuid: string | null) {
    if (this.isMainViewStreamPinned) return;
    this.mainViewStream =
      this.getters.videoUIStreams.find((stream) => stream.stream.streamUuid === streamUuid) || null;
  }
  @action
  clearMainViewStream() {
    this.mainViewStream = null;
  }
  @Lodash.debounced(3000)
  @action.bound
  _handleStreamVolumes(volumes: Map<string, number>) {
    let activeStreamUuid = '';
    volumes.forEach((volume, key) => {
      if (volume * 100 > 50) activeStreamUuid = key;
    });
    if (activeStreamUuid && !this.getters.screenShareUIStream)
      this.setMainViewStream(activeStreamUuid);
  }
  @action.bound
  private _handleMainCameraStream() {
    if (!this.getters.screenShareUIStream && this.getters.cameraUIStreams.length) {
      this.setMainViewStream(this.getters.cameraUIStreams[0].stream.streamUuid);
    }
  }
  onDestroy(): void {}
  onInstall(): void {
    this._disposers.push(
      computed(() => this.classroomStore.connectionStore.scene).observe(
        ({ oldValue, newValue }) => {
          if (oldValue) oldValue.off(AgoraRteEventType.AudioVolumes, this._handleStreamVolumes);
          if (newValue) {
            newValue.on(AgoraRteEventType.AudioVolumes, this._handleStreamVolumes);
          }
        },
      ),
    );
    this._disposers.push(
      reaction(
        () => this.getters.isBoardWidgetActive,
        (isBoardWidgetActive) => {
          if (isBoardWidgetActive) {
            this.clearMainViewStream();
            // stop timer
          } else {
            // start timer
          }
        },
      ),
    );
    this._disposers.push(
      reaction(
        () => {
          return this.getters.screenShareUIStream;
        },
        (screenShareUIStream) => {
          if (screenShareUIStream) {
            this.setMainViewStream(screenShareUIStream.stream.streamUuid);
          } else {
            this.setMainViewStream(null);

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
