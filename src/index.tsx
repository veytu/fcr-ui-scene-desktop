import { render, unmountComponentAtNode } from 'react-dom';
import { ConvertMediaOptionsConfig, LaunchMediaOptions, LaunchOption } from './type';
import { App } from './app';
import { Logger } from 'agora-common-libs';
import {
  EduClassroomConfig,
  EduMediaEncryptionMode,
  EduRegion,
  EduRoleTypeEnum,
  Platform,
} from 'agora-edu-core';
import { initializeBuiltInExtensions } from './utils/rtc-extensions';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
/**
 * Online class SDK
 */
export class AgoraOnlineclassSDK {
  /**
   * Entry point of AgoraEduSDK, which is used to create an online classroom app and render at the specified dom.
   * @param dom
   * @param launchOption
   * @returns
   */
  /** @en
   *
   * @param dom
   * @param launchOption
   * @returns
   */
  static launch(dom: HTMLElement, launchOption: LaunchOption) {
    const {
      appId,
      userUuid,
      userName,
      roleType,
      roomUuid,
      roomName,
      roomType,
      duration,
      userFlexProperties,
      rtmToken,
      startTime,
      recordUrl,
      latencyLevel,
      region,
      mediaOptions,
      platform,
      pretest,
      recordRetryTimeout,
      sdkDomain,
    } = launchOption;
    const sessionInfo = {
      userUuid,
      userName,
      role: roleType,
      roomUuid,
      roomName,
      roomType,
      duration,
      flexProperties: userFlexProperties,
      token: rtmToken,
      startTime,
    };
    const { virtualBackgroundExtension, beautyEffectExtensionInstance, aiDenoiserInstance } =
      initializeBuiltInExtensions();
    const config = new EduClassroomConfig(
      appId,
      sessionInfo,
      recordUrl || '',
      {
        latencyLevel,
        region: this._convertRegion(region),
        rtcConfigs: {
          ...this._convertMediaOptions(mediaOptions),
          ...{
            noDevicePermission: roleType === EduRoleTypeEnum.invisible || platform === Platform.H5,
          },
        },
        rtcSDKExtensions: [
          virtualBackgroundExtension,
          beautyEffectExtensionInstance,
          aiDenoiserInstance,
        ],
      },
      platform,
      Object.assign(
        { openCameraDeviceAfterLaunch: pretest, openRecordingDeviceAfterLaunch: pretest },
        recordRetryTimeout ? { recordRetryTimeout } : {},
      ),
    );
    if (sdkDomain) {
      config.host = sdkDomain;
    }
    config.ignoreUrlRegionPrefix = ['dev', 'pre'].some((v) => config.host.includes(v));

    EduClassroomConfig.setConfig(config);

    Logger.info('[AgoraEduSDK]launched with options:', launchOption);

    const startTs = Date.now();

    render(<App />, dom, () => {
      Logger.info(`[AgoraEduSDK]render complete in ${Date.now() - startTs}ms.`);
    });
    // return a disposer
    return () => {
      unmountComponentAtNode(dom);
      Logger.info(`[AgoraEduSDK]unmounted.`);
    };
  }

  /**
   * 设置参数
   * @param params
   */
  /** @en
   *
   * @param params
   */
  static setParameters(params: string) {}
  private static _convertRegion(region: string): EduRegion {
    switch (region.toUpperCase()) {
      case 'CN':
        return EduRegion.CN;
      case 'AS':
        return EduRegion.AP;
      case 'EU':
        return EduRegion.EU;
      case 'NA':
        return EduRegion.NA;
    }
    return region as EduRegion;
  }
  private static _convertMediaOptions(opts?: LaunchMediaOptions): ConvertMediaOptionsConfig {
    const config: ConvertMediaOptionsConfig = {};
    if (opts) {
      const {
        cameraEncoderConfiguration,
        screenShareEncoderConfiguration,
        encryptionConfig,
        lowStreamCameraEncoderConfiguration,
        channelProfile,
        web,
      } = opts;
      if (cameraEncoderConfiguration) {
        config.defaultCameraEncoderConfigurations = {
          ...cameraEncoderConfiguration,
        };
      }
      if (screenShareEncoderConfiguration) {
        config.defaultScreenEncoderConfigurations = {
          ...screenShareEncoderConfiguration,
        };
      }
      if (encryptionConfig) {
        config.encryption = {
          mode: encryptionConfig.mode as unknown as EduMediaEncryptionMode,
          key: encryptionConfig.key,
        };
      }
      if (lowStreamCameraEncoderConfiguration) {
        config.defaultLowStreamCameraEncoderConfigurations = {
          ...lowStreamCameraEncoderConfiguration,
        };
      }
      if (typeof channelProfile !== 'undefined') {
        config.channelProfile = channelProfile;
      }
      if (web) {
        config.web = web;
      }
    }
    return config;
  }
}
