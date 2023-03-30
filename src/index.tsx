import { render, unmountComponentAtNode } from 'react-dom';
import { ConvertMediaOptionsConfig, LaunchMediaOptions, LaunchOptions } from './type';
import { App } from './app';
import { Logger } from 'agora-common-libs';
import {
  EduClassroomConfig,
  EduMediaEncryptionMode,
  EduRegion,
  EduRoleTypeEnum,
} from 'agora-edu-core';
import { initializeBuiltInExtensions } from './utils/rtc-extensions';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { setLaunchOptions } from './utils/launch-options-holder';
dayjs.extend(duration);

export * from './type';

/**
 * Online class SDK
 */
export class AgoraOnlineclassSDK {
  /**
   * 支持下列参数配：
   *    host: API请求主机
   *    ignoreUrlRegionPrefix: 是否去掉API请求区域前缀
   *    logo: 品牌logo的url，会以图片展示在主界面左上角
   */
  /** @en
   * Support below configs:
   *    host: API request host
   *    ignoreUrlRegionPrefix: Whether to remove the API request area prefix
   *    logo: The logo url of your brand, which will show on the top left of the main view.
   */
  private static _config: Record<string, string> = {};
  /**
   *
   */
  /** @en
   *
   */
  static logo = '';
  static language = '';

  /**
   * 启动入口
   * @param dom
   * @param launchOption
   * @returns
   */
  /** @en
   * Entry point of AgoraOnlineclassSDK, which is used to create an online classroom app and render at the specified dom.
   * @param dom
   * @param launchOption
   * @returns
   */
  static launch(dom: HTMLElement, launchOptions: LaunchOptions) {
    const {
      appId,
      userUuid,
      userName,
      roleType,
      roomUuid,
      userFlexProperties,
      token,
      recordUrl,
      latencyLevel,
      region,
      mediaOptions,
      devicePretest,
      recordRetryTimeout,
      roomName,
      roomType,
      startTime,
      duration,
      language,
    } = launchOptions;

    Logger.info('[AgoraOnlineclassSDK]launched with options:', launchOptions);

    setLaunchOptions(launchOptions);

    const sessionInfo = {
      userUuid,
      userName,
      role: roleType,
      roomUuid,
      roomName,
      roomType,
      startTime,
      duration,
      flexProperties: userFlexProperties,
      token,
    };

    const { virtualBackgroundExtension, beautyEffectExtensionInstance, aiDenoiserInstance } =
      initializeBuiltInExtensions();

    const rteRegion = this._convertRegion(region);

    const noDevicePermission = sessionInfo.role === EduRoleTypeEnum.invisible;

    const rtcConfigs = {
      ...this._convertMediaOptions(mediaOptions),
      noDevicePermission,
    };

    const config = new EduClassroomConfig(appId, sessionInfo, recordUrl || '', {
      latencyLevel,
      region: rteRegion,
      rtcConfigs,
      rtcSDKExtensions: [
        virtualBackgroundExtension,
        beautyEffectExtensionInstance,
        aiDenoiserInstance,
      ],
    });
    config.host = this._config.host;
    this.language = language;

    EduClassroomConfig.setConfig(config);

    Logger.info(`[AgoraOnlineclassSDK]classroomConfig`, config);

    const startTs = Date.now();

    render(<App skipDevicePretest={!devicePretest} />, dom, () => {
      Logger.info(`[AgoraOnlineclassSDK]render complete in ${Date.now() - startTs}ms.`);
    });
    // return a disposer
    return () => {
      unmountComponentAtNode(dom);
      Logger.info(`[AgoraOnlineclassSDK]unmounted.`);
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
  static setParameters(params: string) {
    const { host, ignoreUrlRegionPrefix, logo } = JSON.parse(params) || {};

    if (host) {
      this._config.host = host;
    }

    if (ignoreUrlRegionPrefix) {
      this._config.ignoreUrlRegionPrefix = ignoreUrlRegionPrefix;
    }

    if (logo) {
      this._config.logo = logo;
    }
  }

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
