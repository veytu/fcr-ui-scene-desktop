import { EduUIStoreBase } from './base';
import { observable, action, computed, reaction } from 'mobx';
import { DialogType, Layout } from './type';
import { bound, Scheduler } from 'agora-rte-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmDialogProps } from '@components/dialog/confirm-dialog';

export class LayoutUIStore extends EduUIStoreBase {
  private _clearScreenTask: Scheduler.Task | null = null;
  private _clearScreenDelay = 3000;
  private _isPointingBar = false;
  private _hasPopoverShowed = false;
  @observable mouseEnterClass = false;
  @observable layoutReady = false;
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
  @computed
  get noAvailabelStream() {
    return (
      this.getters.cameraUIStreams.length < 1 ||
      !this.getters.cameraUIStreams[0]?.isVideoStreamPublished
    );
  }
  get disableClearScreen() {
    return (
      this._isPointingBar ||
      this._hasPopoverShowed ||
      (this.layout === Layout.Grid && this.getters.cameraUIStreams.length > 1) ||
      this.noAvailabelStream
    );
  }
  @action.bound
  clearScreen = () => {
    if (this.disableClearScreen) return;
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
  addDialog(type: 'participants'): void;

  @action.bound
  addDialog(type: unknown, params?: unknown) {
    this.dialogMap.set(uuidv4(), { ...(params as any), type: type as DialogType });
  }

  @action.bound
  deleteDialog = (type: string) => {
    this.dialogMap.delete(type);
  };
  @action.bound
  handleMouseMove() {
    this.mouseEnterClass = true;
    this.resetClearScreenTask();
  }
  @action.bound
  handleMouseLeave() {
    this.mouseEnterClass = false;
    this.clearScreen();
  }

  @action.bound
  setLayoutReady(ready: boolean) {
    this.layoutReady = ready;
  }

  onDestroy(): void {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
  }
  onInstall(): void {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseleave', this.handleMouseLeave);

    this.resetClearScreenTask();

    this._disposers.push(
      reaction(
        () => this.getters.isBoardWidgetActive,
        (isBoardWidgetActive) => {
          if (isBoardWidgetActive) {
            this.setLayout(Layout.ListOnTop);
          }
        },
      ),
    );
  }
}
