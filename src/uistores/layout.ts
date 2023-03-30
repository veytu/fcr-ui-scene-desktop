import { EduUIStoreBase } from './base';
import { observable, action, runInAction } from 'mobx';
import { DialogType, Layout } from './type';
import { bound, Scheduler } from 'agora-rte-sdk';
import { BaseDialogProps } from '@onlineclass/components/dialog';
import { v4 as uuidv4 } from 'uuid';
import { DialogProps } from 'rc-dialog';
import { ConfirmDialogProps } from '@onlineclass/components/dialog/confirm-dialog';
type AddDialog = (type: 'confirm', params: ConfirmDialogProps) => void;
export class LayoutUIStore extends EduUIStoreBase {
  private _clearScreenTask: Scheduler.Task | null = null;
  private _clearScreenDelay = 3000;
  private _disableClearScreen = false;
  @observable showStatusBar = true;
  @observable showActiobBar = true;
  @observable layout: Layout = Layout.Grid;
  @observable dialogMap: Map<string, BaseDialogProps & { type: DialogType }> = new Map();
  @action.bound
  setLayout(layout: Layout) {
    this.layout = layout;
  }
  @bound
  setDisableClearScreen(disable: boolean) {
    this._disableClearScreen = disable;
  }
  @action.bound
  resetClearScreenTask = () => {
    this.showStatusBar = true;
    this.showActiobBar = true;
    this._clearScreenTask?.stop();
    this._clearScreenTask = Scheduler.shared.addDelayTask(() => {
      if (this._disableClearScreen) return;
      runInAction(() => {
        this.showStatusBar = false;
        this.showActiobBar = false;
      });
    }, this._clearScreenDelay);
  };
  @action.bound
  stopClearScreenTask = () => {
    this.showStatusBar = true;
    this.showActiobBar = true;
    this._clearScreenTask?.stop();
  };
  @action.bound
  addDialog: AddDialog = (type: DialogType, params: BaseDialogProps) => {
    this.dialogMap.set(uuidv4(), Object.assign(params, { type }));
  };
  @action.bound
  deleteDialog = (id: string) => {
    this.dialogMap.delete(id);
  };
  onDestroy(): void {
    document.removeEventListener('mousemove', this.resetClearScreenTask);
  }
  onInstall(): void {
    document.addEventListener('mousemove', this.resetClearScreenTask);
    this.resetClearScreenTask();
  }
}
