import { EduUIStoreBase } from './base';
import { observable, action } from 'mobx';
import { DialogType, Layout } from './type';
import { bound, Scheduler } from 'agora-rte-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmDialogProps } from '@onlineclass/components/dialog/confirm-dialog';

export class LayoutUIStore extends EduUIStoreBase {
  private _clearScreenTask: Scheduler.Task | null = null;
  private _clearScreenDelay = 3000;
  private _isPointingBar = false;
  private _hasPopoverShowed = false;

  @observable showStatusBar = true;
  @observable showActiobBar = true;
  @observable layout: Layout = Layout.Grid;
  @observable dialogMap: Map<string, { type: DialogType }> = new Map();
  @action.bound
  setLayout(layout: Layout) {
    this.layout = layout;
  }
  @bound
  setIsPointingBar(disable: boolean) {
    this._isPointingBar = disable;
  }
  @bound
  setHasPopoverShowed(has: boolean) {
    this._hasPopoverShowed = has;
  }
  @action.bound
  clearScreen = () => {
    if (this._isPointingBar || this._hasPopoverShowed) return;
    this.showStatusBar = false;
    this.showActiobBar = false;
  };
  @action.bound
  activeStatusBarAndActionBar = () => {
    this.showStatusBar = true;
    this.showActiobBar = true;
  };

  @action.bound
  resetClearScreenTask = () => {
    this.activeStatusBarAndActionBar();
    this._clearScreenTask?.stop();
    this._clearScreenTask = Scheduler.shared.addDelayTask(this.clearScreen, this._clearScreenDelay);
  };

  hasDialogOf(type: DialogType) {
    let exist = false;
    this.dialogMap.forEach(({ type: dialogType }) => {
      if (dialogType === type) {
        exist = true;
      }
    });

    return exist;
  }

  addDialog(type: 'confirm', params: ConfirmDialogProps): void;
  addDialog(type: 'device-settings'): void;
  @action.bound
  addDialog(type: unknown, params?: unknown) {
    this.dialogMap.set(uuidv4(), { ...(params as any), type: type as DialogType });
  }

  @action.bound
  deleteDialog = (type: string) => {
    this.dialogMap.delete(type);
  };

  onDestroy(): void {
    document.removeEventListener('mousemove', this.resetClearScreenTask);
    document.removeEventListener('mouseleave', this.clearScreen);
  }
  onInstall(): void {
    document.addEventListener('mousemove', this.resetClearScreenTask);
    document.addEventListener('mouseleave', this.clearScreen);

    this.resetClearScreenTask();
  }
}
