import { EduUIStoreBase } from './base';
import { observable, action } from 'mobx';
import { Layout } from './type';
import { Scheduler } from 'agora-rte-sdk';

export class LayoutUIStore extends EduUIStoreBase {
  private _mouseMoveTask: Scheduler.Task | null = null;
  @observable showStatusBar = true;
  @observable showActiobBar = true;
  @observable layout: Layout = Layout.ListOnTop;
  @action.bound
  setLayout(layout: Layout) {
    this.layout = layout;
  }
  handleMouseMove = () => {};
  onDestroy(): void {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }
  onInstall(): void {
    document.addEventListener('mousemove', this.handleMouseMove);
  }
}
