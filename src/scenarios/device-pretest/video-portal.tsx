import { observer } from 'mobx-react';
import { Button } from '@onlineclass/components/button';
import { VerticalSlider } from '@onlineclass/components/slider';
import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ClickableIcon, PretestDeviceIcon } from '@onlineclass/components/svg-img/clickable-icon';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { useEffect, useMemo, useRef } from 'react';

export const VideoPortal = observer(() => {
  const { setDevicePretestFinished, deviceSettingUIStore } = useStore();
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      deviceSettingUIStore.setupLocalVideo(videoRef.current, false);
    }
  }, []);

  const cameraIconProps = useMemo(() => {
    const isDeviceActive = deviceSettingUIStore.isCameraDeviceEnabled;
    const isNoDevice = deviceSettingUIStore.cameraDevicesList.length === 0;

    if (isNoDevice) {
      return {
        status: 'disabled' as const,
        icon: SvgIconEnum.FCR_CAMERACRASH,
        tooltip: 'No device',
      };
    }

    return isDeviceActive
      ? {
          status: 'active' as const,
          icon: SvgIconEnum.FCR_CAMERA,
          tooltip: 'Camera opened',
          onClick: deviceSettingUIStore.toggleCameraDevice,
        }
      : {
          status: 'inactive' as const,
          icon: SvgIconEnum.FCR_CAMERAOFF,
          tooltip: 'Camera closed',
          onClick: deviceSettingUIStore.toggleCameraDevice,
        };
  }, [deviceSettingUIStore.isCameraDeviceEnabled]);

  const microphoneIconProps = useMemo(() => {
    const enabled = deviceSettingUIStore.isAudioRecordingDeviceEnabled;
    const isNoDevice = deviceSettingUIStore.recordingDevicesList.length === 0;

    if (isNoDevice) {
      return {
        status: 'disabled' as const,
        icon: SvgIconEnum.FCR_MUTECRASH,
        tooltip: 'No device',
      };
    }

    return enabled
      ? {
          status: 'active' as const,
          icon: SvgIconEnum.FCR_MUTE,
          tooltip: 'Microphone opened',
          onClick: deviceSettingUIStore.toggleAudioRecordingDevice,
        }
      : {
          status: 'inactive' as const,
          icon: SvgIconEnum.FCR_NOMUTE,
          tooltip: 'Microphone closed',
          onClick: deviceSettingUIStore.toggleAudioRecordingDevice,
        };
  }, [deviceSettingUIStore.isAudioRecordingDeviceEnabled]);

  const speakerIconProps = useMemo(() => {
    const enabled = deviceSettingUIStore.isAudioPlaybackDeviceEnabled;

    return enabled
      ? {
          status: 'active' as const,
          icon: SvgIconEnum.FCR_V2_LOUDER_MIN,
          tooltip: 'Speaker opened',
          onClick: deviceSettingUIStore.toggleAudioPlaybackDevice,
        }
      : {
          status: 'inactive' as const,
          icon: SvgIconEnum.FCR_V2_QUITE,
          tooltip: 'Speaker closed',
          onClick: deviceSettingUIStore.toggleAudioPlaybackDevice,
        };
  }, [deviceSettingUIStore.isAudioPlaybackDeviceEnabled]);

  return (
    <div className="fcr-pretest__video-portal">
      <div className="fcr-pretest__video-portal__header">
        <span>Are you ready to join?</span>
        <Button onClick={setDevicePretestFinished}>Join</Button>
      </div>
      <div className="fcr-pretest__video-portal__video">
        <div ref={videoRef} className="fcr-pretest__video-portal__video-renderer" />
        <div className="fcr-pretest__video-portal__sidebar">
          <VerticalSlider />
          <ClickableIcon icon={SvgIconEnum.FCR_V2_LOUDER} size="small" />
        </div>
      </div>
      <div className="fcr-pretest__video-portal__toggles">
        <PretestDeviceIcon {...cameraIconProps} />
        <PretestDeviceIcon {...microphoneIconProps} />
        <PretestDeviceIcon {...speakerIconProps} />
        <PretestDeviceIcon
          icon={SvgIconEnum.FCR_BACKGROUND2}
          status="active"
          tooltip={'Virtual Background'}
        />
        <PretestDeviceIcon
          icon={SvgIconEnum.FCR_BEAUTY}
          status="active"
          tooltip={'Beauty Filter'}
        />
        <PretestDeviceIcon
          status="idle"
          icon={SvgIconEnum.FCR_MIRRORIMAGE_LEFT}
          classNames="fcr-pretest__video-portal__toggles__mirror"
          tooltip={''}
        />
      </div>
    </div>
  );
});
