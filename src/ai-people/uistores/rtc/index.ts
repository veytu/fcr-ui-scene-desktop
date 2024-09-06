import { EduClassroomStore } from "agora-edu-core";
import AgoraRTC, {
    IAgoraRTCClient,
    IMicrophoneAudioTrack,
    IRemoteAudioTrack,
    UID,
} from "agora-rtc-sdk-ng"
import { Getters } from "../getters";
import { IChatItem, IRtcUser, ITextItem, IUserTracks, NetStateInfo, NetStateType, RtcEvents } from "../../types";
import { apiGenAgoraData } from "../../utils/request";
import { AGEventEmitter } from "./events";
import { ICameraVideoTrack } from "agora-rtc-sdk-ng"
import { paramsChatData } from "../store/reducers/global";
import { action, observable, runInAction } from 'mobx';
import { AGNetworkQuality, bound } from 'agora-rte-sdk';
import { transI18n, useI18n } from "agora-common-libs";
import NetworkBadImg from '@ui-scene/containers/status-bar/network/assets/network_bad.png';
import NetworkGoodImg from '@ui-scene/containers/status-bar/network/assets/network_good.png';
import NetworkDownImg from '@ui-scene/containers/status-bar/network/assets/network_down.png';
import { SvgIconEnum } from "@components/svg-img";

/**
 * Rtc管理store
 */
export class EduRtcStore extends AGEventEmitter<RtcEvents> {
    private _joined
    private client: IAgoraRTCClient
    private localTracks: IUserTracks
    //当前加入的用户id
    private currentJoinUserId?: number
    //当前加入的用户名称
    private currentJoinUserName?: string
    //当前加入的渠道名称
    private currentJoinUserChannel?: string

    //本地视频流
    @observable
    localVideoTrack?: ICameraVideoTrack
    //本地音频流
    @observable
    localAudioTrack?: IMicrophoneAudioTrack
    //机器人流信息
    @observable
    agentRtcUser?: IRtcUser
    //聊天消息列表
    @observable
    chatItems: IChatItem[] = []
    @observable
    netQuality: NetStateInfo = new NetStateInfo("rgba(100, 187, 92, 1)", transI18n('fcr_ai_people_tip_quality_good'), NetworkGoodImg, SvgIconEnum.FCR_V2_SIGNAL_GOOD,NetStateType.GOOD)


    constructor(store: EduClassroomStore, getters: Getters) {
        super(store, getters)
        this.addListener()
        this._joined = false
        this.localTracks = {}
        this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
        this._listenRtcEvents()
    }

    async join({ channel, userId, userName }: { channel: string; userId: number, userName: string }) {
        try {
            if (!this._joined) {
                const res = await apiGenAgoraData({ channel, userId })
                const { code, data } = res
                if (code != 0) {
                    throw new Error("Failed to get Agora token")
                }
                const { appId, token } = data
                await this.client?.join(appId, channel, token, userId)
                this.currentJoinUserId = userId
                this.currentJoinUserChannel = channel
                this.currentJoinUserName = userName;
                this._joined = true
            }
        } finally { }
        return this._joined;
    }

    async createTracks() {
        try {
            const videoTrack = await AgoraRTC.createCameraVideoTrack()
            this.localTracks.videoTrack = videoTrack
        } catch (err) {
            console.error("Failed to create video track", err)
        }
        try {
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
            this.localTracks.audioTrack = audioTrack
        } catch (err) {
            console.error("Failed to create audio track", err)
        }
        this.emit("localTracksChanged", this.localTracks)
    }

    async publish() {
        const tracks = []
        if (this.localTracks.videoTrack) {
            tracks.push(this.localTracks.videoTrack)
        }
        if (this.localTracks.audioTrack) {
            tracks.push(this.localTracks.audioTrack)
        }
        if (tracks.length) {
            await this.client.publish(tracks)
        }
    }

    // -------------- private methods --------------
    private _listenRtcEvents() {
        this.client.on("network-quality", (quality) => {
            console.log("[test] network quality data", quality)
            this.emit("networkQuality", quality)
        })
        this.client.on("user-published", async (user, mediaType) => {
            await this.client.subscribe(user, mediaType)
            if (mediaType === "audio") {
                this._playAudio(user.audioTrack)
            }
            this.emit("remoteUserChanged", {
                userId: user.uid,
                audioTrack: user.audioTrack,
                videoTrack: user.videoTrack,
            })
        })
        this.client.on("user-unpublished", async (user, mediaType) => {
            await this.client.unsubscribe(user, mediaType)
            this.emit("remoteUserChanged", {
                userId: user.uid,
                audioTrack: user.audioTrack,
                videoTrack: user.videoTrack,
            })
        })
        this.client.on("stream-message", (uid: UID, stream: any) => {
            const decoder = new TextDecoder('utf-8')
            const decodedMessage = decoder.decode(stream)
            const textstream = JSON.parse(decodedMessage)
            console.log("[test] textstream raw data", JSON.stringify(textstream))
            const { stream_id, is_final, text, text_ts, data_type } = textstream
            const textItem: ITextItem = {} as ITextItem
            textItem.uid = stream_id
            textItem.time = text_ts
            textItem.dataType = "transcribe"
            // textItem.language = culture
            textItem.text = text
            textItem.isFinal = is_final
            this.emit("textChanged", textItem)
        })
    }

    _playAudio(audioTrack: IMicrophoneAudioTrack | IRemoteAudioTrack | undefined) {
        if (audioTrack && !audioTrack.isPlaying) {
            audioTrack.play()
        }
    }

    private _resetData() {
        this.localTracks = {}
        this._joined = false
    }

    onInstall(): void {
    }
    async onDestroy(): Promise<void> {
        this.removeListener()
        this.localTracks?.audioTrack?.close()
        this.localTracks?.videoTrack?.close()
        if (this._joined) {
            await this.client?.leave()
        }
        this._resetData()
    }


    //添加监听
    private addListener() {
        this.on("localTracksChanged", this.onLocalTracksChanged)
        this.on("textChanged", this.onTextChanged)
        this.on("remoteUserChanged", this.onRemoteUserChanged)
        this.on("networkQuality", this.setNetQuality)
    }
    //移除监听
    private removeListener() {
        this.off("localTracksChanged", this.onLocalTracksChanged)
        this.off("textChanged", this.onTextChanged)
        this.off("remoteUserChanged", this.onRemoteUserChanged)
        this.off("networkQuality", this.setNetQuality)
    }

    //当前用户本地流改变
    @bound
    private onLocalTracksChanged(tracks: IUserTracks) {
        console.log("[test] onLocalTracksChanged", tracks)
        const { videoTrack, audioTrack } = tracks
        if (videoTrack) {
            this.setLocalVideoTrack(videoTrack)
        }
        if (audioTrack) {
            this.setLocalAudioTrack(audioTrack)
        }
    }
    //流文本改变
    @bound
    private onTextChanged(text: ITextItem) {
        console.log("[test] onTextChanged", text)
        if (text.dataType == "transcribe") {
            const isAgent = Number(text.uid) !== this.currentJoinUserId
            const current: IChatItem = {
                userId: text.uid,
                text: text.text,
                type: isAgent ? "agent" : "user",
                isFinal: text.isFinal,
                time: text.time,
                userName: this.currentJoinUserName
            }
            runInAction(() => {
                this.chatItems = paramsChatData(this.chatItems, current);
            });
        }
    }
    //机器人流信息
    @bound
    private onRemoteUserChanged(user: IRtcUser) {
        console.log("[test] onRemoteUserChanged", user)
        this.setAgentRtcUser(user)
    }

    @action
    private setLocalVideoTrack(track: ICameraVideoTrack) {
        this.localVideoTrack = track;
    }

    @action
    private setLocalAudioTrack(track: IMicrophoneAudioTrack) {
        this.localAudioTrack = track;
    }

    @action
    private setAgentRtcUser(user: IRtcUser) {
        this.agentRtcUser = user;
    }
    @bound
    private setNetQuality(quality: any) {
        runInAction(() => {
            //获取状态最小值
            const value = Math.min(quality.downlinkNetworkQuality, quality.uplinkNetworkQuality)
            if (value >= 6) {
                this.netQuality = new NetStateInfo('rgba(172, 172, 172, 1)', transI18n('fcr_ai_people_tip_quality_none'), NetworkDownImg, SvgIconEnum.FCR_V2_SIGNAL_NONE,NetStateType.NONE)
            } else if (value >= 3) {
                this.netQuality = new NetStateInfo("var(--fcr_mobile_ui_scene_red6, rgba(245, 101, 92, 1))", transI18n('fcr_ai_people_tip_quality_bad'), NetworkBadImg, SvgIconEnum.FCR_V2_SIGNAL_BAD_FULL,NetStateType.BAD)
            } else {
                this.netQuality = new NetStateInfo("rgba(100, 187, 92, 1)", transI18n('fcr_ai_people_tip_quality_good'), NetworkGoodImg, SvgIconEnum.FCR_V2_SIGNAL_GOOD,NetStateType.GOOD)
            }
        })
    }
}
