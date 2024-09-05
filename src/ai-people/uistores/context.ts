import { createContext, Context } from 'react';
import { SceneUIAiStore } from '.';

export class FcrUIAiSceneContext {
  private static _context: Context<SceneUIAiStore> | null;
  static get shared() {
    if (!FcrUIAiSceneContext._context) {
      FcrUIAiSceneContext._context = createContext(new SceneUIAiStore());
    }
    return FcrUIAiSceneContext._context;
  }
  static reset() {
    FcrUIAiSceneContext._context = null;
  }
}
