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
  handsUp = 'handsUp',
  handsUpAll = 'handsUpAll',
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
  close = 0,

  open = 1,
}
export type CustomMessageHandsUpType = {
  userUuid: string;
  state: CustomMessageHandsUpState;
};
export enum CustomMessageHandsUpState {
  lowerHand = 0,
  raiseHand = 1,
}
export type CustomMessageHandsUpAllType = {
  operation: CustomMessageHandsUpState;
};
export type CommonDialogType<T = unknown> = {
  id?: string;
} & T;
export enum DeviceSwitchDialogId {
  StartVideo = 'start-video',
  Unmute = 'unmute',
}
