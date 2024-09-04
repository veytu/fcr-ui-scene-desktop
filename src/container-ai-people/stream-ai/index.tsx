import './index.css'
import AiPicImage from '@ui-scene/container-ai-people/stream-ai/assets/ai_pic.png';
import { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import { useState, useEffect } from 'react';
import { AudioVisualizer } from '../audio-visualizer';
import { useMultibandTrackVolume } from '../stream-people/common/hooks';
import { rtcManager, IRtcUser } from '../stream-people/manager';

let hasInit = false
export const SpeakAiView = () => {
    // todo 暂时写死demo结果值
    const options = { "channel": "agora_80xtya", "userName": "test", "userId": 138967 }
    const [remoteuser, setRemoteUser] = useState<IRtcUser>()
    useEffect(() => {
        if (!options.channel) {
            return
        }
        if (hasInit) {
            return
        }

        init()

        return () => {
            if (hasInit) {
                destory()
            }
        }
    }, [options.channel])


    const init = async () => {
        console.log("[test] init")
        rtcManager.on("remoteUserChanged", onRemoteUserChanged)
        hasInit = true
    }

    const destory = async () => {
        console.log("[test] destory")
        rtcManager.off("remoteUserChanged", onRemoteUserChanged)
        hasInit = false
    }

    const onRemoteUserChanged = (user: IRtcUser) => {
        console.log("[test] onRemoteUserChanged", user)
        debugger
        setRemoteUser(user)
    }

    return (
        <div className="stream-ai-container">
            <img src={AiPicImage} className='bg-image'></img>
            <div className='audio'><MicSection audioTrack={remoteuser?.audioTrack}></MicSection></div>
            <div className='name'>Agent</div>
        </div>
    );
};


interface MicSectionProps {
    audioTrack?: IMicrophoneAudioTrack
}

const MicSection = (props: MicSectionProps) => {
    const { audioTrack } = props
    const [mediaStreamTrack, setMediaStreamTrack] = useState<MediaStreamTrack>()

    useEffect(() => {
        //@ts-ignore
        audioTrack?.on("track-updated", onAudioTrackupdated)
        if (audioTrack) {
            setMediaStreamTrack(audioTrack.getMediaStreamTrack())
        }

        return () => {
            audioTrack?.off("track-updated", onAudioTrackupdated)
        }
    }, [audioTrack])

    const subscribedVolumes = useMultibandTrackVolume(mediaStreamTrack, 20);

    const onAudioTrackupdated = (track: MediaStreamTrack) => {
        console.log("[test] audio track updated", track)
        setMediaStreamTrack(track)
    }

    return <AudioVisualizer
        type="agent"
        barWidth={5}
        minBarHeight={9}
        maxBarHeight={53}
        frequencies={subscribedVolumes}
        borderRadius={5}
        gap={3}></AudioVisualizer>
}