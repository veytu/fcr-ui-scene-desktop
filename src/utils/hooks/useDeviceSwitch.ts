import { AgoraRteMediaPublishState } from 'agora-rte-sdk';
import { EduStreamUI } from '../stream/struct';
import { useStore } from './use-store';

export const useDeviceSwitch = (stream?: EduStreamUI) => {
  const {
    deviceSettingUIStore: { toggleCameraDevice, toggleAudioRecordingDevice },
    classroomStore: {
      streamStore: { updateRemotePublishState },
    },
  } = useStore();
  const cameraTooltip = stream?.isVideoStreamPublished
    ? 'Turn off the camera'
    : 'Ask to turn on the camera';
  const handleCameraClick = () => {
    if (stream?.isLocal) {
      toggleCameraDevice();
    } else {
      if (stream?.isVideoStreamPublished)
        updateRemotePublishState(stream.fromUser.userUuid, stream.stream.streamUuid, {
          videoState: AgoraRteMediaPublishState.Unpublished,
        });
    }
  };

  const micTooltip = stream?.isMicStreamPublished
    ? 'Turn off the microphone'
    : 'Ask to turn on the camera';
  const handleMicrophoneClick = () => {
    if (stream?.isLocal) {
      toggleAudioRecordingDevice();
    } else {
      if (stream?.isMicStreamPublished)
        updateRemotePublishState(stream.fromUser.userUuid, stream.stream.streamUuid, {
          audioState: AgoraRteMediaPublishState.Unpublished,
        });
    }
  };
  return { cameraTooltip, micTooltip, handleCameraClick, handleMicrophoneClick };
};
