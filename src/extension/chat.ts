import { AgoraWidgetController } from 'agora-edu-core';
import { IReactionDisposer, observable } from 'mobx';
import { bound, Log, Logger } from 'agora-rte-sdk';
import { AgoraExtensionRoomEvent, AgoraExtensionWidgetEvent } from './events';
@Log.attach({ proxyMethods: false })
export class Chat {
  logger!: Logger;
  private _controller?: AgoraWidgetController;
  private _disposers: IReactionDisposer[] = [];
  private _sendBoardCommandMessage(event: AgoraExtensionRoomEvent, args?: unknown) {
    if (this._controller) {
      this._controller.broadcast(event, args);
    } else {
      this.logger.warn('Widget controller not ready, cannot broadcast message');
    }
  }
  @observable chatDialogVisible = false;
  @bound
  _handleChatDialogVisibleChanged(visible: boolean) {
    this.chatDialogVisible = visible;
  }
  @bound
  openChatDialog() {
    this._sendBoardCommandMessage(AgoraExtensionRoomEvent.OpenChatDialog);
  }
  @bound
  closeChatDialog() {
    this._sendBoardCommandMessage(AgoraExtensionRoomEvent.CloseChatDialog);
  }
  install(controller: AgoraWidgetController) {
    this._controller = controller;
    controller.addBroadcastListener({
      messageType: AgoraExtensionWidgetEvent.ChatDialogVisibleChanged,
      onMessage: this._handleChatDialogVisibleChanged,
    });
  }
  uninstall() {
    this._disposers.forEach((d) => d());
    this._disposers = [];
    this._controller?.removeBroadcastListener({
      messageType: AgoraExtensionWidgetEvent.ChatDialogVisibleChanged,
      onMessage: this._handleChatDialogVisibleChanged,
    });
  }
}
