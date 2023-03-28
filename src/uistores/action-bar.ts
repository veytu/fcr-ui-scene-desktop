import { EduUIStoreBase } from './base';
import { action, computed, reaction } from 'mobx';
import { ShareStreamStateKeeper } from '@onlineclass/utils/stream/state-keeper';
import { ClassroomState } from 'agora-edu-core';
import {
  AgoraRteAudioSourceType,
  AgoraRteMediaPublishState,
  AgoraRteMediaSourceState,
  bound,
} from 'agora-rte-sdk';
import { isElectron } from '@onlineclass/utils';
export class ActionBarUIStore extends EduUIStoreBase {
  shareScreenStateKeeperMap: Map<string, ShareStreamStateKeeper> = new Map();

  @computed
  get isLocalScreenSharing() {
    return (
      this.classroomStore.mediaStore.localScreenShareTrackState === AgoraRteMediaSourceState.started
    );
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
