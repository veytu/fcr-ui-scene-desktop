import { render, unmountComponentAtNode } from 'react-dom';
import { Logger } from 'agora-rte-sdk';
import { LaunchOption } from './type';

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
}
