import { useEffect, useRef, useContext } from 'react';
import { clickAnywhere } from '.';
import { OnlineclassContext } from '@onlineclass/uistores/context';
export const useClickAnywhere = (cb: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      return clickAnywhere(ref.current, cb);
    }
  }, []);

  return ref;
};
export const useStore = () => useContext(OnlineclassContext.shared);
