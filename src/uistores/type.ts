export enum Layout {
  ListOnTop = 'list-on-top',
  ListOnRight = 'list-on-right',
  Grid = 'grid',
}
export type StreamWindowPlacement = 'main-view' | 'list-view';

export type DialogType = 'confirm' | 'device-settings' | 'participants' | 'class-info';
export type CustomMessageData<T> = {
  cmd: CustomMessageCommandType;
  data: T;
};
export enum CustomMessageCommandType {
  deviceSwitch = 'deviceSwitch',
  deviceSwitchBatch = 'deviceSwitchBatch',
}
export type CustomMessageDeviceSwitchType = {
  deviceState: CustomMessageDeviceState;
  deviceType: CustomMessageDeviceType;
};
export enum CustomMessageDeviceType {
  camera = 1,
  mic = 2,
}
export enum CustomMessageDeviceState {
  open = 0,
  close = 1,
}
