import { action, computed, observable, reaction, runInAction } from 'mobx';
import { EduUIStoreBase } from './base';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
export class PresentationUIStore extends EduUIStoreBase {
  @observable mainViewStream: EduStreamUI | null = null;
  @computed
  get listViewStreams() {
    return this.getters.cameraUIStreams;
  }
  @action
  setMainViewStream(streamUuid: string) {
    this.mainViewStream =
      this.getters.cameraUIStreams.find((stream) => stream.stream.streamUuid === streamUuid) ||
      null;
  }
  @action
  clearMainViewStream() {
    this.mainViewStream = null;
  }
  onDestroy(): void {}
  onInstall(): void {
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
          return this.getters.cameraUIStreams;
        },
        (cameraUIStreams) => {
          if (cameraUIStreams.length === 1) {
            runInAction(() => {
              this.mainViewStream = cameraUIStreams[0];
            });
          }
        },
      ),
    );
  }
}
