import React, { useContext, useEffect, useMemo, useRef } from 'react';
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
  const pretestDeviceStateRef = useRef({ cameraEnable: false, micEnable: false });
  const cameraIconProps = useMemo<
    { status: string; icon: SvgIconEnum; tooltip: string } & Partial<PretestDeviceIconProps>
  >(() => {
    const isDeviceActive = deviceSettingUIStore.isPreviewCameraDeviceEnabled;
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
          tooltip: 'Stop video',
        }
      : {
          status: 'inactive' as const,
          icon: SvgIconEnum.FCR_CAMERAOFF,
          iconProps: {
            colors: {
              iconSecondary: colors?.['notsb-inverse'],
            },
          },
          tooltip: 'Start video',
        };
  }, [
    deviceSettingUIStore.isPreviewCameraDeviceEnabled,
    deviceSettingUIStore.cameraDevicesList.length,
  ]);

  const microphoneIconProps = useMemo(() => {
    const enabled = deviceSettingUIStore.isPreviewAudioRecordingDeviceEnabled;
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
          tooltip: 'Mute',
        }
      : {
          status: 'inactive' as const,
          icon: SvgIconEnum.FCR_NOMUTE,
          iconProps: {
            colors: {
              iconSecondary: colors?.['notsb-inverse'],
            },
          },
          tooltip: 'Unmute',
        };
  }, [
    deviceSettingUIStore.isPreviewAudioRecordingDeviceEnabled,
    deviceSettingUIStore.recordingDevicesList.length,
  ]);

  const speakerIconProps = useMemo(() => {
    const enabled = deviceSettingUIStore.isAudioPlaybackDeviceEnabled;

    return enabled
      ? {
          status: 'active' as const,
          icon: SvgIconEnum.FCR_V2_LOUDER_MIN,
          tooltip: 'Disable speaker',
        }
      : {
          status: 'inactive' as const,
          icon: SvgIconEnum.FCR_V2_QUITE,
          tooltip: 'Enable speaker',
        };
  }, [deviceSettingUIStore.isAudioPlaybackDeviceEnabled]);
  const activeTab = useContext(DeviceTabKeysContext);

  const beautyFilterVisible =
    deviceSettingUIStore.isBeautyFilterEnabled &&
    deviceSettingUIStore.activeBeautyType &&
    activeTab === 'beauty-filter';

  useEffect(() => {
    deviceSettingUIStore.startCameraPreview();
    deviceSettingUIStore.startRecordingDeviceTest();

    return () => {
      deviceSettingUIStore.setPretestCameraEnabled(pretestDeviceStateRef.current.cameraEnable);
      deviceSettingUIStore.setPretestMicEnabled(pretestDeviceStateRef.current.micEnable);
      deviceSettingUIStore.stopCameraPreview();
      deviceSettingUIStore.stopRecordingDeviceTest();
    };
  }, []);
  useEffect(() => {
    pretestDeviceStateRef.current = {
      cameraEnable: deviceSettingUIStore.isPreviewCameraDeviceEnabled,
      micEnable: deviceSettingUIStore.isPreviewAudioRecordingDeviceEnabled,
    };
  }, [
    deviceSettingUIStore.isPreviewAudioRecordingDeviceEnabled,
    deviceSettingUIStore.isPreviewCameraDeviceEnabled,
  ]);
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
        {beautyFilterVisible && <BeautySlider />}
      </div>
      <div className="fcr-pretest__video-portal__toggles">
        <PretestDeviceIcon
          onClick={deviceSettingUIStore.toggleCameraPreview}
          {...cameraIconProps}
        />
        <PretestDeviceIcon
          onClick={deviceSettingUIStore.toggleAudioRecordingPreview}
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
    deviceSettingUIStore: { isPreviewCameraDeviceEnabled, isBeautyFilterEnabled, activeBeautyType },
  } = useStore();

  const activeBeautySlider =
    activeTab === 'beauty-filter' && isBeautyFilterEnabled && activeBeautyType;
  return !isPreviewCameraDeviceEnabled && activeTab !== 'basic-settings' ? (
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
