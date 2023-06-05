import { AgoraWidgetController } from 'agora-edu-core';
import { Log, Logger, bound } from 'agora-rte-sdk';
import { action, computed, IReactionDisposer, observable } from 'mobx';
import { AgoraExtensionRoomEvent, AgoraExtensionWidgetEvent } from './events';
import { SvgIconEnum } from '@components/svg-img';
import { computedFn } from 'mobx-utils';
@Log.attach({ proxyMethods: false })
export class EduTool {
  logger!: Logger;
  private _controller?: AgoraWidgetController;
  private _disposers: IReactionDisposer[] = [];
  @observable
  private _visibleStateMap = new Map<string, boolean>();
  @observable
  private _minimizedStateMap = new Map<string, { icon: SvgIconEnum; tooltip?: string }>();

  @computed
  get minimizedWidgetIcons() {
    return Array.from(this._minimizedStateMap.entries()).map(([widgetId, { icon, tooltip }]) => ({
      icon,
      widgetId,
      tooltip,
    }));
  }
  isWidgetVisible = computedFn((widgetId: string) => {
    return this._visibleStateMap.has(widgetId);
  });
  isWidgetMinimized = computedFn((widgetId: string) => {
    return this._minimizedStateMap.has(widgetId);
  });

  @action.bound
  private _handleMinimizedStateChange({
    minimized,
    widgetId,
    icon = SvgIconEnum.FCR_CLOSE,
    tooltip,
  }: {
    minimized: boolean;
    widgetId: string;
    icon?: SvgIconEnum;
    tooltip?: string;
  }) {
    if (minimized) {
      this._minimizedStateMap.set(widgetId, { icon, tooltip });
    } else {
      this._minimizedStateMap.delete(widgetId);
    }
    this._sendMessage(AgoraExtensionRoomEvent.SetMinimize, { widgetId, minimized });
  }
  @action.bound
  private _handleVisibleStateChange({ widgetId, visible }: { widgetId: string; visible: boolean }) {
    if (visible) {
      this._visibleStateMap.set(widgetId, visible);
    } else {
      this._visibleStateMap.delete(widgetId);
    }
  }

  @action.bound
  private _handleWidgetDestroy({ widgetId }: { widgetId: string }) {
    this._minimizedStateMap.delete(widgetId);
    this._visibleStateMap.delete(widgetId);
  }
  @bound
  setWidgetMinimized(minimized: boolean, widgetId: string) {
    this._handleMinimizedStateChange({ minimized, widgetId });
  }
  @bound
  setWidgetVisible(widgetId: string, visible: boolean) {
    this._handleVisibleStateChange({ widgetId, visible });
  }
  @bound
  sendWidgetVisible(widgetId: string, visible: boolean) {
    this._sendMessage(AgoraExtensionRoomEvent.VisibleChanged, { widgetId, visible });
  }
  install(controller: AgoraWidgetController) {
    this._controller = controller;
    controller.addBroadcastListener({
      messageType: AgoraExtensionWidgetEvent.Minimize,
      onMessage: this._handleMinimizedStateChange,
    });
    controller.addBroadcastListener({
      messageType: AgoraExtensionWidgetEvent.SetVisible,
      onMessage: this._handleVisibleStateChange,
    });
    controller.addBroadcastListener({
      messageType: AgoraExtensionWidgetEvent.WidgetDestroyed,
      onMessage: this._handleWidgetDestroy,
    });
  }

  uninstall() {
    this._controller?.removeBroadcastListener({
      messageType: AgoraExtensionWidgetEvent.Minimize,
      onMessage: this._handleMinimizedStateChange,
    });
    this._controller?.removeBroadcastListener({
      messageType: AgoraExtensionWidgetEvent.SetVisible,
      onMessage: this._handleVisibleStateChange,
    });
    this._controller?.removeBroadcastListener({
      messageType: AgoraExtensionWidgetEvent.WidgetDestroyed,
      onMessage: this._handleWidgetDestroy,
    });

    this._disposers.forEach((d) => d());
    this._disposers = [];
  }
  @bound
  private _sendMessage(event: AgoraExtensionRoomEvent, args?: unknown) {
    if (this._controller) {
      this._controller.broadcast(event, args);
    } else {
      this.logger.warn('Widget controller not ready, cannot broadcast message');
    }
  }
}
