import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import { useEffect, useRef } from 'react';

export const LocalVideoPlayer = observer(() => {
  const { deviceSettingUIStore } = useStore();
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      deviceSettingUIStore.setupLocalVideo(
        videoRef.current,
        deviceSettingUIStore.isLocalMirrorEnabled,
      );
    }
  }, [deviceSettingUIStore.isLocalMirrorEnabled]);

  return <div ref={videoRef} className="fcr-video-player" />;
});

export const RemoteVideoPlayer = observer(() => {
  return <div />;
});
