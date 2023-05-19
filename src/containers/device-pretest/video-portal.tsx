import React, { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { Button } from '@components/button';
import { SvgIconEnum } from '@components/svg-img';
import { PretestDeviceIcon, PretestDeviceIconProps } from '@components/svg-img/clickable-icon';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { BeautySlider } from './beauty-slider';
import { MirrorToggle } from './mirror-toggle';
import { LocalVideoPlayer } from '../video-player';
import { themeVal } from '@ui-kit-utils/tailwindcss';
import { DeviceTabKeysContext } from '.';
const colors = themeVal('colors');
export const VideoPortal = observer(() => {
  const { setDevicePretestFinished, deviceSettingUIStore } = useStore();

  const cameraIconProps = useMemo<
    { status: string; icon: SvgIconEnum; tooltip: string } & Partial<PretestDeviceIconProps>
  >(() => {
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
          iconProps: {
            colors: {
              iconSecondary: colors?.['notsb-inverse'],
            },
          },
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
          iconProps: {
            colors: {
              iconSecondary: colors?.['notsb-inverse'],
            },
          },
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

  return (
    <div className="fcr-pretest__video-portal">
      <div className="fcr-pretest__video-portal__header">
        <span>Are you ready to join?</span>
        <Button size="S" onClick={setDevicePretestFinished}>
          Join
        </Button>
      </div>
      <div className="fcr-pretest__video-portal__video">
        <VideoOffTips />
        <LocalVideoPlayer />
        <BeautySlider />
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
        <MirrorToggle placement="pretest" />
      </div>
    </div>
  );
});
const VideoOffTips = observer(() => {
  const activeTab = useContext(DeviceTabKeysContext);
  const {
    deviceSettingUIStore: { isCameraDeviceEnabled, isBeautyFilterEnabled, activeBeautyType },
  } = useStore();
  const activeBeautySlider =
    activeTab === 'beauty-filter' && isBeautyFilterEnabled && activeBeautyType;
  return !isCameraDeviceEnabled && activeTab !== 'basic-settings' ? (
    <div
      style={{
        width: `calc(100% - ${activeBeautySlider ? '56px' : '0px'})`,
        borderTopRightRadius: `${activeBeautySlider ? '16px' : '0px'}`,
      }}
      className="fcr-pretest__video-portal__tips">
      {activeTab === 'virtual-background'
        ? 'Before using and previewing background effects, please start the camera.'
        : 'Before using and previewing beauty filter effects, please start the camera.'}
    </div>
  ) : null;
});
