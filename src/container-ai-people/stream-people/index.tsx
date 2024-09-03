import { useEffect, useState, forwardRef, useRef, useLayoutEffect, useMemo } from "react";
import { rtcManager, IUserTracks, IRtcUser } from "./manager"
import { ITextItem } from "./types";
import { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import { makeStore } from "./store"
import { addChatItem, setRoomConnected, setVoiceType } from "./store/reducers/global";
import './index.css'
import { useMultibandTrackVolume } from "./common/hooks";
import { AudioVisualizer } from "../audio-visualizer";
import { SvgIconEnum, SvgImg } from "@components/svg-img";
import { themeVal } from "@ui-kit-utils/tailwindcss";
import { CameraSelect } from "@ui-scene/containers/device-pretest/device-select";
import { Popover } from "@components/popover";
import AgoraRTC from "agora-rtc-sdk-ng"

let hasInit = false
const colors = themeVal('colors');
export const SpeakPeopleView = () => {
    const dispatch = makeStore().dispatch
    const state = makeStore().getState()
    // const options = state.global.options
    // todo 暂时写死demo结果值
    const options = { "channel": "agora_80xtya", "userName": "test", "userId": 138967 }
    const voiceType = state.global.voiceType
    const agentConnected = state.global.agentConnected
    const { userId, channel } = options
    const [videoTrack, setVideoTrack] = useState<ICameraVideoTrack>()
    const [audioTrack, setAudioTrack] = useState<IMicrophoneAudioTrack>()
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
        rtcManager.on("localTracksChanged", onLocalTracksChanged)
        rtcManager.on("textChanged", onTextChanged)
        rtcManager.on("remoteUserChanged", onRemoteUserChanged)
        await rtcManager.createTracks()
        await rtcManager.join({
            channel,
            userId
        })
        await rtcManager.publish()
        dispatch(setRoomConnected(true))
        hasInit = true
    }

    const destory = async () => {
        console.log("[test] destory")
        rtcManager.off("textChanged", onTextChanged)
        rtcManager.off("localTracksChanged", onLocalTracksChanged)
        rtcManager.off("remoteUserChanged", onRemoteUserChanged)
        await rtcManager.destroy()
        dispatch(setRoomConnected(false))
        hasInit = false
    }

    const onRemoteUserChanged = (user: IRtcUser) => {
        console.log("[test] onRemoteUserChanged", user)
        setRemoteUser(user)
    }

    const onLocalTracksChanged = (tracks: IUserTracks) => {
        console.log("[test] onLocalTracksChanged", tracks)
        const { videoTrack, audioTrack } = tracks
        if (videoTrack) {
            setVideoTrack(videoTrack)
        }
        if (audioTrack) {
            setAudioTrack(audioTrack)
        }
    }

    const onTextChanged = (text: ITextItem) => {
        if (text.dataType == "transcribe") {
            const isAgent = Number(text.uid) != Number(userId)
            dispatch(addChatItem({
                userId: text.uid,
                text: text.text,
                type: isAgent ? "agent" : "user",
                isFinal: text.isFinal,
                time: text.time
            }))
        }
    }

    const onVoiceChange = (value: any) => {
        dispatch(setVoiceType(value))
    }

    return (
        <div className="stream-people-container">
            <LocalStreamPlayer videoTrack={videoTrack}></LocalStreamPlayer>
            {/* 操作区域 */}
            <MicCameraOptions videoTrack={videoTrack} audioTrack={audioTrack}></MicCameraOptions>
        </div>
    );
};

interface StreamPlayerProps {
    videoTrack?: ICameraVideoTrack
}
// eslint-disable-next-line react/display-name
const LocalStreamPlayer = forwardRef((props: StreamPlayerProps) => {
    const { videoTrack } = props
    const vidDiv = useRef(null)
    useLayoutEffect(() => {
        if (!videoTrack?.isPlaying) {
            videoTrack?.play(vidDiv.current!, { fit: "cover" })
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
    const [audioMute, setAudioMute] = useState(false)
    const [mediaStreamTrack, setMediaStreamTrack] = useState<MediaStreamTrack>()

    useEffect(() => {
        audioTrack?.on("track-updated", onAudioTrackupdated)
        if (audioTrack) {
            setMediaStreamTrack(audioTrack.getMediaStreamTrack())
        }

        return () => {
            audioTrack?.off("track-updated", onAudioTrackupdated)
        }
    }, [audioTrack])

    useEffect(() => {
        audioTrack?.setMuted(audioMute)
    }, [audioTrack, audioMute])

    const subscribedVolumes = useMultibandTrackVolume(mediaStreamTrack, 20);

    const onAudioTrackupdated = (track: MediaStreamTrack) => {
        console.log("[test] audio track updated", track)
        setMediaStreamTrack(track)
    }

    const onClickMute = () => {
        setAudioMute(!audioMute)
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
    videoTrack?: ICameraVideoTrack
}
const MicCameraOptions = (props: MicCameraOptionsProps) => {
    const { audioTrack, videoTrack } = props
    //是否禁用音频
    const [audioMute, setAudioMute] = useState(false)
    //是否展示了音频选择
    const [showAudioSelect, setShowAudioSelect] = useState(false)
    //是否禁用视频
    const [videoMute, setVideoMute] = useState(false)
    //是否展示了视频选择
    const [showVideoSelect, setShowVideoSelect] = useState(false)
    //音频属性列表 
    const [audioItems, setAudioItems] = useState<SelectItem[]>([DEFAULT_ITEM]);
    const [audioCurrent, setAudioCurrent] = useState<string>();
    //视频属性列表 
    const [videoItems, setVideoItems] = useState<SelectItem[]>([DEFAULT_ITEM]);
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
    }
    //视频禁用点击监听
    const onClickVideoMute = () => {
        setVideoMute(!videoMute)
    }

    return <div className="stream-people-container-options">
        <div className="volume-container">
            <MicSection audioTrack={audioTrack}></MicSection>
        </div>
        <div style={{ display: "flex", justifyContent: 'center' }}>
            <div className="mic-container mic-camera-options-container">
                <div className="status" onClick={onClickAudioMute}>
                    <SvgImg
                        className="icon"
                        size={32}
                        colors={{ iconSecondary: colors['red']['6'] }}
                        type={audioMute ? SvgIconEnum.FCR_NOMUTE : SvgIconEnum.FCR_MUTE}></SvgImg>
                    <span className="text">Mic</span>
                    <span className="line"></span>
                </div>
                <Popover
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
                </Popover>
            </div>
            <div className="camera-container mic-camera-options-container">
                <div className="status" onClick={onClickVideoMute}>
                    <SvgImg
                        className="icon"
                        size={32}
                        colors={{ iconSecondary: colors['red']['6'] }}
                        type={videoMute ? SvgIconEnum.FCR_CAMERAOFF : SvgIconEnum.FCR_CAMERA}></SvgImg>
                    <span className="text">Camera</span>
                    <span className="line"></span>
                </div>
                <Popover
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
                </Popover>
            </div>
        </div>
    </div>

}

interface SelectItem {
    label: string
    value: string
    deviceId: string
}

const DEFAULT_ITEM: SelectItem = {
    label: "Default",
    value: "default",
    deviceId: ""
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