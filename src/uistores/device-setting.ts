import { isElectron, isInvisible, isWeb } from '@onlineclass/utils/check';
import { builtInExtensions, getProcessorInitializer } from '@onlineclass/utils/rtc-extensions';
import {
  AgoraEduClassroomEvent,
  ClassroomState,
  DEVICE_DISABLE,
  EduClassroomConfig,
  EduEventCenter,
} from 'agora-edu-core';
import { action, computed, observable, reaction } from 'mobx';
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
  private _virtualBackgroundProcessor?: IVirtualBackgroundProcessor;
  private _beautyEffectProcessor?: IBeautyProcessor;
  private _aiDenoiserProcessor?: IAIDenoiserProcessor;
  @observable
  private _virtualBackgroundId?: string;
  @observable
  private _cameraDeviceId?: string;
  @observable
  private _audioRecordingDeviceId?: string;
  @observable
  private _audioPlaybackDeviceId?: string;
  @observable
  private _cameraDeviceEnabled = false;
  @observable
  private _audioRecordingDeviceEnabled = false;
  @observable
  private _audioPlaybackDeviceEnabled = true;

  get cameraDeviceId() {
    return this._cameraDeviceId;
  }

  get audioRecordingDeviceId() {
    return this._audioRecordingDeviceId;
  }

  get audioPlaybackDeviceId() {
    return this._audioPlaybackDeviceId;
  }

  get isCameraDeviceEnabled() {
    return this._cameraDeviceEnabled;
  }

  get isAudioRecordingDeviceEnabled() {
    return this._audioRecordingDeviceEnabled;
  }

  get isAudioPlaybackDeviceEnabled() {
    return this._audioPlaybackDeviceEnabled;
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
      cameraDeviceId: this._cameraDeviceId,
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
      recordingDeviceId: this._audioRecordingDeviceId,
      localMicStreamUuid: this.classroomStore.streamStore.localMicStreamUuid,
    };
  }

  @bound
  setVirtualBackground(backgroundId: string) {}

  @bound
  setBeautyFilter() {}

  @action.bound
  setCameraDevice(deviceId: string) {
    this._cameraDeviceId = deviceId;
  }

  @bound
  toggleCameraDevice() {
    if (this.isCameraDeviceEnabled) {
      this.enableCamera(false);
    } else {
      this.enableCamera(true);
    }
  }

  @action.bound
  enableCamera(value: boolean) {
    if (value) {
      if (this.cameraDeviceId) {
        const track = this.classroomStore.mediaStore.mediaControl.createCameraVideoTrack();
        track.setDeviceId(this.cameraDeviceId);
        track.start();
        this._cameraDeviceEnabled = true;
      }
    } else {
      const track = this.classroomStore.mediaStore.mediaControl.createCameraVideoTrack();
      track.stop();
      this._cameraDeviceEnabled = false;
    }
  }

  @action.bound
  setAudioRecordingDevice(deviceId: string) {
    this._audioRecordingDeviceId = deviceId;
  }

  @bound
  toggleAudioRecordingDevice() {
    if (this.isAudioRecordingDeviceEnabled) {
      this.enableAudioRecording(false);
    } else {
      this.enableAudioRecording(true);
    }
  }

  @action.bound
  enableAudioRecording(value: boolean) {
    if (value) {
      if (this.audioRecordingDeviceId) {
        const track = this.classroomStore.mediaStore.mediaControl.createMicrophoneAudioTrack();
        track.setRecordingDevice(this.audioRecordingDeviceId);
        track.start();
        this._audioRecordingDeviceEnabled = true;
      }
    } else {
      const track = this.classroomStore.mediaStore.mediaControl.createMicrophoneAudioTrack();
      track.stop();
      this._audioRecordingDeviceEnabled = false;
    }
  }

  @action.bound
  setAudioPlaybackDevice(deviceId: string) {
    this._audioPlaybackDeviceId = deviceId;
  }

  @bound
  toggleAudioPlaybackDevice() {
    if (this._audioPlaybackDeviceEnabled) {
      this.enableAudioPlayback(false);
    } else {
      this.enableAudioPlayback(true);
    }
  }

  @action.bound
  enableAudioPlayback(value: boolean) {
    if (value) {
      if (this.audioPlaybackDeviceId) {
        this.classroomStore.mediaStore.enableLocalPlayback(value);
        this._audioPlaybackDeviceEnabled = true;
      }
    } else {
      this.classroomStore.mediaStore.enableLocalPlayback(value);
      this._audioPlaybackDeviceEnabled = false;
    }
  }

  @bound
  setupLocalVideo(dom: HTMLElement, mirror: boolean) {
    this.classroomStore.mediaStore.setupLocalVideo(dom, mirror);
  }
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

    // 处理视频设备列表变更
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
          if (inOldList && !inNewList) {
            //change to first device if there's any
            newValue.length > 0 && this.setCameraDevice(newValue[0].deviceid);

            if (inOldList && !inNewList) {
              EduEventCenter.shared.emitClasroomEvents(AgoraEduClassroomEvent.CurrentCamUnplugged);
            }
          }
        } else {
          if (EduClassroomConfig.shared.openCameraDeviceAfterLaunch) {
            let deviceId = null;
            if (newValue.length > 0 && (deviceId = newValue[0].deviceid) !== DEVICE_DISABLE) {
              // initailize, pick the first device
              this.setCameraDevice(deviceId);
            }
          }
        }
      },
    );

    this._disposers.push(videoDisposer);

    // 处理录音设备列表变更
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
        if (inOldList && !inNewList) {
          //change to first device if there's any
          newValue.length > 0 && this.setAudioRecordingDevice(newValue[0].deviceid);
          if (inOldList && !inNewList) {
            EduEventCenter.shared.emitClasroomEvents(AgoraEduClassroomEvent.CurrentMicUnplugged);
          }
        }
      } else {
        if (EduClassroomConfig.shared.openRecordingDeviceAfterLaunch) {
          let deviceId = null;
          if (newValue.length > 0 && (deviceId = newValue[0].deviceid) !== DEVICE_DISABLE) {
            // initailize, pick the first device
            this.setAudioRecordingDevice(deviceId);
          }
        }
      }
    });

    this._disposers.push(audioRecordingDisposer);
    // 处理扬声器设备列表变更
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
          newValue.length > 0 && this.setAudioPlaybackDevice(newValue[0].deviceid);
          if (inOldList && !inNewList) {
            EduEventCenter.shared.emitClasroomEvents(
              AgoraEduClassroomEvent.CurrentSpeakerUnplugged,
            );
          }
        }
      } else {
        let deviceId = null;
        if (newValue.length > 0 && (deviceId = newValue[0].deviceid) !== DEVICE_DISABLE) {
          // initailize, pick the first device
          this.setAudioPlaybackDevice(deviceId);
        } else {
          this.setAudioPlaybackDevice('default');
        }
      }
    });

    this._disposers.push(playbackDisposer);
    // 摄像头设备变更
    this._disposers.push(
      reaction(
        () => this.cameraAccessors,
        () => {
          const { cameraDeviceId } = this;
          if (this.classroomStore.connectionStore.classroomState === ClassroomState.Idle) {
            // if idle, e.g. pretest
            if (cameraDeviceId) {
              this.logger.info('enableLocalVideo => true in device pretest');
              this.enableCamera(true);
            } else {
              this.logger.info('enableLocalVideo => false in device pretest');
              //if no device selected, disable device
              this.enableCamera(false);
            }
          } else if (
            this.classroomStore.connectionStore.classroomState === ClassroomState.Connected
          ) {
            // once connected, should follow stream
            if (!this.classroomStore.streamStore.localCameraStreamUuid) {
              this.logger.info('enableLocalVideo => false. Reason: no local camera stream found.');
              // if no local stream
              this.enableCamera(false);
            } else {
              if (cameraDeviceId) {
                this.logger.info('enableLocalVideo => true. Reason: camera device selected');
                this.enableCamera(true);
              } else {
                this.logger.info('enableLocalVideo => false. Reason: camera device not selected');
                this.enableCamera(false);
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
          const { audioRecordingDeviceId } = this;
          if (this.classroomStore.connectionStore.classroomState === ClassroomState.Idle) {
            // if idle, e.g. pretest
            if (audioRecordingDeviceId) {
              this.logger.info('enableLocalAudio => true in device pretest');
              this.enableAudioRecording(true);
            } else {
              this.logger.info('enableLocalAudio => false in device pretest');
              //if no device selected, disable device
              this.enableAudioRecording(false);
            }
          } else if (
            this.classroomStore.connectionStore.classroomState === ClassroomState.Connected
          ) {
            // once connected, should follow stream
            if (!this.classroomStore.streamStore.localMicStreamUuid) {
              this.logger.info('enableLocalAudio => false. Reason: no local mic stream found.');
              // if no local stream
              this.enableAudioRecording(false);
            } else {
              if (audioRecordingDeviceId) {
                this.logger.info('enableLocalAudio => true. Reason: mic device selected');
                this.enableAudioRecording(true);
              } else {
                this.logger.info('enableLocalAudio => false. Reason: mic device not selected');
                this.enableAudioRecording(false);
              }
            }
          }
        },
      ),
    );

    // not implemented in browser
    if (isElectron()) {
      // 麦克风设备变更
      this._disposers.push(
        reaction(
          () => this.audioPlaybackDeviceId,
          () => {
            const { audioPlaybackDeviceId } = this;

            if (audioPlaybackDeviceId) {
              const track =
                this.classroomStore.mediaStore.mediaControl.createMicrophoneAudioTrack();
              this.logger.info('change playback device to', audioPlaybackDeviceId);
              track.setPlaybackDevice(audioPlaybackDeviceId);
            }
          },
        ),
      );
    }
  }

  /**
   * @internal
   */
  /** @en
   * @internal
   */
  onDestroy(): void {
    this._disposers.forEach((d) => d());
    this._disposers = [];
  }
}
