import { isInvisible } from '@onlineclass/utils';
import { builtInExtensions, getProcessorInitializer } from '@onlineclass/utils/rtc-extensions';
import { EduRteEngineConfig } from 'agora-edu-core';
import { observable, reaction, IReactionDisposer } from 'mobx';
import { IAIDenoiserProcessor } from 'agora-extension-ai-denoiser';
import { IVirtualBackgroundProcessor } from 'agora-extension-virtual-background';
import { IBeautyProcessor } from 'agora-extension-beauty-effect';
import { isWeb } from '..';
import { EduUIStoreBase } from './base';
import { Log } from 'agora-rte-sdk';

/**
 * 设备设置
 */
/** @en
 *
 */
@Log.attach({ proxyMethods: false })
export class DeviceSettingUIStore extends EduUIStoreBase {
  private _disposers: IReactionDisposer[] = [];
  @observable
  virtualBackgroundId?: string;

  private _virtualBackgroundProcessor?: IVirtualBackgroundProcessor;
  private _beautyEffectProcessor?: IBeautyProcessor;
  private _aiDenoiserProcessor?: IAIDenoiserProcessor;

  setVirtualBackground(backgroundId: string) {}

  setBeautyFilter() {}

  setCamera() {}

  setMicrophone() {}

  setSpeaker() {}

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
        () => this.classroomStore.connectionStore.engine && isWeb() && isInvisible(),
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

    this._disposers.push(
      reaction(
        () => {
          return this.classroomStore.mediaStore.videoCameraDevices;
        },
        (videoCameraDevices) => {
          this.logger.info('videoCameraDevices', videoCameraDevices);
        },
      ),
    );

    // this.classroomStore.mediaStore.enableLocalVideo(true);
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
