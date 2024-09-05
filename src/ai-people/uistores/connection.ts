import { EduUIStoreBase } from "./base";
import { reaction } from 'mobx';
import { AppDispatch, AppSelectData } from "./store";
import { apiPing, apiStartService, apiStopService } from "../utils/request";
import { setAgentConnected } from "./store/reducers/global";
import { Language, VoiceType } from "../types";
let intervalId: any

/**
 * 服务端管理store
 */
export class EduConnectionStore extends EduUIStoreBase {

    dispatch = AppDispatch
    //链接状态
    private agentConnected = false;
    //是否正在连接
    private loading = false;
    onInstall(): void {
        this.agentConnected = AppSelectData.global.agentConnected
        this._disposers.push(
            //检测渠道状态
            reaction(
                () => AppSelectData.global.options.channel,
                (channel) => {
                    if (channel) {
                        this.checkAgentConnected(channel)
                    }
                },
            ),
        );
    }
    onDestroy(): void {
        this._disposers.forEach((d) => d());
        this._disposers = [];
    }

    //开始链接
    async toConnenction(channel:string, userId:number,graphName:string, language:Language, voiceType:VoiceType) {
        if (this.loading) {
            return
        }
        this.loading = true;
        if (this.agentConnected) {
            await apiStopService(channel)
            this.dispatch(setAgentConnected(false))
            this.stopPing(channel)
        } else {
            const res = await apiStartService({
                channel,
                userId,
                graphName,
                language,
                voiceType
            })
            const { code, msg } = res || {}
            if (code != 0) {
                // if (code == "10001") {
                //     message.error("The number of users experiencing the program simultaneously has exceeded the limit. Please try again later.")
                // } else {
                //     message.error(`code:${code},msg:${msg}`)
                // }
                this.loading = false;
                throw new Error(msg)
            }
            this.dispatch(setAgentConnected(true))
            this.startPing(channel)
        }
        this.loading = false;
    }

    //检测链接
    private checkAgentConnected = async (channel:string) => {
        const res: any = await apiPing(channel)
        if (res?.code == 0) {
            this.dispatch(setAgentConnected(true))
        }
    }

    //停止ping
    private startPing(channel:string) {
        if (intervalId) {
            this.stopPing(channel)
        }
        intervalId = setInterval(() => {
            apiPing(channel)
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
