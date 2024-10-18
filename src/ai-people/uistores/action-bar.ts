import { EduUIStoreBase } from './base';
import { observable, computed, action, runInAction } from 'mobx';
import { ShareStreamStateKeeper } from '@ui-scene/utils/stream/state-keeper';
import { EduClassroomConfig, RecordMode } from 'agora-edu-core';
import {
  AgoraRteAudioSourceType,
  AgoraRteCustomMessage,
  AgoraRteMediaPublishState,
  AgoraRteMediaSourceState,
  Scheduler,
  bound,
} from 'agora-rte-sdk';
import { computedFn } from 'mobx-utils';

import { isElectron } from '@ui-scene/utils/check';
import { ToastApi } from '@components/toast';
import { getLanguage, transI18n } from 'agora-common-libs';
import { FcrUIAiSceneContext } from './context';
export class ActionBarUIStore extends EduUIStoreBase {
  // for student hands up
  private _handsUpTask: Scheduler.Task | null = null;
  @observable isHandsUp = false;

  //for all hands up
  @observable
  handsUpMap: Map<string, number> = new Map();
  private _handsUpListScanTask: Scheduler.Task | null = null;
  @action.bound
  addHandsUpStudent(userUuid: string) {
    this.handsUpMap.set(userUuid, Date.now());
  }
  @action.bound
  removeHandsUpStudent(userUuid: string) {
    this.handsUpMap.delete(userUuid);
  }
  @action.bound
  clearHandsUpStudent() {
    this.handsUpMap.clear();
  }
  isHandsUpByUserUuid = computedFn((userUuid: string) => {
    return this.handsUpMap.has(userUuid);
  });
  @action.bound
  startHandsUpMapScan() {
    const gapInMs = 6000;
    this._handsUpListScanTask = Scheduler.shared.addIntervalTask(() => {
      const now = Date.now();
      this.handsUpMap.forEach((time, key) => {
        if (now - time > gapInMs) {
          runInAction(() => {
            this.removeHandsUpStudent(key);
          });
        }
      });
    }, gapInMs);
  }
  @action.bound
  stopHandsUpListScan() {
    this._handsUpListScanTask?.stop();
  }
  @computed get isHost() {
    return this.getters.isHost;
  }
  @computed get showEndClassButton() {
    return this.getters.isHost;
  }

  @computed get showToolBox() {
    return this.getters.isHost;
  }
  @computed get showWhiteBoard() {
    return this.getters.isHost;
  }
  @computed get showScreenShare() {
    return this.getters.isHost;
  }
  @computed get showCloud() {
    return this.getters.isHost;
  }
  @observable showLeaveOption = false;
  @observable leaveFlag = 1;

  shareScreenStateKeeperMap: Map<string, ShareStreamStateKeeper> = new Map();
  @action.bound
  setShowLeaveOption(show: boolean, flag: number /* 1 leave clasroom, 2 leave group  */) {
    this.showLeaveOption = show;
    this.leaveFlag = flag;
  }
  @bound
  startRecording() {
    this.classroomStore.recordingStore.startRecording(this.recordArgs);
  }
  @bound
  stopRecording() {
    this.classroomStore.recordingStore.stopRecording();
  }
  get recordArgs() {
    const { recordUrl, recordRetryTimeout } = EduClassroomConfig.shared;

    const args = {
      webRecordConfig: {
        rootUrl: `${recordUrl}?language=${getLanguage()}`,
        videoBitrate: 3000,
      },
      mode: RecordMode.Web,
      retryTimeout: recordRetryTimeout,
    };

    return args;
  }
  @bound
  leaveClassroom() {
    this.getters.classroomUIStore.destroyAll()
    FcrUIAiSceneContext.reset()
  }
  @bound
  private _onReceivePeerMessage(message: AgoraRteCustomMessage) {}
  onDestroy(): void {
    this._disposers.forEach((d) => d());
    this._disposers = [];
    this.stopHandsUpListScan();
  }
  onInstall(): void {
    this.startHandsUpMapScan();
    this._disposers.push(
      computed(() => this.classroomStore.mediaStore.localScreenShareTrackState).observe(
        ({ oldValue, newValue }) => {
          if (oldValue && !newValue) {
            ToastApi.open({
              toastProps: {
                type: 'info',
                content: transI18n('fcr_room_tips_stop_sharing'),
              },
            });
          }
        },
      ),
    );
    this._disposers.push(
      computed(() => this.classroomStore.streamStore.localShareStreamUuid).observe(
        ({ newValue, oldValue }) => {
          const { userUuid } = EduClassroomConfig.shared.sessionInfo;

          if (newValue && !oldValue) {
            this.classroomStore.widgetStore.setActive(
              `streamWindow-${newValue}`,
              {
                position: { xaxis: 1, yaxis: 1 },
                size: { width: 1, height: 1 },
                extra: {
                  userUuid,
                },
              },
              userUuid,
            );
          }
          if (!newValue && oldValue) {
            this.classroomStore.widgetStore.deleteWidget(`streamWindow-${oldValue}`);
          }
        },
      ),
    );
    this._disposers.push(
      computed(() => this.classroomStore.connectionStore.scene).observe(
        ({ newValue, oldValue }) => {
          if (oldValue) {
            this.shareScreenStateKeeperMap.get(oldValue.sceneId)?.stop();
          }
          if (newValue) {
            const stateKeeper = new ShareStreamStateKeeper(
              async (targetState: AgoraRteMediaSourceState) => {
                if (targetState === AgoraRteMediaSourceState.started) {
                  const enableAudio =
                    this.classroomStore.mediaStore.localScreenShareAudioTrackState ===
                    AgoraRteMediaSourceState.started;
                  //electron声卡采集合并到本地音频流,所以electron下屏幕共享流的audioPublishState设为Unpublished
                  const audioPublishState = !isElectron()
                    ? enableAudio
                      ? AgoraRteMediaPublishState.Published
                      : AgoraRteMediaPublishState.Unpublished
                    : AgoraRteMediaPublishState.Unpublished;

                  const { rtcToken, streamUuid }: { rtcToken: string; streamUuid: string } =
                    await this.classroomStore.streamStore.publishScreenShare(newValue, {
                      audioState: audioPublishState,
                      audioSourceState:
                        this.classroomStore.mediaStore.localScreenShareAudioTrackState,
                      audioSourceType: AgoraRteAudioSourceType.Loopback,
                    });
                  this.classroomStore.streamStore.initializeScreenShareStream(
                    newValue,
                    streamUuid,
                    rtcToken,
                  );
                } else if (
                  targetState === AgoraRteMediaSourceState.stopped ||
                  targetState === AgoraRteMediaSourceState.error
                ) {
                  await this.classroomStore.streamStore.unpublishScreenShare(newValue);
                  this.classroomStore.streamStore.destroyScreenShareStream(newValue);
                }
              },
            );
            this.shareScreenStateKeeperMap.set(newValue.sceneId, stateKeeper);
          }
        },
      ),
    );
  }
}
