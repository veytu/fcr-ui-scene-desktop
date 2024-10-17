import { EduUIStoreBase } from './base';
import { observable, action, computed, reaction, runInAction } from 'mobx';
import { Log } from 'agora-common-libs';
import { bound, Lodash, Scheduler } from 'agora-rte-sdk';
import { ConfirmDialogProps } from '@components/dialog/confirm-dialog';
import { ClassDialogProps } from '@components/dialog/class-dialog';
import { v4 as uuidv4 } from 'uuid';
import { AgoraExtensionRoomEvent } from '@ui-scene/extension/events';
import { CommonDialogType, DialogType, Layout } from '@ui-scene/uistores/type';

@Log.attach({ proxyMethods: false })
export class LayoutUIStore extends EduUIStoreBase {
  private _hasPopoverShowed = false;
  @observable layout: Layout = Layout.Grid;
  @action.bound
  setLayout(layout: Layout) {
    this.layout = layout;
  }
  @observable dialogMap: Map<string, { type: DialogType }> = new Map();

  hasDialogOf(type: DialogType) {
    let exist = false;
    this.dialogMap.forEach(({ type: dialogType }) => {
      if (dialogType === type) {
        exist = true;
      }
    });

    return exist;
  }
  isDialogIdExist(id: string) {
    return this.dialogMap.has(id);
  }
  addDialog(type: 'confirm', params: CommonDialogType<ConfirmDialogProps>): void;
  addDialog(type: 'participants'): void;
  addDialog(type: 'class-info', params: CommonDialogType<ClassDialogProps>): void;

  @action.bound
  addDialog(type: unknown, params?: CommonDialogType<unknown>) {
    this.dialogMap.set(params?.id || uuidv4(), { ...(params as any), type: type as DialogType });
  }

  @action.bound
  deleteDialog = (id: string) => {
    this.dialogMap.delete(id);
  };

  @bound
  setHasPopoverShowed(has: boolean) {
    this._hasPopoverShowed = has;
  }
  onDestroy(): void {
    this._disposers.forEach((d) => d());
    this._disposers = [];
  }
  onInstall(): void {
    this._disposers.push(
      reaction(
        () => this.layout,
        (layout) => {
          this.classroomStore.widgetStore.widgetController?.broadcast(
            AgoraExtensionRoomEvent.LayoutChanged,
            layout,
          );
        },
      ),
    );
  }
}
