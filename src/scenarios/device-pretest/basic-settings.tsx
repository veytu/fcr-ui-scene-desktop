import { Button } from '@onlineclass/components/button';
import { Checkbox } from '@onlineclass/components/checkbox';
import { Dropdown } from '@onlineclass/components/dropdown';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react-lite';
import { VolumeIndicator } from './volume-indicator';

export const BasicSettings = observer(() => {
  const { deviceSettingUIStore } = useStore();

  const {
    cameraDevicesList,
    recordingDevicesList,
    playbackDevicesList,
    setCameraDevice,
    setAudioRecordingDevice,
    setAudioPlaybackDevice,
    cameraDeviceId,
    audioRecordingDeviceId,
    audioPlaybackDeviceId,
  } = deviceSettingUIStore;

  return (
    <div className="fcr-pretest-settings">
      <div className="fcr-pretest__settings__item">
        <span className="fcr-pretest__settings__label">Camera</span>
        <Dropdown
          options={cameraDevicesList}
          onChange={setCameraDevice}
          value={cameraDeviceId}
          placeholder={'No device'}
          disabled={cameraDevicesList.length === 0}
        />
      </div>
      <div className="fcr-pretest__settings__item">
        <div className="fcr-pretest__settings__label">
          <span>Microphone</span>
          <Checkbox />
          <span>AI noise reduction</span>
          <SvgImg type={SvgIconEnum.FCR_MUTE} />
          <VolumeIndicator value={4} />
        </div>
        <Dropdown
          options={recordingDevicesList}
          onChange={setAudioRecordingDevice}
          value={audioRecordingDeviceId}
          placeholder={'No device'}
          disabled={recordingDevicesList.length === 0}
        />
      </div>
      <div className="fcr-pretest__settings__item">
        <div className="fcr-pretest__settings__label">
          <span>Speaker</span>
          <SvgImg type={SvgIconEnum.FCR_V2_LOUDER} />
          <VolumeIndicator value={4} />
        </div>
        <div className="fcr-pretest__settings__combined-item">
          <Dropdown
            options={playbackDevicesList}
            onChange={setAudioPlaybackDevice}
            value={audioPlaybackDeviceId}
            placeholder={'No device'}
            disabled={playbackDevicesList.length === 0}
          />
          <Button preIcon={SvgIconEnum.FCR_V2_LOUDER} size="S" shape="rounded">
            Test
          </Button>
        </div>
      </div>
    </div>
  );
});
