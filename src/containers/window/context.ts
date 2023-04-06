import { Layout, StreamWindowPlacement } from '@onlineclass/uistores/type';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { EduClassroomConfig, EduRoleTypeEnum } from 'agora-edu-core';
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
  const isVideoStreamPublished = stream.isVideoStreamPublished;
  const showNameOnBottomLeft = renderAtMainView || (renderAtListView && !isVideoStreamPublished);
  const showRoundedNamePlaceholder = renderAtMainView;
  const labelIconSize = labelSize === 'large' ? 30 : 24;
  const audioIconSize = labelSize === 'large' ? 24 : 16;
  const isHostRemote = stream.role === EduRoleTypeEnum.teacher;
  const isHostLocal = EduClassroomConfig.shared.sessionInfo.role === EduRoleTypeEnum.teacher;
  const renderMode = renderAtMainView && !isGrid ? 0 : 1;
  return {
    topLabelAnimation,
    bottomLabelAnimation,
    labelSize,
    streamPlayerVisible: isVideoStreamPublished,
    stream,
    labelIconSize,
    audioIconSize,
    renderMode,
    showMicrophoneIconOnRoleLabel,
    showMicrophoneIconOnBottomRight,
    showNameOnBottomLeft,
    showRoundedNamePlaceholder,
    showHostLabel: isHostRemote,
    showActions: !isHostRemote && isHostLocal,
    showInteractLabels: !isHostRemote,
  };
};
