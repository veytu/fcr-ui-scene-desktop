import { computed, observable, reaction, runInAction } from 'mobx';
import { EduUIStoreBase } from './base';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
export class PresentationUIStore extends EduUIStoreBase {
  @observable mainViewStream: EduStreamUI | null = null;
  @computed
  get listViewStreams() {
    return this.getters.cameraUIStreams;
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
