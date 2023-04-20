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
      if (stream)
        updateRemotePublishState(stream.fromUser.userUuid, stream.stream.streamUuid, {
          videoState: stream.isVideoStreamPublished
            ? AgoraRteMediaPublishState.Unpublished
            : AgoraRteMediaPublishState.Published,
        });
    }
  };

  const micTooltip = stream?.isMicStreamPublished
    ? 'Turn off the microphone'
    : 'Ask to turn on the microphone';
  const handleMicrophoneClick = () => {
    if (stream?.isLocal) {
      toggleAudioRecordingDevice();
    } else {
      if (stream)
        updateRemotePublishState(stream.fromUser.userUuid, stream.stream.streamUuid, {
          audioState: stream.isMicStreamPublished
            ? AgoraRteMediaPublishState.Unpublished
            : AgoraRteMediaPublishState.Published,
        });
    }
  };
  return { cameraTooltip, micTooltip, handleCameraClick, handleMicrophoneClick };
};
