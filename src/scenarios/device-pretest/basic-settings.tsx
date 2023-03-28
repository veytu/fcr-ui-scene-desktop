import { Button } from '@onlineclass/components/button';
import { Dropdown } from '@onlineclass/components/dropdown';
import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react-lite';

export const BasicSettings = observer(() => {
  const { deviceSettingUIStore } = useStore();

  const {
    cameraDevicesList,
    recordingDevicesList,
    playbackDevicesList,
    setCameraDevice,
    setRecordingDevice,
    setPlaybackDevice,
    cameraDeviceId,
    recordingDeviceId,
    playbackDeviceId,
  } = deviceSettingUIStore;

  return (
    <div className="fcr-pretest-settings">
      <div className="fcr-pretest__settings__item">
        <span className="fcr-pretest__settings__label">Camera</span>
        <Dropdown options={cameraDevicesList} onChange={setCameraDevice} value={cameraDeviceId} />
      </div>
      <div className="fcr-pretest__settings__item">
        <span className="fcr-pretest__settings__label">Microphone</span>
        <Dropdown
          options={recordingDevicesList}
          onChange={setRecordingDevice}
          value={recordingDeviceId}
        />
      </div>
      <div className="fcr-pretest__settings__item">
        <span className="fcr-pretest__settings__label">Speaker</span>
        <div className="fcr-pretest__settings__combined-item">
          <Dropdown
            options={playbackDevicesList}
            onChange={setPlaybackDevice}
            value={playbackDeviceId}
          />
          <Button preIcon={SvgIconEnum.FCR_V2_LOUDER} size="S" shape="rounded">
            Test
          </Button>
        </div>
      </div>
    </div>
  );
});
