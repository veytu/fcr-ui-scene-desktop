import React from 'react';
import { VolumeIndicator } from '@components/volume';
import { observer } from 'mobx-react';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { MicrophoneSelect, SpeakerSelect } from '../device-pretest/device-select';
import { Checkbox } from '@components/checkbox';
import { SvgIconEnum, SvgImg } from '@components/svg-img';

export const AudioSettings = observer(() => {
  const { deviceSettingUIStore } = useStore();
  const { localRecordingTestVolume, localPlaybackTestVolume, toggleAiDenoiser } =
    deviceSettingUIStore;

  return (
    <div className="fcr-device-settings__audio">
      <div className="fcr-device-settings__microphone">
        <div className="fcr-device-settings__label">
          <span>Microphone</span>
        </div>
        <MicrophoneSelect />
        <div className="fcr-pretest__settings__volume">
          <SvgImg type={SvgIconEnum.FCR_MUTE} />
          <VolumeIndicator value={localRecordingTestVolume} barCount={15} />
        </div>
      </div>
      <div className="fcr-device-settings__speaker">
        <div className="fcr-device-settings__label">
          <span>Speaker</span>
        </div>
        <SpeakerSelect />
        <div className="fcr-pretest__settings__volume">
          <SvgImg type={SvgIconEnum.FCR_V2_LOUDER} />
          <VolumeIndicator value={localPlaybackTestVolume} barCount={15} />
        </div>

        <Checkbox size="small" label={'AI noise reduction'} onChange={toggleAiDenoiser} />
      </div>
    </div>
  );
});
