
import {
    UID,
    IAgoraRTCRemoteUser,
    IAgoraRTCClient,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
    NetworkQuality,
} from "agora-rtc-sdk-ng"
export interface ColorItem {
    active: string,
    default: string
}


export interface IOptions {
    channel: string,
    userName: string,
    userId: number
}


export interface IChatItem {
    userId: number | string,
    userName?: string,
    text: string
    type: "agent" | "user"
    isFinal?: boolean
    time: number
}


export interface ITextItem {
    dataType: "transcribe" | "translate"
    uid: string
    language: string
    time: number
    text: string
    isFinal: boolean
}

export interface GraphOptionItem {
    label: string
    value: string
}

export interface LanguageOptionItem {
    label: string
    value: Language
}


export interface VoiceOptionItem {
    label: string
    value: VoiceType
}


export interface OptionType {
    value: string;
    label: string;
}


export interface IPdfData {
    fileName: string,
    collection: string
}


export interface IRtcUser extends IUserTracks {
    userId: UID
}

export interface RtcEvents {
    remoteUserChanged: (user: IRtcUser) => void
    localTracksChanged: (tracks: IUserTracks) => void
    networkQuality: (quality: NetworkQuality) => void
    textChanged: (text: ITextItem) => void
}

export interface IUserTracks {
    videoTrack?: ICameraVideoTrack
    audioTrack?: IMicrophoneAudioTrack
}

/**
 * 老师形象
 */
export enum TeacherImageType {
    NONE = 0,//无形象
    CARTOON = 1,//卡通形象
    REAL = 2,//真人形象
}
/**
 * 教学场景
 */
export enum TeachingSceneType {
    PRACTICE_SPEAK = 0,//Ai口语对练
    FACE_TO_FACE = 1,//Ai面试
}
/**
 * 对话语言
 */
export enum AiDialogueType {
    EN_US = 0,"en-us",//英语
}

export type Language = "en-US" | "zh-CN" | "ja-JP" | "ko-KR"
export type VoiceType = "male" | "female"
