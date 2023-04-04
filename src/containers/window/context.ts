import { Layout, StreamWindowPlacement } from '@onlineclass/uistores/type';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { EduRoleTypeEnum } from 'agora-edu-core';
import { createContext } from 'react';
export const StreamWindowContext = createContext<ReturnType<typeof convertStreamUIStatus> | null>(
  null,
);
interface StreamWindowMouseContext {
  mouseEnterWindow: boolean;
  mouseEnterClass: boolean;
}
export const StreamWindowMouseContext = createContext<StreamWindowMouseContext | null>(null);
export const convertStreamUIStatus = (
  stream: EduStreamUI,
  placement: StreamWindowPlacement,
  layout: Layout,
  isGrid: boolean,
) => {
  const renderAtMainView = placement === 'main-view';
  const renderAtListView = placement === 'list-view';

  const topLabelAnimation = renderAtMainView && layout !== Layout.ListOnTop && !isGrid;
  const bottomLabelAnimation = renderAtMainView && !isGrid;
  const showMicrophoneIconOnRoleLabel = renderAtMainView;
  const showMicrophoneIconOnBottomRight = renderAtListView;
  const labelSize = renderAtMainView ? 'large' : 'small';
  const isCameraStreamPublished = stream.isCameraStreamPublished;
  const showNameOnBottomLeft = renderAtMainView || (renderAtListView && !isCameraStreamPublished);
  const showRoundedNamePlaceholder = renderAtMainView;
  const labelIconSize = labelSize === 'large' ? 30 : 24;
  const audioIconSize = labelSize === 'large' ? 24 : 16;
  const isHost = stream.role === EduRoleTypeEnum.teacher;
  const renderMode = renderAtMainView && !isGrid ? 0 : 1;
  return {
    topLabelAnimation,
    bottomLabelAnimation,
    showMicrophoneIconOnRoleLabel,
    showMicrophoneIconOnBottomRight,
    labelSize,
    showNameOnBottomLeft,
    isCameraStreamPublished,
    stream,
    showRoundedNamePlaceholder,
    labelIconSize,
    audioIconSize,
    isHost,
    renderMode,
  };
};
