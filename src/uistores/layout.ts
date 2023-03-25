import { EduUIStoreBase } from './base';
import { observable, action } from 'mobx';
import { Layout } from './type';

export class LayoutUIStore extends EduUIStoreBase {
  @observable layout: Layout = Layout.ListOnTop;
  @action.bound
  setLayout(layout: Layout) {
    this.layout = layout;
  }
  onDestroy(): void {}
  onInstall(): void {}
}
