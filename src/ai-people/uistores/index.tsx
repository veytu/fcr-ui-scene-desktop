import {
  AGServiceErrorCode,
  EduClassroomStore,
  EduRoomTypeEnum,
  EduStoreFactory,
  LeaveReason,
} from 'agora-edu-core';
import { Getters } from './getters';
import { EduConnectionStore } from './connection';
import { EduRtcStore } from './rtc';
import { AppDispatch, AppSelectData } from './store';
import { setGraphName, setLanguage, setOptions, setVoiceType } from './store/reducers/global';
import { getRandomChannel, getRandomUserId } from '../utils/utils';
import { AiDialogueType, NetStateType } from '../types';
import { AGError, bound } from 'agora-rte-sdk';
import { useStore } from '@ui-scene/utils/hooks/use-store';
import { action, computed, IReactionDisposer, observable, reaction, runInAction, toJS } from 'mobx';
import { ToastApi } from '@components/toast';
import AgoraRTC from "agora-rtc-sdk-ng"
import { transI18n } from 'agora-common-libs';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import loadingGif from '../container/loading/assets/circle-loading.gif';
import { StatusBarUIStore } from './status-bar';
import { NotiticationUIStore } from './notification';
import { LayoutUIStore } from './layout';

export class SceneUIAiStore {
  readonly getters: Getters;
  readonly classroomStore: EduClassroomStore;
  readonly connectionStore: EduConnectionStore;
  readonly statusBarUIStore: StatusBarUIStore;
  readonly rtcStore: EduRtcStore;
  readonly notiticationUIStore: NotiticationUIStore;
  readonly layoutUIStore: LayoutUIStore;

  constructor() {
    this.classroomStore = EduStoreFactory.createWithType(EduRoomTypeEnum.CloudClass);
    this.classroomStore.initialize();
    this.getters = new Getters(this);
    this.connectionStore = new EduConnectionStore(this.classroomStore, this.getters)
    this.rtcStore = new EduRtcStore(this.classroomStore, this.getters)
    this.statusBarUIStore = new StatusBarUIStore(this.classroomStore, this.getters);
    this.notiticationUIStore = new NotiticationUIStore(this.classroomStore, this.getters);
    this.layoutUIStore = new LayoutUIStore(this.classroomStore, this.getters);
  }

  @bound
  async init() {
    this.checkDevices()
    runInAction(() => { this.showLoading = true })
    //先初始化存储配置信息
    //@ts-ignore
    const { sessionInfo: { userUuid, userName, channel }, flexProperties } = window.EduClassroomConfig
    const currentChannel = channel ? channel : getRandomChannel()
    const currentUserId = getRandomUserId();
    AppDispatch(setOptions({
      userName,
      channel: currentChannel,
      userId: currentUserId
    }))
    //设置语言
    if (!flexProperties || !flexProperties.dialogueType || AiDialogueType.EN_US === Number(flexProperties.dialogueType)) {
      AppDispatch(setLanguage("en-US"))
    }
    //设置模式
    AppDispatch(setGraphName('camera.va.openai.azure'))
    //设置形象
    AppDispatch(setVoiceType('male'))

    //加人基础房间
    this.classroomStore.connectionStore.initialize
    const { joinClassroom } = this.classroomStore.connectionStore;
    try {
      await joinClassroom({ mode: 'entry' });
    } catch (e) {
      if (AGError.isOf(e as AGError, AGServiceErrorCode.SERV_CANNOT_JOIN_ROOM)) {
        return this.classroomStore.connectionStore.leaveClassroom(LeaveReason.kickOut);
      }
      return this.classroomStore.connectionStore.leaveClassroom(LeaveReason.leave);
    }


    //加人对话房间
    await this.rtcStore.createTracks()
    await this.rtcStore.join({ userId: currentUserId, channel: currentChannel, userName: userName })
    await this.rtcStore.publish()
    this.rtcStore.on("remoteUserChanged", () => { runInAction(() => { this.showLoading = false }) })

    //开启链接
    await this.connectAgent(currentChannel,currentUserId)
  }

  //链接重试总次数
  private connectRetrySumCount = 3;
  //链接重试当前次数
  private connectRetryCurrentCount = 0;
  //链接机器人
  private async connectAgent(currentChannel:string,currentUserId:number){
    if(this.connectRetryCurrentCount < this.connectRetrySumCount){
      const res = await this.connectionStore.toConnenction(currentChannel, currentUserId, AppSelectData.global.graphName, AppSelectData.global.language, AppSelectData.global.voiceType)
      if (res) {
        this.connectRetryCurrentCount = 0
      } else {
        this.connectRetryCurrentCount++
        await this.connectAgent(currentChannel, currentUserId)
        this.showNormalInfo(transI18n('fcr_ai_people_connect_retry', {
          reason1: this.connectRetryCurrentCount,
          reason2: this.connectRetrySumCount,
        }), true, 999999)
      }
    } else {
      this.showNormalInfo(transI18n('fcr_ai_people_connect_refresh'),false)
    }

  }

  @observable
  showLoading = false
  //上一次检查网络的时间
  private lastCheckNetTime = 0;

  //设备检查
  private async checkDevices() {
    //获取音频设备
    const micList = await AgoraRTC.getMicrophones()
    if (!micList || micList.length == 0) {
      this.showErrorInfo(transI18n('fcr_ai_people_hint_mic_none'))
    }
    //获取网络状态
    const currentTime = new Date().getTime();
    if (currentTime - this.lastCheckNetTime > 60000) {
      this.lastCheckNetTime = currentTime;
      if (!navigator.onLine) {
        //当前已离线
        this.showErrorInfo(transI18n('fcr_ai_people_net_none'))
      }
      if (NetStateType.BAD === this.rtcStore.netQuality.state) {
        //网络信号不好
        this.showErrorInfo(transI18n('fcr_ai_people_net_bad'))
      }
    }
  }

  //显示异常信息
  private showErrorInfo(info:string){
    runInAction(() => {
      ToastApi.open({
        toastProps: {
          type: 'error', content:
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <SvgImg colors={{ iconPrimary: '#fff' }} type={SvgIconEnum.FCR_TOAST_STATE_ERROR} size={24}></SvgImg>
              {info}
            </span>,
        }, duration: 99999999
      });
    })
  }
  //显示正常信息
  private showNormalInfo(info:string,loading:boolean,duration?:number){
    runInAction(() => {
      ToastApi.open({
        toastProps: {
          type: 'normal', content:
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {info}
              {loading && <img src={loadingGif} style={{ width: '24px', height: '24px',marginLeft:'5px' }} />}
            </span>,
        }, duration: duration
      });
    })
  }
}