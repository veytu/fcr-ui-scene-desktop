import { EduUIStoreBase } from './base';
import { observable, action, computed, reaction, runInAction } from 'mobx';
import { DialogType, Layout } from './type';
import { bound, Lodash, Scheduler } from 'agora-rte-sdk';
import { Log } from 'agora-common-libs/lib/annotation';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmDialogProps } from '@components/dialog/confirm-dialog';
import { AgoraViewportBoundaries } from 'agora-common-libs/lib/widget';

@Log.attach({ proxyMethods: false })
export class LayoutUIStore extends EduUIStoreBase {
  private _clearScreenTask: Scheduler.Task | null = null;
  private _clearScreenDelay = 3000;
  private _isPointingBar = false;
  private _hasPopoverShowed = false;
  private _classroomViewportClassName = 'fcr-classroom-viewport';
  private _viewportResizeObserver?: ResizeObserver;

  @observable viewportBoundaries?: AgoraViewportBoundaries;
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
  @computed get gridLayoutDisabled() {
    return this.getters.isBoardWidgetActive;
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
      this.noAvailabelStream ||
      this.getters.isBoardWidgetActive
    );
  }
  get classroomViewportClassName() {
    return this._classroomViewportClassName;
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

  addViewportResizeObserver() {
    const observer = new ResizeObserver(this._updateViewportBoundaries);

    const viewport = document.querySelector(`.${this._classroomViewportClassName}`);
    if (viewport) {
      observer.observe(viewport);
    }
    return observer;
  }

  @bound
  @Lodash.debounced(300)
  private _updateViewportBoundaries() {
    const clientRect = document
      .querySelector(`.${this._classroomViewportClassName}`)
      ?.getBoundingClientRect();

    if (clientRect) {
      this.logger.info('notify to all widgets that viewport boundaries changed');
      runInAction(() => {
        this.viewportBoundaries = clientRect;
      });
    } else {
      this.logger.warn(
        'cannot get viewport boudnaries by classname:',
        this._classroomViewportClassName,
      );
    }
  }

  onDestroy(): void {
    this._viewportResizeObserver?.disconnect();
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
