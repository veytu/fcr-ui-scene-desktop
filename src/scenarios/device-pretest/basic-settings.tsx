import { Button } from '@onlineclass/components/button';
import { Checkbox } from '@onlineclass/components/checkbox';
import { Dropdown } from '@onlineclass/components/dropdown';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { getAssetURL } from '@onlineclass/utils/asset';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef } from 'react';
import { VolumeIndicator } from './volume-indicator';
import pretestAudio from '@res/pretest-audio.mp3';
import { isElectron } from '@onlineclass/type';
import { Scheduler } from 'agora-rte-sdk';

export const BasicSettings = observer(() => {
  const { deviceSettingUIStore } = useStore();

  const ref = useRef<Scheduler.Task>();

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
    localRecordingTestVolume,
    localPlaybackTestVolume,
    startPlaybackDeviceTest,
    stopPlaybackDeviceTest,
    isAudioPlaybackDeviceEnabled,
  } = deviceSettingUIStore;

  const testAudioUrl = useMemo(() => {
    if (isElectron()) {
      return getAssetURL('pretest-audio.mp3');
    }

    return pretestAudio;
  }, []);

  const handleTest = () => {
    if (ref.current) return;
    if (!isAudioPlaybackDeviceEnabled) return;
    ref.current = Scheduler.shared.addDelayTask(() => {
      stopPlaybackDeviceTest();
      ref.current = undefined;
    }, Scheduler.Duration.second(3));
    startPlaybackDeviceTest(testAudioUrl);
  };

  useEffect(() => {
    return () => {
      ref.current?.stop();
      ref.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (!isAudioPlaybackDeviceEnabled) {
      stopPlaybackDeviceTest();
    }
  }, [isAudioPlaybackDeviceEnabled]);

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
          <span className="fcr-pretest__settings__label-title">Microphone</span>
          <Checkbox size="small" label={'AI noise reduction'} />
          <SvgImg
            type={SvgIconEnum.FCR_MUTE}
            colors={{ iconPrimary: 'currentColor', iconSecondary: 'currentColor' }}
          />
          <VolumeIndicator value={localRecordingTestVolume} />
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
          <span className="fcr-pretest__settings__label-title">Speaker</span>
          <SvgImg type={SvgIconEnum.FCR_V2_LOUDER} colors={{ iconPrimary: 'currentColor' }} />
          <VolumeIndicator value={localPlaybackTestVolume} />
        </div>
        <div className="fcr-pretest__settings__combined-item">
          <Dropdown
            options={playbackDevicesList}
            onChange={setAudioPlaybackDevice}
            value={audioPlaybackDeviceId}
            placeholder={'No device'}
            disabled={playbackDevicesList.length === 0}
          />
          <Button preIcon={SvgIconEnum.FCR_V2_LOUDER} size="S" shape="rounded" onClick={handleTest}>
            Test
          </Button>
        </div>
      </div>
    </div>
  );
});
