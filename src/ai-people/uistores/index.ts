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
import { AiDialogueType } from '../types';
import { AGError, bound } from 'agora-rte-sdk';
import { useStore } from '@ui-scene/utils/hooks/use-store';

export class SceneUIAiStore {
  readonly getters: Getters;
  readonly classroomStore: EduClassroomStore;
  readonly connectionStore: EduConnectionStore;
  readonly rtcStore: EduRtcStore;

  constructor() {
    this.classroomStore = EduStoreFactory.createWithType(EduRoomTypeEnum.CloudClass);
    this.getters = new Getters(this);
    this.connectionStore = new EduConnectionStore(this.classroomStore, this.getters)
    this.rtcStore = new EduRtcStore(this.classroomStore, this.getters)
  }

  @bound
  async init() {
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

    // //加人基础房间
    // const { joinClassroom } = this.classroomStore.connectionStore;
    // try {
    //   await joinClassroom({ mode: 'entry' });
    // } catch (e) {
    //   if (AGError.isOf(e as AGError, AGServiceErrorCode.SERV_CANNOT_JOIN_ROOM)) {
    //     return this.classroomStore.connectionStore.leaveClassroom(LeaveReason.kickOut);
    //   }
    //   return this.classroomStore.connectionStore.leaveClassroom(LeaveReason.leave);
    // }

    //加人对话房间
    await this.rtcStore.createTracks()
    await this.rtcStore.join({ userId: currentUserId, channel:currentChannel,userName:userName })
    await this.rtcStore.publish()

    //开启链接
    await this.connectionStore.toConnenction(currentChannel, currentUserId, AppSelectData.global.graphName, AppSelectData.global.language, AppSelectData.global.voiceType)
  }



}
