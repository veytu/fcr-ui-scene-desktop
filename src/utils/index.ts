import { EduRteEngineConfig, EduRteRuntimePlatform } from 'agora-edu-core';

const callbacks = new Set<() => void>();
declare const NODE_ENV: string;

export const clickAnywhere = (el: HTMLElement, cb: () => void) => {
  const propaHandler = (e: MouseEvent) => {
    // need to call back other clickAnywhere
    // before e.stopPropagation,
    // if there are more than one
    callbacks.forEach((ocb) => {
      if (ocb !== cb) {
        ocb();
      }
    });
    e.stopPropagation();
  };

  const callbackHandler = () => {
    cb();
  };

  el.addEventListener('mousedown', propaHandler);
  window.addEventListener('mousedown', callbackHandler);
  callbacks.add(cb);

  return () => {
    el.addEventListener('mousedown', propaHandler);
    window.removeEventListener('mousedown', callbackHandler);
    callbacks.delete(cb);
  };
};
export const isProduction = NODE_ENV === 'production';
export const number2Percent = (v: number, fixed = 0): string => {
  return !isNaN(Number(v * 100)) ? Number(v * 100).toFixed(fixed) + '%' : '0%';
};
export const isElectron = EduRteEngineConfig.platform === EduRteRuntimePlatform.Electron;
