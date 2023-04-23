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
  @observable
  statusBarHeight = 36;
  @observable
  actionBarHeight = 58;

  @observable classroomViewportSize = { width: 0, height: 0 };
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
  @observable showListView = true;

  @action.bound
  toggleShowListView() {
    this.showListView = !this.showListView;
  }
  @bound
  setIsPointingBar(disable: boolean) {
    this._isPointingBar = disable;
  }
  @bound
  setHasPopoverShowed(has: boolean) {
    this._hasPopoverShowed = has;
  }
  @computed get stageSize() {
    return this.layout === Layout.Grid || !this.showListView
      ? 0
      : this.layout === Layout.ListOnRight
      ? 210
      : 135;
  }
  @computed get deviceSettingOpened() {
    let opened = false;
    this.dialogMap.forEach((dialog) => {
      if (dialog.type === 'device-settings') opened = true;
    });
    return opened;
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
  @bound
  addViewportResizeObserver() {
    const observer = new ResizeObserver(this._updateViewportBoundaries);

    const viewport = document.querySelector(`body`);
    if (viewport) {
      observer.observe(viewport);
    }
    return observer;
  }

  @bound
  @Lodash.debounced(300)
  private _updateViewportBoundaries() {
    const containerEle = document.querySelector(`body`);

    if (containerEle) {
      const { calcWidth: width, calcHeight: height } = this.classroomSizeToBoardSize(
        containerEle as HTMLElement,
      );
      console.log(width, height, 'boardOriSize');
      const aspectRatio = 670 / 1440;

      const curAspectRatio = height / width;

      const boardSize = { height, width };

      if (curAspectRatio > aspectRatio) {
        // shrink height
        boardSize.height = width * aspectRatio;
      } else if (curAspectRatio < aspectRatio) {
        // shrink width
        boardSize.width = height / aspectRatio;
      }
      console.log(boardSize.width, boardSize.height, 'boardSize');

      runInAction(() => {
        this.classroomViewportSize = this.boardSizeToClassroomSize({
          w: boardSize.width,
          h: boardSize.height,
        });
      });
    }
  }
  classroomSizeToBoardSize = (containerNode: Window | HTMLElement) => {
    const height =
      containerNode instanceof Window ? containerNode.innerHeight : containerNode.clientHeight;
    const width =
      containerNode instanceof Window ? containerNode.innerWidth : containerNode.clientWidth;

    const calcWidth = this.layout === Layout.ListOnRight ? width - this.stageSize : width;
    const calcHeight =
      this.layout === Layout.ListOnRight
        ? height - this.statusBarHeight - this.actionBarHeight
        : height - this.stageSize - this.statusBarHeight - this.actionBarHeight;

    return { calcWidth, calcHeight };
  };
  boardSizeToClassroomSize = ({ w, h }: { w: number; h: number }) => {
    const width = this.layout === Layout.ListOnRight ? w + this.stageSize : w;
    const height =
      this.layout === Layout.ListOnRight
        ? h + this.statusBarHeight + this.actionBarHeight
        : h + this.stageSize + this.statusBarHeight + this.actionBarHeight;
    console.log(width, height, 'boardClassroomSize');

    return { width, height };
  };
  onDestroy(): void {
    this._viewportResizeObserver?.disconnect();
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
  }
  onInstall(): void {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseleave', this.handleMouseLeave);

    this.resetClearScreenTask();
    this._disposers.push(reaction(() => this.layout, this._updateViewportBoundaries));
    this._disposers.push(reaction(() => this.showListView, this._updateViewportBoundaries));

    this._disposers.push(
      reaction(
        () => this.getters.isBoardWidgetActive,
        (isBoardWidgetActive) => {
          if (isBoardWidgetActive) {
            if (this.layout === Layout.Grid) this.setLayout(Layout.ListOnTop);
          }
        },
      ),
    );
  }
}
