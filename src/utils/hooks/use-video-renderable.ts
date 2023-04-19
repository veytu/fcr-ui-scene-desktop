import { StreamWindowContext } from '@onlineclass/containers/window/context';
import { Layout } from '@onlineclass/uistores/type';
import { useContext } from 'react';
import { useStore } from './use-store';

export const useVideoRenderable = () => {
  const streamWindowContext = useContext(StreamWindowContext);
  const stream = streamWindowContext?.stream;
  const {
    layoutUIStore: { deviceSettingOpened, layout },
    presentationUIStore: { mainViewStreamUuid },
  } = useStore();
  const checkVideoVisible = () => {
    if (stream?.isLocal && deviceSettingOpened) return false;
    if (layout === Layout.Grid) return true;
    if (streamWindowContext?.renderAtMainView) {
      return mainViewStreamUuid === stream?.stream.streamUuid;
    }
    if (streamWindowContext?.renderAtListView) {
      return mainViewStreamUuid !== stream?.stream.streamUuid;
    }
    return true;
  };
  return {
    videoRenderable: checkVideoVisible(),
  };
};
