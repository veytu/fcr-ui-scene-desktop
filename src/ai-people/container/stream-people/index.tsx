import { useEffect, useState, forwardRef, useRef, useLayoutEffect } from "react";
import { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import { SvgIconEnum, SvgImg } from "@components/svg-img";
import { themeVal } from "@ui-kit-utils/tailwindcss";
import { Popover } from "@components/popover";
import AgoraRTC from "agora-rtc-sdk-ng"
import { useStore } from "@ui-scene/ai-people/utils/hooks/use-store";
import { useMultibandTrackVolume } from "@ui-scene/ai-people/utils/hooks";
import { AudioVisualizer } from "../audio-visualizer";
import './index.css'
import { observer } from "mobx-react";

const colors = themeVal('colors');
export const SpeakPeopleView = observer(() => {
    const { rtcStore: { localAudioTrack, localVideoTrack } } = useStore();
    const [videoTrack, setVideoTrack] = useState<ICameraVideoTrack>()
    const [audioTrack, setAudioTrack] = useState<IMicrophoneAudioTrack>()
    //是否禁用音频
    const [audioMute, setAudioMute] = useState(false)
    //是否禁用视频
    const [videoMute, setVideoMute] = useState(false)

    //监听处理
    useEffect(() => { if (localAudioTrack) { setAudioTrack(localAudioTrack) } }, [localAudioTrack])
    useEffect(() => { if (localVideoTrack) { setVideoTrack(localVideoTrack) } }, [localVideoTrack])

    return (
        <div className="stream-people-container">
            <LocalStreamPlayer videoTrack={videoTrack}></LocalStreamPlayer>
            {(videoMute || !videoTrack) && <div className="name">You</div>}
            {/* 操作区域 */}
            <MicCameraOptions videoTrack={videoTrack} audioTrack={audioTrack}
                videoMute={videoMute} audioMute={audioMute}
                setAudioMute={setAudioMute} setVideoMute={setVideoMute}></MicCameraOptions>
        </div>
    );
})

interface StreamPlayerProps {
    videoTrack?: ICameraVideoTrack
}
// eslint-disable-next-line react/display-name
const LocalStreamPlayer = observer((props: StreamPlayerProps) => {
    const { videoTrack } = props
    const vidDiv = useRef(null)
    useLayoutEffect(() => {
        if (!videoTrack?.isPlaying && vidDiv.current) {
            videoTrack?.play(vidDiv.current, { fit: "cover" })
        }
        return () => {
            videoTrack?.stop()
        }
    }, [videoTrack])


    return <div style={{ width: '100%', height: '100%' }} className="stream-people-container-video" ref={vidDiv}></div>
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
        type="user"
        barWidth={5}
        minBarHeight={5}
        maxBarHeight={40}
        frequencies={subscribedVolumes}
        borderRadius={5}
        gap={3}></AudioVisualizer>
}

interface MicCameraOptionsProps {
    audioTrack?: IMicrophoneAudioTrack
    videoTrack?: ICameraVideoTrack,
    audioMute: boolean,
    setAudioMute: any,
    videoMute: boolean,
    setVideoMute: any,
}
const MicCameraOptions = (props: MicCameraOptionsProps) => {
    const { audioTrack, videoTrack, audioMute, setAudioMute, videoMute, setVideoMute } = props
    //是否展示了音频选择
    const [showAudioSelect, setShowAudioSelect] = useState(false)
    //是否展示了视频选择
    const [showVideoSelect, setShowVideoSelect] = useState(false)
    //音频属性列表 
    const [audioItems, setAudioItems] = useState<SelectItem[]>([]);
    const [audioCurrent, setAudioCurrent] = useState<string>();
    //视频属性列表 
    const [videoItems, setVideoItems] = useState<SelectItem[]>([]);
    const [videoCurrent, setVideoCurrent] = useState<string>();



    //音频流监听
    useEffect(() => {
        if (audioTrack) {
            const label = audioTrack?.getTrackLabel();
            setAudioCurrent(label);
            AgoraRTC.getMicrophones().then(arr => {
                setAudioItems(arr.map(item => ({
                    label: item.label,
                    value: item.label,
                    deviceId: item.deviceId
                })));
            });
        }
    }, [audioTrack]);
    //音频选择回调
    const onChangeAudio = async (target: SelectItem) => {
        setAudioCurrent(target.value);
        setShowAudioSelect(false)
        if (audioTrack) {
            await audioTrack.setDevice(target.deviceId);
        }
    }
    //视频流监听
    useEffect(() => {
        if (videoTrack) {
            const label = videoTrack?.getTrackLabel();
            setVideoCurrent(label);
            AgoraRTC.getCameras().then(arr => {
                setVideoItems(arr.map(item => ({
                    label: item.label,
                    value: item.label,
                    deviceId: item.deviceId
                })));
            });
        }
    }, [videoTrack]);
    //视频选择回调
    const onChangeVideo = async (target: SelectItem) => {
        setVideoCurrent(target.value);
        setShowVideoSelect(false)
        if (videoTrack) {
            await videoTrack.setDevice(target.deviceId);
        }
    }

    //音频状态监听
    useEffect(() => {
        audioTrack?.setMuted(audioMute)
    }, [audioTrack, audioMute])
    //视频状态监听
    useEffect(() => {
        videoTrack?.setMuted(videoMute)
    }, [videoTrack, videoMute])
    //音频禁用点击监听
    const onClickAudioMute = () => {
        setAudioMute(!audioMute)
        audioTrack?.setMuted(audioMute)
    }
    //视频禁用点击监听
    const onClickVideoMute = () => {
        setVideoMute(!videoMute)
        videoTrack?.setMuted(videoMute)
    }
    //是否有音视频设备
    const haveAudio = audioItems.length > 0;
    const haveVideo = videoItems.length > 0;
    return <div className="stream-people-container-options" style={{ background: audioMute || !haveAudio ? 'none' : 'rgba(35, 37, 43, 0.2)' }}>
        <div className="volume-container" style={{ display: audioMute || !haveAudio ? 'none' : 'flex' }}>
            <MicSection audioTrack={audioTrack}></MicSection>
        </div>
        <div style={{ display: "flex", justifyContent: 'center' }}>
            <div className="mic-container mic-camera-options-container">
                <div className="status" onClick={onClickAudioMute}>
                    <SvgImg
                        className="icon"
                        size={32}
                        colors={{ iconSecondary: colors['red']['6'] }}
                        type={!haveAudio ? SvgIconEnum.FCR_ICON_MIC_NONE : (audioMute ? SvgIconEnum.FCR_ICON_MIC_DISABLE : SvgIconEnum.FCR_ICON_MIC_ENABLE)}></SvgImg>
                    <span className="text" style={{color: haveAudio ? 'var(--fcr_ui_scene_white10, rgba(255, 255, 255, 1))': 'rgba(255, 255, 255, 0.8)'}}>Mic</span>
                    {audioItems.length > 0 && <span className="line"></span>}
                </div>
                {audioItems.length > 0 && <Popover
                    onVisibleChange={(value) => {
                        setShowAudioSelect(value)
                    }}
                    overlayInnerStyle={{ width: 'unset', padding: '14px 11px' }}
                    showArrow={true}
                    content={<Select items={audioItems} value={audioCurrent} change={onChangeAudio} title="Mic"></Select>}
                    trigger="click">
                    <div className="more" style={{ background: showAudioSelect ? 'rgba(70, 71, 71, 1)' : 'transparent' }}>
                        <SvgImg
                            size={20}
                            colors={{ iconSecondary: colors['red']['6'] }}
                            type={showAudioSelect ? SvgIconEnum.FCR_DOWN : SvgIconEnum.FCR_UP}></SvgImg>
                    </div>
                </Popover>}
            </div>
            <div className="camera-container mic-camera-options-container">
                <div className="status" onClick={onClickVideoMute}>
                    <SvgImg
                        className="icon"
                        size={32}
                        colors={{ iconSecondary: colors['red']['6'] }}
                        type={!haveVideo ? SvgIconEnum.FCR_ICON_CAMERA_NONE : (videoMute ? SvgIconEnum.FCR_ICON_CAMERA_DISABLE : SvgIconEnum.FCR_ICON_CAMERA_ENABLE)}></SvgImg>
                    <span className="text" style={{color: haveVideo ? 'var(--fcr_ui_scene_white10, rgba(255, 255, 255, 1))': 'rgba(255, 255, 255, 0.8)'}}>Camera</span>
                    {videoItems.length > 0 && <span className="line"></span>}
                </div>
                {videoItems.length > 0 && <Popover
                    onVisibleChange={(value) => {
                        setShowVideoSelect(value)
                    }}
                    overlayInnerStyle={{ width: 'unset', padding: '14px 11px' }}
                    showArrow={true}
                    content={<Select items={videoItems} value={videoCurrent} change={onChangeVideo} title="Camera"></Select>}
                    trigger="click">
                    <div className="more" style={{ background: showVideoSelect ? 'rgba(70, 71, 71, 1)' : 'transparent' }}>
                        <SvgImg
                            size={20}
                            colors={{ iconSecondary: colors['red']['6'] }}
                            type={showVideoSelect ? SvgIconEnum.FCR_DOWN : SvgIconEnum.FCR_UP}></SvgImg>
                    </div>
                </Popover>}
            </div>
        </div>
    </div>

}

interface SelectItem {
    label: string
    value: string
    deviceId: string
}
const Select = ({ items, change, value, title }: { items: SelectItem[], change: any, value: string | undefined, title: string }) => {
    const onChange = async (target: SelectItem) => {
        if (target) {
            change(target)
        }
    }
    return <div>
        <div className="mic-camera-options-select-title ">{title}</div>
        {
            items.map((item, index) => {
                return <div key={index} className="mic-camera-options-select-item" onClick={() => { onChange(item) }}>
                    <div className="icon">
                        <SvgImg
                            style={{ display: item.value === value ? 'flex' : 'none' }}
                            size={16}
                            type={SvgIconEnum.FCR_CHECKBOX_CHECK}></SvgImg>
                    </div>
                    <span>{item.label}</span>
                </div>
            })
        }
    </div>
}