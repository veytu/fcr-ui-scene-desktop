import { StreamWindowContext } from '@onlineclass/containers/window/context';
import { useContext } from 'react';
import { useStore } from './use-store';

export const useVideoRenderable = () => {
  const streamWindowContext = useContext(StreamWindowContext);
  const renderMode = streamWindowContext?.renderMode;
  const stream = streamWindowContext?.stream;
  const {
    classroomStore: {
      mediaStore: { setupLocalVideo },
    },
    layoutUIStore: { layout, setLayout },
    streamUIStore: { updateVideoDom, removeVideoDom },
    presentationUIStore: { pinStream, mainViewStreamUuid },
    deviceSettingUIStore: {},
  } = useStore();
  const checkVideoVisible = () => {
    if (stream?.isLocal) return;
    if (streamWindowContext?.renderAtMainView) {
      return mainViewStreamUuid === stream?.stream.streamUuid;
    }
    if (streamWindowContext?.renderAtListView) {
      return mainViewStreamUuid !== stream?.stream.streamUuid;
    }
  };
};
