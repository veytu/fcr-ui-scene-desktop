import { observer } from 'mobx-react';
import { Button } from '@onlineclass/components/button';
import { VerticalSlider } from '@onlineclass/components/slider';
import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ClickableIcon, PretestDeviceIcon } from '@onlineclass/components/svg-img/clickable-icon';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { useEffect, useMemo, useRef } from 'react';
import React from 'react';

export const VideoPortal = observer(() => {
  const { setDevicePretestFinished, deviceSettingUIStore } = useStore();
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      deviceSettingUIStore.setupLocalVideo(
        videoRef.current,
        deviceSettingUIStore.isLocalMirrorEnabled,
      );
    }
  }, [deviceSettingUIStore.isLocalMirrorEnabled]);

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

  const mirrorIconProps = useMemo(() => {
    const enabled = deviceSettingUIStore.isLocalMirrorEnabled;
    return enabled
      ? {
          icon: SvgIconEnum.FCR_MIRRORIMAGE_LEFT,
        }
      : {
          icon: SvgIconEnum.FCR_MIRRORIMAGE_RIGHT,
        };
  }, [deviceSettingUIStore.isLocalMirrorEnabled]);

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

  const {
    isBeautyFilterEnabled,
    activeBeautyValue = 0,
    activeBeautyType,
    setBeautyFilter,
  } = deviceSettingUIStore;

  const sliderValue = activeBeautyValue * 100;

  const handleBeautyValueChange = (value: number) => {
    if (activeBeautyType) {
      setBeautyFilter({ [activeBeautyType]: value / 100 });
    }
  };

  const handleResetBeautyValue = () => {
    if (activeBeautyType) {
      setBeautyFilter({ [activeBeautyType]: 0 });
    }
  };

  return (
    <div className="fcr-pretest__video-portal">
      <div className="fcr-pretest__video-portal__header">
        <span>Are you ready to join?</span>
        <Button onClick={setDevicePretestFinished}>Join</Button>
      </div>
      <div className="fcr-pretest__video-portal__video">
        <div ref={videoRef} className="fcr-pretest__video-portal__video-renderer" />
        <div className="fcr-pretest__video-portal__sidebar">
          {isBeautyFilterEnabled && activeBeautyType && (
            <React.Fragment>
              <VerticalSlider value={sliderValue} onChange={handleBeautyValueChange} />
              <ClickableIcon
                icon={SvgIconEnum.FCR_RESET}
                size="small"
                onClick={handleResetBeautyValue}
              />
            </React.Fragment>
          )}
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
        <PretestDeviceIcon
          classNames="fcr-pretest__video-portal__toggles__mirror"
          status="idle"
          tooltip="Mirror"
          onClick={deviceSettingUIStore.toggleLocalMirror}
          {...mirrorIconProps}
        />
      </div>
    </div>
  );
});
