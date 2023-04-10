import { EduUIStoreBase } from './base';
import { observable, computed, reaction, action } from 'mobx';
import { ShareStreamStateKeeper } from '@onlineclass/utils/stream/state-keeper';
import { ClassroomState, EduClassroomConfig, RecordMode } from 'agora-edu-core';
import {
  AgoraRteAudioSourceType,
  AgoraRteMediaPublishState,
  AgoraRteMediaSourceState,
  bound,
} from 'agora-rte-sdk';
import { isElectron } from '@onlineclass/utils/check';
import { getConfig } from '@onlineclass/utils/launch-options-holder';
export class ActionBarUIStore extends EduUIStoreBase {
  @computed get showEndClassButton() {
    return this.getters.isHost;
  }

  @computed get showToolBox() {
    return this.getters.isHost || this.getters.isGranted;
  }
  @computed get showWhiteBoard() {
    return this.getters.isHost || this.getters.isGranted;
  }
  @computed get showScreenShare() {
    return this.getters.isHost || this.getters.isGranted;
  }
  @computed get showRecord() {
    return this.getters.isHost;
  }
  @observable showLeaveOption = false;

  shareScreenStateKeeperMap: Map<string, ShareStreamStateKeeper> = new Map();

  @computed
  get isLocalScreenSharing() {
    return (
      this.classroomStore.mediaStore.localScreenShareTrackState === AgoraRteMediaSourceState.started
    );
  }
  @action.bound
  setShowLeaveOption(show: boolean) {
    this.showLeaveOption = show;
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

    const { language } = getConfig();

    const args = {
      webRecordConfig: {
        rootUrl: `${recordUrl}?language=${language}`,
        videoBitrate: 3000,
      },
      mode: RecordMode.Web,
      retryTimeout: recordRetryTimeout,
    };

    return args;
  }
  @bound
  startLocalScreenShare() {
    this.preCheckScreenShareStatus();
    if (this.classroomStore.mediaStore.isScreenDeviceEnumerateSupported()) {
      //electron
      //   this.selectScreenShareDevice();
    } else {
      //web
      this.classroomStore.mediaStore.startScreenShareCapture({ withAudio: true });
    }
  }
  preCheckScreenShareStatus() {
    if (!this.classroomStore.mediaStore.hasScreenSharePermission()) {
      //   this.shareUIStore.addToast(transI18n('toast2.screen_permission_denied'), 'warning');
    }
    if (this.isLocalScreenSharing) {
      this.stopLocalScreenShare();
    }
  }
  @bound
  stopLocalScreenShare() {
    this.classroomStore.mediaStore.stopScreenShareCapture();
  }
  @computed
  get screenShareStateAccessor() {
    return {
      trackState: this.classroomStore.mediaStore.localScreenShareTrackState,
      classroomState: this.classroomStore.connectionStore.classroomState,
    };
  }
  onDestroy(): void {}
  onInstall(): void {
    this._disposers.push(
      reaction(
        () => this.screenShareStateAccessor,
        (value) => {
          const { trackState, classroomState } = value;
          if (classroomState === ClassroomState.Connected) {
            //only set state when classroom is connected, the state will also be refreshed when classroom state become connected
            this.shareScreenStateKeeperMap
              .get(this.classroomStore.connectionStore.sceneId)
              ?.setShareScreenState(trackState);
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
                  const audioPublishState = !isElectron
                    ? enableAudio
                      ? AgoraRteMediaPublishState.Published
                      : AgoraRteMediaPublishState.Unpublished
                    : AgoraRteMediaPublishState.Unpublished;
                  const { rtcToken, streamUuid }: { rtcToken: string; streamUuid: string } =
                    await this.classroomStore.streamStore.publishScreenShare(newValue, {
                      audioState: audioPublishState,
                      audioSourceState:
                        this.classroomStore.mediaStore.localScreenShareAudioTrackState,
                      audioSourceType: AgoraRteAudioSourceType.ScreenShare,
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
