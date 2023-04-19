import { Layout } from '@onlineclass/uistores/type';
import { useStore } from './use-store';

export const usePinStream = () => {
  const {
    layoutUIStore: { layout, setLayout },
    presentationUIStore: { pinStream: pin, removePinnedStream },
  } = useStore();
  const pinStream = (streamUuid: string) => {
    if (layout === Layout.Grid) setLayout(Layout.ListOnTop);
    pin(streamUuid);
  };
  return { pinStream, removePinnedStream };
};
