import { EduUIStoreBase } from './base';
import { observable, action } from 'mobx';
import { DialogType, Layout } from './type';
import { Scheduler } from 'agora-rte-sdk';
import { BaseDialogProps } from '@onlineclass/components/dialog';
import { v4 as uuidv4 } from 'uuid';
import { DialogProps } from 'rc-dialog';
import { ConfirmDialogProps } from '@onlineclass/components/dialog/confirm-dialog';
type AddDialog = (type: 'confirm', params: ConfirmDialogProps) => void;
export class LayoutUIStore extends EduUIStoreBase {
  private _mouseMoveTask: Scheduler.Task | null = null;
  @observable showStatusBar = true;
  @observable showActiobBar = true;
  @observable layout: Layout = Layout.ListOnTop;
  @observable dialogMap: Map<string, BaseDialogProps & { type: DialogType }> = new Map();
  @action.bound
  setLayout(layout: Layout) {
    this.layout = layout;
  }
  handleMouseMove = () => {};
  @action.bound
  addDialog: AddDialog = (type: DialogType, params: BaseDialogProps) => {
    this.dialogMap.set(uuidv4(), Object.assign(params, { type }));
  };
  @action.bound
  deleteDialog = (id: string) => {
    this.dialogMap.delete(id);
  };
  onDestroy(): void {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }
  onInstall(): void {
    document.addEventListener('mousemove', this.handleMouseMove);
  }
}
