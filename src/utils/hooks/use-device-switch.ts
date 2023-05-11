import { AgoraRteMediaPublishState } from 'agora-rte-sdk';
import { EduStreamUI } from '../stream/struct';
import { useStore } from './use-store';

export const useDeviceSwitch = (stream?: EduStreamUI) => {
  const {
    deviceSettingUIStore: { isCameraDeviceEnabled, isAudioRecordingDeviceEnabled },
    classroomStore: {
      streamStore: { updateRemotePublishState, updateLocalPublishState },
    },
  } = useStore();
  const micEnabled = stream?.isMicDeviceEnabled && stream.isMicStreamPublished;
  const cameraEnabled = stream?.isVideoDeviceEnabled && stream.isVideoStreamPublished;
  const toggleLocalCameraDevice = async () => {
    if (isCameraDeviceEnabled) {
      updateLocalPublishState({
        videoState: AgoraRteMediaPublishState.Unpublished,
      });
    } else {
      updateLocalPublishState({
        videoState: AgoraRteMediaPublishState.Published,
      });
    }
  };
  const toggleLocalAudioRecordingDevice = async () => {
    if (isAudioRecordingDeviceEnabled) {
      updateLocalPublishState({
        audioState: AgoraRteMediaPublishState.Unpublished,
      });
    } else {
      updateLocalPublishState({
        audioState: AgoraRteMediaPublishState.Published,
      });
    }
  };
  const cameraTooltip = stream?.isVideoStreamPublished
    ? 'Turn off the camera'
    : 'Request to start video';
  const handleCameraClick = () => {
    if (stream?.isLocal) {
      toggleLocalCameraDevice();
    } else {
      if (stream) {
        updateRemotePublishState(stream.fromUser.userUuid, stream.stream.streamUuid, {
          videoState: stream.isVideoStreamPublished
            ? AgoraRteMediaPublishState.Unpublished
            : AgoraRteMediaPublishState.Published,
        });
      }
    }
  };

  const micTooltip = stream?.isMicStreamPublished ? 'Turn off the microphone' : 'Request to unmute';
  const handleMicrophoneClick = () => {
    if (stream?.isLocal) {
      toggleLocalAudioRecordingDevice();
    } else {
      if (stream)
        updateRemotePublishState(stream.fromUser.userUuid, stream.stream.streamUuid, {
          audioState: stream.isMicStreamPublished
            ? AgoraRteMediaPublishState.Unpublished
            : AgoraRteMediaPublishState.Published,
        });
    }
  };
  return {
    cameraTooltip,
    micTooltip,
    micEnabled,
    cameraEnabled,
    handleCameraClick,
    handleMicrophoneClick,
    toggleLocalAudioRecordingDevice,
    toggleLocalCameraDevice,
  };
};
