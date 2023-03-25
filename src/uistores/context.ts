import { createContext, Context } from 'react';
import { OnlineclassUIStore } from '.';

export class OnlineclassContext {
  private static _context: Context<OnlineclassUIStore> | null;
  static get shared() {
    if (!OnlineclassContext._context) {
      OnlineclassContext._context = createContext(new OnlineclassUIStore());
    }
    return OnlineclassContext._context;
  }
  static reset() {
    OnlineclassContext._context = null;
  }
}
