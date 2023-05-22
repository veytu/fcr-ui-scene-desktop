import { isInvisible, isWeb } from '@onlineclass/utils/check';
import { builtInExtensions, getProcessorInitializer } from '@onlineclass/utils/rtc-extensions';
import {
  AgoraEduClassroomEvent,
  ClassroomState,
  DEVICE_DISABLE,
  EduClassroomConfig,
  EduEventCenter,
} from 'agora-edu-core';
import { action, computed, observable, reaction, runInAction } from 'mobx';
import { IAIDenoiserProcessor } from 'agora-extension-ai-denoiser';
import { IVirtualBackgroundProcessor } from 'agora-extension-virtual-background';
import { IBeautyProcessor } from 'agora-extension-beauty-effect';
import { EduUIStoreBase } from './base';
import { AgoraRteMediaSourceState, bound, Log } from 'agora-rte-sdk';
import { transI18n } from 'agora-common-libs/lib/i18n';
import { BeautyFilterOptions, VirtualBackgroundOptions } from '..';
import { fetchMediaFileByUrl } from '@onlineclass/utils';
import { getLaunchOptions } from '@onlineclass/utils/launch-options-holder';
import concat from 'lodash/concat';
import map from 'lodash/map';

/**
 * 设备设置
 */
/** @en
 *
 */
@Log.attach()
export class DeviceSettingUIStore extends EduUIStoreBase {
  private _virtualBackgroundProcessor?: IVirtualBackgroundProcessor;
  private _beautyEffectProcessor?: IBeautyProcessor;
  private _aiDenoiserProcessor?: IAIDenoiserProcessor;
  @observable
  private _virtualBackgroundOptions?: VirtualBackgroundOptions;
  @observable
  private _beautyOptions?: BeautyFilterOptions;
  @observable
  private _beautyType?: keyof BeautyFilterOptions;
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
  @observable
  private _localMirrorEnabled = false;
  @observable
  private _virtualBackgroundEnabled = false;
  @observable
  private _beautyFilterEnabled = false;
  @observable
  private _aiDenoiserEnabled = false;

  @computed
  get noCameraDevice() {
    return this.cameraDevicesList.length === 0;
  }

  get cameraDeviceId() {
    return this._cameraDeviceId;
  }
  @computed
  get noAudioRecordingDevice() {
    return this.recordingDevicesList.length === 0;
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

  get isLocalMirrorEnabled() {
    return this._localMirrorEnabled;
  }

  get isVirtualBackgroundEnabled() {
    return this._virtualBackgroundEnabled;
  }

  get isBeautyFilterEnabled() {
    return this._beautyFilterEnabled;
  }

  get activeBackgroundUrl() {
    return this._virtualBackgroundOptions?.url;
  }

  get activeBeautyType() {
    return this._beautyType;
  }

  get activeBeautyValue() {
    if (this._beautyOptions && this._beautyType) {
      return this._beautyOptions[this._beautyType];
    }
  }

  get beautySmoothValue() {
    return this._beautyOptions?.smooth;
  }

  get beautyBrighteningValue() {
    return this._beautyOptions?.brightening;
  }

  get beautyBlushValue() {
    return this._beautyOptions?.blush;
  }

  /**
   * 麦克风测试音量
   * @returns 音量 0 ~ 1
   */
  get localRecordingTestVolume(): number {
    return this.isAudioRecordingDeviceEnabled
      ? this.classroomStore.mediaStore.localMicAudioVolume
      : 0;
  }

  /**
   * 扬声器测试音量
   * @returns 音量 0 ~ 1
   */
  get localPlaybackTestVolume(): number {
    return this.isAudioPlaybackDeviceEnabled
      ? this.classroomStore.mediaStore.localPlaybackTestVolume
      : 0;
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

  get virtualBackgroundList() {
    const { virtualBackgroundImages, virtualBackgroundVideos } = getLaunchOptions();
    return concat<{ type: 'image' | 'video'; url: string }>(
      map(virtualBackgroundImages, (url) => ({ type: 'image', url })),
      map(virtualBackgroundVideos, (url) => ({ type: 'video', url })),
    );
  }

  /**
   * 开始扬声器测试
   * @param url
   */
  @bound
  startPlaybackDeviceTest(url: string) {
    this.classroomStore.mediaStore.startPlaybackDeviceTest(url);
  }

  /**
   * 停止扬声器测试
   */
  @bound
  stopPlaybackDeviceTest() {
    this.classroomStore.mediaStore.stopPlaybackDeviceTest();
  }

  /**
   * 开始麦克风测试
   */
  @bound
  startRecordingDeviceTest() {
    this.classroomStore.mediaStore.startRecordingDeviceTest(100);
  }

  /**
   * 停止麦克风测试
   */
  @bound
  stopRecordingDeviceTest() {
    this.classroomStore.mediaStore.stopRecordingDeviceTest();
  }

  /**
   *
   * @param options
   */
  /** @en
   *
   * @param options
   */
  @action.bound
  setVirtualBackground(options: VirtualBackgroundOptions) {
    this._virtualBackgroundEnabled = true;
    this._virtualBackgroundOptions = options;
  }

  /**
   *
   * @param type
   */
  /** @en
   *
   * @param type
   */
  @action.bound
  setBeautyType(type: keyof BeautyFilterOptions) {
    this._beautyFilterEnabled = true;
    this._beautyType = type;
  }
  /**
   *
   * @param options
   */
  /** @en
   *
   * @param options
   */
  @action.bound
  setBeautyFilter(options: Partial<BeautyFilterOptions>) {
    this._beautyOptions = {
      smooth: 0,
      brightening: 0,
      blush: 0,
      ...this._beautyOptions,
      ...options,
    };
  }

  @action.bound
  setCameraDevice(deviceId: string) {
    this._cameraDeviceId = deviceId;
    this.updateCameraTrack();
  }

  @bound
  toggleCameraDevice() {
    if (this.isCameraDeviceEnabled) {
      this.enableCamera(false);
    } else {
      this.enableCamera(true);
    }
  }
  @bound
  updateCameraTrack() {
    if (this.cameraDeviceId) {
      const track = this.classroomStore.mediaStore.mediaControl.createCameraVideoTrack();
      track.setDeviceId(this.cameraDeviceId);
      track.start();
      this._cameraDeviceEnabled = true;
    }
  }
  @action.bound
  enableCamera(value: boolean) {
    if (value === this._cameraDeviceEnabled) return;
    if (value) {
      this.updateCameraTrack();
    } else {
      const track = this.classroomStore.mediaStore.mediaControl.createCameraVideoTrack();
      track.stop();
      this._cameraDeviceEnabled = false;
    }
  }

  @action.bound
  setAudioRecordingDevice(deviceId: string) {
    this._audioRecordingDeviceId = deviceId;
    this.updateAudioRecordingTrack();
  }

  @bound
  toggleAudioRecordingDevice() {
    if (this.isAudioRecordingDeviceEnabled) {
      this.enableAudioRecording(false);
    } else {
      this.enableAudioRecording(true);
    }
  }

  @bound
  updateAudioRecordingTrack() {
    if (this.audioRecordingDeviceId) {
      const track = this.classroomStore.mediaStore.mediaControl.createMicrophoneAudioTrack();
      track.setRecordingDevice(this.audioRecordingDeviceId);
      track.start();
      this._audioRecordingDeviceEnabled = true;
    }
  }

  @action.bound
  enableAudioRecording(value: boolean) {
    if (value === this._audioRecordingDeviceEnabled) return;
    if (value) {
      this.updateAudioRecordingTrack();
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

  @action.bound
  toggleLocalMirror() {
    if (this._localMirrorEnabled) {
      this._localMirrorEnabled = false;
    } else {
      this._localMirrorEnabled = true;
    }
  }

  @bound
  setupLocalVideo(dom: HTMLElement, mirror: boolean) {
    this.classroomStore.mediaStore.setupLocalVideo(dom, mirror);
  }
  @bound
  getStream() {
    return this.classroomStore.mediaStore.mediaControl.createCameraVideoTrack();
  }

  @action.bound
  closeVirtualBackground() {
    this._virtualBackgroundEnabled = false;
  }

  @action.bound
  closeBeautyFilter() {
    this._beautyFilterEnabled = false;
  }

  @action.bound
  toggleAiDenoiser() {
    if (this._aiDenoiserEnabled) {
      this._aiDenoiserEnabled = false;
    } else {
      this._aiDenoiserEnabled = true;
    }
  }

  /**
   * @internal
   */
  /** @en
   * @internal
   */
  onInstall(): void {
    // set some default values
    runInAction(() => {
      if (this.virtualBackgroundList.length) {
        this._virtualBackgroundOptions = this.virtualBackgroundList[0];
      }
      this._beautyType = 'smooth';
      this._beautyOptions = { smooth: 0.5, brightening: 0.6, blush: 0.1 };
    });

    this._disposers.push(
      reaction(
        () => {
          return this.classroomStore.connectionStore.engine && isWeb() && !isInvisible();
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

    // 扬声器设备变更
    this._disposers.push(
      reaction(
        () => this.audioPlaybackDeviceId,
        () => {
          const { audioPlaybackDeviceId } = this;

          if (audioPlaybackDeviceId) {
            const track = this.classroomStore.mediaStore.mediaControl.createMicrophoneAudioTrack();
            this.logger.info('change playback device to', audioPlaybackDeviceId);
            track.setPlaybackDevice(audioPlaybackDeviceId);
          }
        },
      ),
    );

    this._disposers.push(
      reaction(
        () => ({
          enabled: this._virtualBackgroundEnabled,
          options: this._virtualBackgroundOptions,
        }),
        ({ enabled, options }) => {
          this.logger.info('enabled', enabled, 'options', options);
          if (enabled && options) {
            const { type } = options;

            fetchMediaFileByUrl(options).then((data) => {
              this._virtualBackgroundProcessor?.setOptions({
                type: type === 'image' ? 'img' : 'video',
                source: data,
              });
            });

            this._virtualBackgroundProcessor?.enable();
          } else {
            this._virtualBackgroundProcessor?.disable();
          }
        },
      ),
      reaction(
        () => ({ enabled: this._beautyFilterEnabled, options: this._beautyOptions }),
        ({ enabled, options }) => {
          this.logger.info('enabled', enabled, 'options', options);
          if (enabled && options) {
            this._beautyEffectProcessor?.setOptions({
              lighteningContrastLevel: 0,
              sharpnessLevel: 0,
              lighteningLevel: options.brightening,
              smoothnessLevel: options.smooth,
              rednessLevel: options.blush,
            });
            this._beautyEffectProcessor?.enable();
          } else {
            this._beautyEffectProcessor?.disable();
          }
        },
      ),
      reaction(
        () => this._aiDenoiserEnabled,
        (enabled) => {
          this.logger.info('enabled', enabled);
          if (enabled) {
            this._aiDenoiserProcessor?.enable();
          } else {
            this._aiDenoiserProcessor?.disable();
          }
        },
      ),
      reaction(
        () => {
          return {
            localMicTrackState: this.classroomStore.mediaStore.localMicTrackState,
            localCameraTrackState: this.classroomStore.mediaStore.localCameraTrackState,
          };
        },
        ({ localMicTrackState, localCameraTrackState }) => {
          runInAction(() => {
            this._cameraDeviceEnabled = localCameraTrackState === AgoraRteMediaSourceState.started;
            this._audioRecordingDeviceEnabled =
              localMicTrackState === AgoraRteMediaSourceState.started;
          });
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
    this._disposers = [];
  }
}
