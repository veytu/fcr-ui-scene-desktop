const callbacks = new Set<() => void>();

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

export const number2Percent = (v: number, fixed = 0): string => {
  return !isNaN(Number(v * 100)) ? Number(v * 100).toFixed(fixed) + '%' : '0%';
};

export const fetchMediaFileByUrl = async ({
  url,
  type,
}: {
  url: string;
  type: 'image' | 'video';
}) => {
  if (type === 'image') {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.addEventListener('load', () => {
        resolve(image);
      });

      image.addEventListener('error', reject);
    });
  } else if (type === 'video') {
    return new Promise<HTMLVideoElement>((resolve, reject) => {
      const video = document.createElement('video');
      video.src = url;
      video.addEventListener('loadeddata', () => {
        resolve(video);
      });
      video.addEventListener('error', reject);
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
    });
  }

  return Promise.reject('Not implemented');
};
