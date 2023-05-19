import { Button } from '@components/button';
import { Dropdown } from '@components/dropdown';
import { SvgIconEnum } from '@components/svg-img';
import { getAssetURL } from '@onlineclass/utils/asset';
import { isElectron } from '@onlineclass/utils/check';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import { useMemo, useRef, useEffect } from 'react';
import pretestAudio from '@res/pretest-audio.mp3';
import { Scheduler } from 'agora-rte-sdk';

export const CameraSelect = observer(() => {
  const { deviceSettingUIStore } = useStore();
  const { cameraDevicesList, setCameraDevice, cameraDeviceId } = deviceSettingUIStore;

  return (
    <Dropdown
      options={cameraDevicesList}
      onChange={setCameraDevice}
      value={cameraDeviceId}
      placeholder={'No device'}
      disabled={cameraDevicesList.length === 0}
    />
  );
});

export const MicrophoneSelect = observer(() => {
  const { deviceSettingUIStore } = useStore();
  const { recordingDevicesList, setAudioRecordingDevice, audioRecordingDeviceId } =
    deviceSettingUIStore;

  return (
    <Dropdown
      options={recordingDevicesList}
      onChange={setAudioRecordingDevice}
      value={audioRecordingDeviceId}
      placeholder={'No device'}
      disabled={recordingDevicesList.length === 0}
    />
  );
});

export const SpeakerSelect = observer(() => {
  const { deviceSettingUIStore } = useStore();
  const {
    playbackDevicesList,
    setAudioPlaybackDevice,
    audioPlaybackDeviceId,
    isAudioPlaybackDeviceEnabled,
    startPlaybackDeviceTest,
    stopPlaybackDeviceTest,
  } = deviceSettingUIStore;

  const testAudioUrl = useMemo(() => {
    if (isElectron()) {
      return getAssetURL('pretest-audio.mp3');
    }

    return pretestAudio;
  }, []);

  const ref = useRef<Scheduler.Task>();

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
    <div className="fcr-pretest__settings__combined-item">
      <Dropdown
        options={playbackDevicesList}
        onChange={setAudioPlaybackDevice}
        value={audioPlaybackDeviceId}
        placeholder={'No device'}
        disabled={playbackDevicesList.length === 0}
      />
      <Button
        styleType="white"
        preIcon={SvgIconEnum.FCR_V2_LOUDER}
        size="S"
        shape="rounded"
        onClick={handleTest}>
        Test
      </Button>
    </div>
  );
});
