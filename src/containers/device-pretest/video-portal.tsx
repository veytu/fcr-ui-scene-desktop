import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import { Button } from '@onlineclass/components/button';
import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { PretestDeviceIcon } from '@onlineclass/components/svg-img/clickable-icon';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { BeautySlider } from './beauty-slider';
import { MirrorToggle } from './mirror-toggle';
import { LocalVideoPlayer } from '../video-player';

export const VideoPortal = observer(() => {
  const { setDevicePretestFinished, deviceSettingUIStore } = useStore();

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
        }
      : {
          status: 'inactive' as const,
          icon: SvgIconEnum.FCR_CAMERAOFF,
          tooltip: 'Camera closed',
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
        }
      : {
          status: 'inactive' as const,
          icon: SvgIconEnum.FCR_NOMUTE,
          tooltip: 'Microphone closed',
        };
  }, [deviceSettingUIStore.isAudioRecordingDeviceEnabled]);

  const speakerIconProps = useMemo(() => {
    const enabled = deviceSettingUIStore.isAudioPlaybackDeviceEnabled;

    return enabled
      ? {
          status: 'active' as const,
          icon: SvgIconEnum.FCR_V2_LOUDER_MIN,
          tooltip: 'Speaker opened',
        }
      : {
          status: 'inactive' as const,
          icon: SvgIconEnum.FCR_V2_QUITE,
          tooltip: 'Speaker closed',
        };
  }, [deviceSettingUIStore.isAudioPlaybackDeviceEnabled]);

  const virtualBackgroundIconProps = useMemo(() => {
    const enabled = deviceSettingUIStore.isVirtualBackgroundEnabled;

    return enabled
      ? {
          status: 'active' as const,
          onClick: deviceSettingUIStore.toggleVirtualBackground,
        }
      : {
          status: 'idle' as const,
          onClick: deviceSettingUIStore.toggleVirtualBackground,
        };
  }, [deviceSettingUIStore.isVirtualBackgroundEnabled]);

  const beautyFilterIconProps = useMemo(() => {
    const enabled = deviceSettingUIStore.isBeautyFilterEnabled;

    return enabled
      ? {
          status: 'active' as const,
          onClick: deviceSettingUIStore.toggleBeautyFilter,
        }
      : {
          status: 'idle' as const,
          onClick: deviceSettingUIStore.toggleBeautyFilter,
        };
  }, [deviceSettingUIStore.isBeautyFilterEnabled]);

  return (
    <div className="fcr-pretest__video-portal">
      <div className="fcr-pretest__video-portal__header">
        <span>Are you ready to join?</span>
        <Button onClick={setDevicePretestFinished}>Join</Button>
      </div>
      <div className="fcr-pretest__video-portal__video">
        <LocalVideoPlayer />
        <div className="fcr-pretest__video-portal__sidebar">
          <BeautySlider />
        </div>
      </div>
      <div className="fcr-pretest__video-portal__toggles">
        <PretestDeviceIcon onClick={deviceSettingUIStore.toggleCameraDevice} {...cameraIconProps} />
        <PretestDeviceIcon
          onClick={deviceSettingUIStore.toggleAudioRecordingDevice}
          {...microphoneIconProps}
        />
        <PretestDeviceIcon
          onClick={deviceSettingUIStore.toggleAudioPlaybackDevice}
          {...speakerIconProps}
        />
        <PretestDeviceIcon
          icon={SvgIconEnum.FCR_BACKGROUND2}
          tooltip={'Virtual Background'}
          {...virtualBackgroundIconProps}
        />
        <PretestDeviceIcon
          icon={SvgIconEnum.FCR_BEAUTY}
          tooltip={'Beauty Filter'}
          {...beautyFilterIconProps}
        />
        <MirrorToggle />
      </div>
    </div>
  );
});
