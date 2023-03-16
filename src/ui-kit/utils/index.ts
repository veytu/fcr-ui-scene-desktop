export const clickAnywhere = (el: HTMLElement, cb: () => void) => {
  const propaHandler = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const callbackHandler = () => {
    cb();
  };

  el.addEventListener('mousedown', propaHandler);

  window.addEventListener('mousedown', callbackHandler);

  return () => {
    el.addEventListener('mousedown', propaHandler);
    window.removeEventListener('mousedown', callbackHandler);
  };
};
