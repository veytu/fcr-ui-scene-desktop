import { isInvisible, isWeb } from '@onlineclass/utils';
import { builtInExtensions, getProcessorInitializer } from '@onlineclass/utils/rtc-extensions';
import {
  AgoraEduClassroomEvent,
  ClassroomState,
  DEVICE_DISABLE,
  EduClassroomConfig,
  EduEventCenter,
  EduRteEngineConfig,
} from 'agora-edu-core';
import { computed, observable, reaction } from 'mobx';
import { IAIDenoiserProcessor } from 'agora-extension-ai-denoiser';
import { IVirtualBackgroundProcessor } from 'agora-extension-virtual-background';
import { IBeautyProcessor } from 'agora-extension-beauty-effect';
import { EduUIStoreBase } from './base';
import { bound, Log } from 'agora-rte-sdk';
import { transI18n } from 'agora-common-libs';

/**
 * 设备设置
 */
/** @en
 *
 */
@Log.attach({ proxyMethods: false })
export class DeviceSettingUIStore extends EduUIStoreBase {
  @observable
  virtualBackgroundId?: string;

  private _virtualBackgroundProcessor?: IVirtualBackgroundProcessor;
  private _beautyEffectProcessor?: IBeautyProcessor;
  private _aiDenoiserProcessor?: IAIDenoiserProcessor;

  get cameraDeviceId() {
    return this.classroomStore.mediaStore.cameraDeviceId;
  }

  get recordingDeviceId() {
    return this.classroomStore.mediaStore.recordingDeviceId;
  }

  get playbackDeviceId() {
    return this.classroomStore.mediaStore.playbackDeviceId;
  }

  /**
   * 摄像头设备列表
   * @returns
   */
  /** @en
   *
   */
  @computed
  get cameraDevicesList() {
    return this.classroomStore.mediaStore.videoCameraDevices
      .filter(({ deviceid }) => deviceid !== DEVICE_DISABLE)
      .map((item) => ({
        text: item.deviceid === DEVICE_DISABLE ? transI18n('disabled') : item.devicename,
        value: item.deviceid,
      }));
  }

  /**
   * 麦克风设备列表
   * @returns
   */
  /** @en
   *
   */
  @computed
  get recordingDevicesList() {
    return this.classroomStore.mediaStore.audioRecordingDevices
      .filter(({ deviceid }) => deviceid !== DEVICE_DISABLE)
      .map((item) => ({
        text: item.deviceid === DEVICE_DISABLE ? transI18n('disabled') : item.devicename,
        value: item.deviceid,
      }));
  }

  /**
   * 扬声器设备列表
   * @returns
   */
  /** @en
   *
   */
  @computed
  get playbackDevicesList() {
    const playbackDevicesList = this.classroomStore.mediaStore.audioPlaybackDevices
      .filter(({ deviceid }) => deviceid !== DEVICE_DISABLE)
      .map((item) => ({
        text: item.devicename,
        value: item.deviceid,
      }));
    return playbackDevicesList.length
      ? playbackDevicesList
      : [
          {
            text: transI18n(`media.default`),
            value: 'default',
          },
        ];
  }

  /**
   * 获取视频设备信息
   **/
  /** @en
   * get camera accessors
   */
  @computed
  get cameraAccessors() {
    return {
      classroomState: this.classroomStore.connectionStore.classroomState,
      cameraDeviceId: this.classroomStore.mediaStore.cameraDeviceId,
      localCameraStreamUuid: this.classroomStore.streamStore.localCameraStreamUuid,
    };
  }

  /**
   * 音频设备信息
   **/
  /** @en
   * mic Accessors
   */
  @computed
  get micAccessors() {
    return {
      classroomState: this.classroomStore.connectionStore.classroomState,
      recordingDeviceId: this.classroomStore.mediaStore.recordingDeviceId,
      localMicStreamUuid: this.classroomStore.streamStore.localMicStreamUuid,
    };
  }

  @bound
  setVirtualBackground(backgroundId: string) {}

  @bound
  setBeautyFilter() {}

  @bound
  setCameraDevice(deviceId: string) {
    this.classroomStore.mediaStore.setCameraDevice(deviceId);
  }

  @bound
  setRecordingDevice(deviceId: string) {
    this.classroomStore.mediaStore.setRecordingDevice(deviceId);
  }

  @bound
  setPlaybackDevice(deviceId: string) {
    this.classroomStore.mediaStore.setPlaybackDevice(deviceId);
  }

  @bound
  setupLocalVideo(dom: HTMLElement, mirror: boolean) {
    this.classroomStore.mediaStore.setupLocalVideo(dom, mirror);
  }

  private _enableLocalVideo = (value: boolean) => {
    const track = this.classroomStore.mediaStore.mediaControl.createCameraVideoTrack();
    if (value) {
      track.start();
    } else {
      track.stop();
    }
    return;
  };

  private _enableLocalAudio = (value: boolean) => {
    const track = this.classroomStore.mediaStore.mediaControl.createMicrophoneAudioTrack();
    if (value) {
      track.start();
    } else {
      track.stop();
    }
  };

  /**
   * @internal
   */
  /** @en
   * @internal
   */
  onInstall(): void {
    this._disposers.push(
      reaction(
        () => {
          return this.classroomStore.connectionStore.engine && isWeb() && isInvisible();
        },
        (processorsRequired) => {
          debugger;
          if (processorsRequired) {
            getProcessorInitializer<IVirtualBackgroundProcessor>(
              builtInExtensions.virtualBackgroundExtension,
            )
              .createProcessor()
              .then((processor) => {
                this.logger.info('VirtualBackgroundProcessor initialized');
                this._virtualBackgroundProcessor = processor;
                this.classroomStore.mediaStore.addCameraProcessors([processor]);
              });

            getProcessorInitializer<IBeautyProcessor>(builtInExtensions.beautyEffectExtension)
              .createProcessor()
              .then((processor) => {
                this.logger.info('BeautyEffectProcessor initialized');
                this._beautyEffectProcessor = processor;
                this.classroomStore.mediaStore.addCameraProcessors([processor]);
              });

            getProcessorInitializer<IAIDenoiserProcessor>(builtInExtensions.aiDenoiserExtension)
              .createProcessor()
              .then((processor) => {
                this.logger.info('AiDenoiserProcessor initialized');
                this._aiDenoiserProcessor = processor;
                this.classroomStore.mediaStore.addMicrophoneProcessors([processor]);
              });
          }
        },
      ),
    );

    // 处理视频设备变动
    const videoDisposer = computed(() => this.classroomStore.mediaStore.videoCameraDevices).observe(
      ({ newValue, oldValue }) => {
        /**
         * 触发设备变更事件
         */
        const { cameraDeviceId } = this.classroomStore.mediaStore;
        if (oldValue && oldValue.length > 1) {
          if (newValue.length > oldValue.length) {
            // this.addToast({
            //   type: 'video',
            //   info: DeviceStateChangedReason.newDeviceDetected,
            // });
          }
          const inOldList = oldValue.find((v) => v.deviceid === cameraDeviceId);
          const inNewList = newValue.find((v) => v.deviceid === cameraDeviceId);
          if ((inOldList && !inNewList) || cameraDeviceId === DEVICE_DISABLE) {
            //change to first device if there's any
            newValue.length > 0 &&
              this.classroomStore.mediaStore.setCameraDevice(newValue[0].deviceid);
            if (inOldList && !inNewList) {
              EduEventCenter.shared.emitClasroomEvents(AgoraEduClassroomEvent.CurrentCamUnplugged);
            }
          }
        } else {
          if (EduClassroomConfig.shared.openCameraDeviceAfterLaunch) {
            // initailize, pick the first device
            newValue.length > 0 &&
              this.classroomStore.mediaStore.setCameraDevice(newValue[0].deviceid);
          } else {
            this.classroomStore.mediaStore.setCameraDevice(DEVICE_DISABLE);
          }
        }
      },
    );

    this._disposers.push(videoDisposer);

    // 处理录音设备变动
    const audioRecordingDisposer = computed(
      () => this.classroomStore.mediaStore.audioRecordingDevices,
    ).observe(({ newValue, oldValue }) => {
      const { recordingDeviceId } = this.classroomStore.mediaStore;
      // 避免初始化阶段触发新设备的弹窗通知
      if (oldValue && oldValue.length > 1) {
        if (newValue.length > oldValue.length) {
          // this.addToast({
          //   type: 'audio_recording',
          //   info: DeviceStateChangedReason.newDeviceDetected,
          // });
        }
        const inOldList = oldValue.find((v) => v.deviceid === recordingDeviceId);
        const inNewList = newValue.find((v) => v.deviceid === recordingDeviceId);
        if ((inOldList && !inNewList) || recordingDeviceId === DEVICE_DISABLE) {
          //change to first device if there's any
          newValue.length > 0 &&
            this.classroomStore.mediaStore.setRecordingDevice(newValue[0].deviceid);
          if (inOldList && !inNewList) {
            EduEventCenter.shared.emitClasroomEvents(AgoraEduClassroomEvent.CurrentMicUnplugged);
          }
        }
      } else {
        if (EduClassroomConfig.shared.openRecordingDeviceAfterLaunch) {
          // initailize, pick the first device
          newValue.length > 0 &&
            this.classroomStore.mediaStore.setRecordingDevice(newValue[0].deviceid);
        } else {
          this.classroomStore.mediaStore.setRecordingDevice(DEVICE_DISABLE);
        }
      }
    });

    this._disposers.push(audioRecordingDisposer);
    // 处理扬声器设备变动
    const playbackDisposer = computed(
      () => this.classroomStore.mediaStore.audioPlaybackDevices,
    ).observe(({ newValue, oldValue }) => {
      const { playbackDeviceId } = this.classroomStore.mediaStore;
      // 避免初始化阶段触发新设备的弹窗通知
      if (oldValue && oldValue.length > 0) {
        if (newValue.length > oldValue.length) {
          // this.addToast({
          //   type: 'audio_playback',
          //   info: DeviceStateChangedReason.newDeviceDetected,
          // });
        }
        const inOldList = oldValue.find((v) => v.deviceid === playbackDeviceId);
        const inNewList = newValue.find((v) => v.deviceid === playbackDeviceId);
        if (inOldList && !inNewList) {
          //change to first device if there's any
          newValue.length > 0 &&
            this.classroomStore.mediaStore.setPlaybackDevice(newValue[0].deviceid);
          if (inOldList && !inNewList) {
            EduEventCenter.shared.emitClasroomEvents(
              AgoraEduClassroomEvent.CurrentSpeakerUnplugged,
            );
          }
        }
      } else {
        // initailize, pick the first device
        newValue.length > 0 &&
          this.classroomStore.mediaStore.setPlaybackDevice(newValue[0].deviceid);
      }
    });

    this._disposers.push(playbackDisposer);
    // 摄像头设备变更
    this._disposers.push(
      reaction(
        () => this.cameraAccessors,
        () => {
          const { cameraDeviceId, mediaControl } = this.classroomStore.mediaStore;
          if (this.classroomStore.connectionStore.classroomState === ClassroomState.Idle) {
            // if idle, e.g. pretest
            if (cameraDeviceId && cameraDeviceId !== DEVICE_DISABLE) {
              const track = mediaControl.createCameraVideoTrack();
              track.setDeviceId(cameraDeviceId);
              this._enableLocalVideo(true);
            } else {
              //if no device selected, disable device
              this._enableLocalVideo(false);
            }
          } else if (
            this.classroomStore.connectionStore.classroomState === ClassroomState.Connected
          ) {
            // once connected, should follow stream
            if (!this.classroomStore.streamStore.localCameraStreamUuid) {
              this.logger.info('enableLocalVideo => false. Reason: no local camera stream found.');
              // if no local stream
              this._enableLocalVideo(false);
            } else {
              if (cameraDeviceId && cameraDeviceId !== DEVICE_DISABLE) {
                const track = mediaControl.createCameraVideoTrack();
                track.setDeviceId(cameraDeviceId);
                this.logger.info('enableLocalVideo => true. Reason: camera device selected');
                this._enableLocalVideo(true);
              } else {
                this.logger.info('enableLocalVideo => false. Reason: camera device not selected');
                this._enableLocalVideo(false);
              }
            }
          }
        },
      ),
    );
    // 麦克风设备变更
    this._disposers.push(
      reaction(
        () => this.micAccessors,
        () => {
          const { recordingDeviceId, mediaControl } = this.classroomStore.mediaStore;
          if (this.classroomStore.connectionStore.classroomState === ClassroomState.Idle) {
            // if idle, e.g. pretest
            if (recordingDeviceId && recordingDeviceId !== DEVICE_DISABLE) {
              const track = mediaControl.createMicrophoneAudioTrack();
              track.setRecordingDevice(recordingDeviceId);
              this._enableLocalAudio(true);
            } else {
              //if no device selected, disable device
              this._enableLocalAudio(false);
            }
          } else if (
            this.classroomStore.connectionStore.classroomState === ClassroomState.Connected
          ) {
            // once connected, should follow stream
            if (!this.classroomStore.streamStore.localMicStreamUuid) {
              this.logger.info('enableLocalAudio => false. Reason: no local mic stream found.');
              // if no local stream
              this._enableLocalAudio(false);
            } else {
              if (recordingDeviceId && recordingDeviceId !== DEVICE_DISABLE) {
                const track = mediaControl.createMicrophoneAudioTrack();
                track.setRecordingDevice(recordingDeviceId);
                this.logger.info('enableLocalAudio => true. Reason: mic device selected');
                this._enableLocalAudio(true);
              } else {
                this.logger.info('enableLocalAudio => false. Reason: mic device not selected');
                this._enableLocalAudio(false);
              }
            }
          }
        },
      ),
    );
  }

  /**
   * @internal
   */
  /** @en
   * @internal
   */
  onDestroy(): void {
    this._disposers.forEach((d) => d());
  }
}
