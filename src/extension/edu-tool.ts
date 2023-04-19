import { AgoraWidgetController } from 'agora-edu-core';
import { Log, Logger } from 'agora-rte-sdk';
import { action, computed, IReactionDisposer, observable } from 'mobx';
import { AgoraExtensionRoomEvent, AgoraExtensionWidgetEvent } from './events';
import { SvgIconEnum } from '@components/svg-img';

@Log.attach({ proxyMethods: false })
export class EduTool {
  logger!: Logger;
  private _controller?: AgoraWidgetController;
  private _disposers: IReactionDisposer[] = [];
  @observable
  private _minimizedStateMap = new Map<string, { icon: SvgIconEnum }>();

  @computed
  get minimizedWidgetIcons() {
    return Array.from(this._minimizedStateMap.entries()).map(([widgetId, { icon }]) => ({
      icon,
      widgetId,
    }));
  }

  @action.bound
  private _handleMinimizedStateChange({
    minimized,
    widgetId,
    icon,
  }: {
    minimized: boolean;
    widgetId: string;
    icon: SvgIconEnum;
  }) {
    if (minimized) {
      this._minimizedStateMap.set(widgetId, { icon });
    } else {
      this._minimizedStateMap.delete(widgetId);
    }
  }

  setWidgetMinimized(minimized: boolean, widgetId: string) {
    this._sendBoardCommandMessage(AgoraExtensionRoomEvent.SetMinimize, { widgetId, minimized });
  }

  install(controller: AgoraWidgetController) {
    this._controller = controller;
    controller.addBroadcastListener({
      messageType: AgoraExtensionWidgetEvent.Minimize,
      onMessage: this._handleMinimizedStateChange,
    });
  }

  uninstall() {
    this._controller?.removeBroadcastListener({
      messageType: AgoraExtensionWidgetEvent.Minimize,
      onMessage: this._handleMinimizedStateChange,
    });

    this._disposers.forEach((d) => d());
    this._disposers = [];
  }

  private _sendBoardCommandMessage(event: AgoraExtensionRoomEvent, args?: unknown) {
    if (this._controller) {
      this._controller.broadcast(event, args);
    } else {
      this.logger.warn('Widget controller not ready, cannot broadcast message');
    }
  }
}
