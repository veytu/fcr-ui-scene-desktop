import { EduUIStoreBase } from "./base";
import { apiPing, apiStartService, apiStopService } from "../utils/request";
import { Language, VoiceType } from "../types";
let intervalId: any

/**
 * 服务端管理store
 */
export class EduConnectionStore extends EduUIStoreBase {
    //链接状态
    private agentConnected = false;
    //是否正在连接
    private loading = false;
    //当前加入的用户id
    private currentJoinUserId?: number
    //当前加入的用户名称
    private currentJoinUserName?: string
    //当前加入的渠道名称
    private currentJoinUserChannel?: string

    onInstall(): void {
    }
    onDestroy(): void {
        this.disConnection()
        this._disposers.forEach((d) => d());
        this._disposers = [];
    }

    //取消链接
    async disConnection(){
        if (this.agentConnected && this.currentJoinUserChannel) {
            await apiStopService(this.currentJoinUserChannel)
            this.stopPing(this.currentJoinUserChannel)
        }
    }

    //开始链接
    async toConnenction(channel:string, userId:number,graphName:string, language:Language, voiceType:VoiceType) {
        if (this.loading) {
            return
        }
        this.currentJoinUserChannel =channel;
        this.currentJoinUserId = userId;
        this.loading = true;
        if(!this.agentConnected){
            const res = await apiStartService({channel,userId,graphName,language,voiceType})
            const { code, msg } = res || {}
            if (code != 0) {
                this.loading = false;
                return false
            }
            return true;
        }
        this.loading = false;
        return true;
    }

    //检测链接
    private checkAgentConnected = async (channel:string) => {
        const res: any = await apiPing(channel)
        if (res?.code == 0) {
            // this.dispatch(setAgentConnected(true))
        }
    }

    //停止ping
     startPing(channel:string) {
        if (intervalId) {
            this.stopPing(channel)
        }
        intervalId = setInterval(() => {
            //@ts-ignore
            apiPing(window.EduClassroomConfig.sessionInfo.channel)
        }, 3000)
    }

    //开始ping
    private stopPing(channel:string) {
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
        }
    }
}
