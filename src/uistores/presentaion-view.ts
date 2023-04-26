import { action, computed, observable, reaction, runInAction } from 'mobx';
import { EduUIStoreBase } from './base';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { AgoraRteEventType, Lodash, Log } from 'agora-rte-sdk';
@Log.attach({ proxyMethods: false })
export class PresentationUIStore extends EduUIStoreBase {
  private _cacheBoardEnableStatus = false;
  @observable boardViewportSize?: { width: number; height: number };
  @observable isMainViewStreamPinned = false;
  @observable mainViewStreamUuid: string | null = null;
  pageSize = 6;
  @observable currentPage = 1;
  @action.bound
  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  @action.bound
  pinStream(streamUuid: string) {
    this.isMainViewStreamPinned = false;
    this.setMainViewStream(streamUuid);

    this.isMainViewStreamPinned = true;
  }
  @action.bound
  removePinnedStream() {
    this.isMainViewStreamPinned = false;
  }
  @computed
  get isListViewFloat() {
    return this.isBoardWidgetActive;
  }
  @computed get pinnedUserUuid() {
    return this.isMainViewStreamPinned && this.mainViewStream?.fromUser.userUuid;
  }
  @computed get isBoardWidgetActive() {
    return this.getters.isBoardWidgetActive;
  }
  @computed get mainViewStream() {
    if (!this.mainViewStreamUuid) return null;
    const stream = this.classroomStore.streamStore.streamByStreamUuid.get(this.mainViewStreamUuid);
    if (stream) return new EduStreamUI(stream);
    return null;
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
    if (
      this.isMainViewStreamPinned ||
      this.getters.isBoardWidgetActive ||
      this.getters.screenShareUIStream
    )
      return;
    this.mainViewStreamUuid = null;

    this.mainViewStreamUuid = streamUuid;
  }
  @action
  clearMainViewStream() {
    this.mainViewStreamUuid = null;
  }
  @Lodash.debounced(3000)
  @action.bound
  _handleStreamVolumes(volumes: Map<string, number>) {
    let activeStreamUuid = '';
    volumes.forEach((volume, key) => {
      if (volume * 100 > 50) activeStreamUuid = key;
    });
    if (activeStreamUuid) this.setMainViewStream(activeStreamUuid);
  }
  @action.bound
  private _handleMainCameraStream() {
    if (this.getters.cameraUIStreams.length) {
      this.setMainViewStream(this.getters.cameraUIStreams[0].stream.streamUuid);
    }
  }

  onDestroy(): void {
    this._disposers.forEach((d) => d());
    this._disposers = [];
  }
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
    ),
      this._disposers.push(
        reaction(
          () => this.getters.isBoardWidgetActive,
          (isBoardWidgetActive) => {
            if (isBoardWidgetActive) {
              this.clearMainViewStream();
              // stop timer
            } else {
              this._handleMainCameraStream();
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
            runInAction(() => {
              this.mainViewStreamUuid = screenShareUIStream.stream.streamUuid;
              this.isMainViewStreamPinned = false;
            });
          } else {
            this.setMainViewStream(null);

            this._handleMainCameraStream();
          }
        },
      ),
    );
    this._disposers.push(
      reaction(() => {
        return this.getters.cameraUIStreams.length && this.mainViewStream;
      }, this._handleMainCameraStream),
    );
  }
}
