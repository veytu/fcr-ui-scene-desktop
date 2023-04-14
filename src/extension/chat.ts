import { AgoraWidgetController } from 'agora-edu-core';
import { IReactionDisposer } from 'mobx';
import { bound, Log, Logger } from 'agora-rte-sdk';
import { AgoraExtensionRoomEvent } from './events';
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
  @bound
  openChatDialog() {
    this._sendBoardCommandMessage(AgoraExtensionRoomEvent.OpenChatDialog);
  }
  install(controller: AgoraWidgetController) {
    this._controller = controller;
  }
  uninstall() {
    this._disposers.forEach((d) => d());
    this._disposers = [];
  }
}
