import { OnlineclassContext } from '@onlineclass/uistores/context';
import { useContext } from 'react';

export const useStore = () => useContext(OnlineclassContext.shared);
