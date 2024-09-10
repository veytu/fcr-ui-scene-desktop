import './index.css'
import AiPicImage from './assets/ai_pic.png';
import { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import { useState, useEffect } from 'react';
import { AudioVisualizer } from '../audio-visualizer';
import { useStore } from '@ui-scene/ai-people/utils/hooks/use-store';
import { IRtcUser } from '@ui-scene/ai-people/types';
import { useMultibandTrackVolume } from '@ui-scene/ai-people/utils/hooks';
import { observer } from 'mobx-react';

export const SpeakAiView = observer(() => {
    const { rtcStore:{agentRtcUser} } = useStore();
    const [remoteuser, setRemoteUser] = useState<IRtcUser>()
    
    useEffect(()=>{if(agentRtcUser){setRemoteUser(agentRtcUser)}},[agentRtcUser])
    return (
        <div className="stream-ai-container">
            <img src={AiPicImage} className='bg-image'></img>
            <div className='audio'><MicSection audioTrack={remoteuser?.audioTrack}></MicSection></div>
            <div className='name'>Agent</div>
        </div>
    );
})

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