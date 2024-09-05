import { FcrUIAiSceneContext } from '../../uistores/context';
import { useContext } from 'react';

export const useStore = () => useContext(FcrUIAiSceneContext.shared);
