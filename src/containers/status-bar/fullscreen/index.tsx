import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { useEffect, useState } from 'react';
import { StatusBarItemWrapper } from '..';
import './index.css';
export const FullscreenButton = () => {
  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  };
  const handleFullscreenChanged = () => {
    if (document.fullscreenElement) {
      setFullscreen(true);
    } else {
      setFullscreen(false);
    }
  };
  useEffect(() => {
    document.body.addEventListener('fullscreenchange', handleFullscreenChanged);
    () => document.body.removeEventListener('fullscreenchange', handleFullscreenChanged);
  }, []);
  return (
    <ToolTip placement="bottomRight" content={'Full-screen mode in the webpage'}>
      <StatusBarItemWrapper>
        <div onClick={toggleFullscreen} className="fcr-status-bar-fullscreen">
          <SvgImg
            type={
              fullscreen ? SvgIconEnum.FCR_WINDOW_SMALLER : SvgIconEnum.FCR_WINDOW_BIGGER
            }></SvgImg>
        </div>
      </StatusBarItemWrapper>
    </ToolTip>
  );
};
