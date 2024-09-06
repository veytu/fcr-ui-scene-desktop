import { EduClassroomStore } from "agora-edu-core";
import AgoraRTC, {
    IAgoraRTCClient,
    IMicrophoneAudioTrack,
    IRemoteAudioTrack,
    UID,
} from "agora-rtc-sdk-ng"
import { Getters } from "../getters";
import { IChatItem, IRtcUser, ITextItem, IUserTracks, RtcEvents } from "../../types";
import { apiGenAgoraData } from "../../utils/request";
import { AGEventEmitter } from "./events";
import { ICameraVideoTrack } from "agora-rtc-sdk-ng"
import { AppDispatch, AppSelectData } from "../store";
import { addChatItem, paramsChatData } from "../store/reducers/global";
import { action, computed, IReactionDisposer, observable, reaction, runInAction, toJS } from 'mobx';
import { bound } from 'agora-rte-sdk';

/**
 * Rtc管理store
 */
export class EduRtcStore extends AGEventEmitter<RtcEvents> {
    private _joined
    private client: IAgoraRTCClient
    private localTracks: IUserTracks
    //当前加入的用户id
    private currentJoinUserId?:number
    //当前加入的用户名称
    private currentJoinUserName?:string
    //当前加入的渠道名称
    private currentJoinUserChannel?:string

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
    chatItems:IChatItem[] = []


    constructor(store: EduClassroomStore, getters: Getters) {
        super(store, getters)
        this.addListener()
        this._joined = false
        this.localTracks = {}
        this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
        this._listenRtcEvents()
    }

    async join({ channel, userId,userName }: { channel: string; userId: number,userName:string }) {
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
    }
    //移除监听
    private removeListener() {
        this.off("localTracksChanged", this.onLocalTracksChanged)
        this.off("textChanged", this.onTextChanged)
        this.off("remoteUserChanged", this.onRemoteUserChanged)
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
            const current:IChatItem = {
                userId: text.uid,
                text: text.text,
                type: isAgent ? "agent" : "user",
                isFinal: text.isFinal,
                time: text.time,
                userName:this.currentJoinUserName
            }
            runInAction(() => {
                this.chatItems = paramsChatData(this.chatItems,current);
                // AppDispatch(addChatItem(current))
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
}
