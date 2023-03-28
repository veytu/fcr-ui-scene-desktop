import { observer } from 'mobx-react';
import { Button } from '@onlineclass/components/button';
import { VerticalSlider } from '@onlineclass/components/slider';
import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ClickableIcon, PretestDeviceIcon } from '@onlineclass/components/svg-img/clickable-icon';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { useEffect } from 'react';

export const VideoPortal = observer(() => {
  const { setDevicePretestFinished } = useStore();

  useEffect(() => {
    // deviceSettingUIStore.setupLocalVideo();
  }, []);

  return (
    <div className="fcr-pretest__video-portal">
      <div className="fcr-pretest__video-portal__header">
        <span>Are you ready to join?</span>
        <Button onClick={setDevicePretestFinished}>Join</Button>
      </div>
      <div className="fcr-pretest__video-portal__video">
        <div className="fcr-pretest__video-portal__sidebar">
          <VerticalSlider />
          <ClickableIcon icon={SvgIconEnum.FCR_V2_LOUDER} size="small" />
        </div>
      </div>
      <div className="fcr-pretest__video-portal__toggles">
        <PretestDeviceIcon icon={SvgIconEnum.FCR_CAMERA} status="active" />
        <PretestDeviceIcon icon={SvgIconEnum.FCR_MUTECRASH} status="active" />
        <PretestDeviceIcon icon={SvgIconEnum.FCR_V2_LOUDER} status="active" />
        <PretestDeviceIcon
          status="idle"
          icon={SvgIconEnum.FCR_MIRRORIMAGE_LEFT}
          classNames="fcr-pretest__video-portal__toggles__mirror"
        />
      </div>
    </div>
  );
});
