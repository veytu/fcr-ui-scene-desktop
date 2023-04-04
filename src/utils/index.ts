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
