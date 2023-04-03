import { Layout, StreamWindowPlacement } from '@onlineclass/uistores/type';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { EduRoleTypeEnum } from 'agora-edu-core';
import { createContext } from 'react';
export const StreamWindowContext = createContext<ReturnType<typeof convertStreamUIStatus> | null>(
  null,
);

export const convertStreamUIStatus = (
  stream: EduStreamUI,
  placement: StreamWindowPlacement,
  layout: Layout,
  cameraStreams: EduStreamUI[],
) => {
  const isSingleStream = cameraStreams.length === 1;
  const renderAtMainView = placement === 'main-view';
  const renderAtListView = placement === 'list-view';

  const topLabelAnimation = renderAtMainView && layout !== Layout.ListOnTop && isSingleStream;
  const bottomLabelAnimation = renderAtMainView && isSingleStream;
  const showMicrophoneIconOnRoleLabel = renderAtMainView;
  const showMicrophoneIconOnBottomRight = renderAtListView;
  const labelSize = renderAtMainView ? 'large' : 'small';
  const isCameraStreamPublished = stream.isCameraStreamPublished;
  const showNameOnBottomLeft = renderAtListView && !isCameraStreamPublished;
  const showRoundedNamePlaceholder = renderAtMainView;
  const labelIconSize = labelSize === 'large' ? 30 : 24;
  const audioIconSize = labelSize === 'large' ? 24 : 16;
  const isHost = stream.role === EduRoleTypeEnum.teacher;
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
  };
};
