import { EduStream } from 'agora-edu-core';
import { AgoraRteVideoSourceType, AGRtcState, bound, Scheduler } from 'agora-rte-sdk';
import { action, computed, observable, runInAction } from 'mobx';
import { EduUIStoreBase } from './base';

export class StreamUIStore extends EduUIStoreBase {
  // private static readonly PAGE_SIZE_BY_MODE = {
  //   [ViewMode.Divided]: 20,
  //   [ViewMode.Surrounded]: 8,
  // };
  subSet = new Set<string>();

  @observable
  waitingSub: EduStream[] = [];
  @observable
  doneSub: EduStream[] = [];
  @observable
  quitSub: EduStream[] = [];
  private _subscribeTask?: Scheduler.Task;
  private _videoDoms = new Map<string, HTMLDivElement>();
  @computed
  get cameraUIStreams() {
    return this.getters.cameraUIStreams;
  }
  @action.bound
  subscribeMass(streams: EduStream[]) {
    const subst = streams.filter((s) => {
      return !s.isLocal;
    });
    this.waitingSub = subst;
  }
  @bound
  updateVideoDom(streamUuid: string, dom: HTMLDivElement) {
    this._videoDoms.set(streamUuid, dom);
  }

  @bound
  removeVideoDom(streamUuid: string) {
    this._videoDoms.delete(streamUuid);
  }
  @bound
  private async _handleSubscribe() {
    if (this.classroomStore.connectionStore.rtcState !== AGRtcState.Connected) {
      return;
    }

    // 页面上显示的视频创列表
    const waitingSub = this.waitingSub.slice();
    // timer休眠时退出的用户
    const quitSub = this.quitSub.slice();

    // 过滤掉timer休眠时退出的用户
    let doneSub = this.doneSub.filter((s) => {
      return !quitSub.includes(s);
    });
    // 先清空列表
    runInAction(() => {
      this.quitSub = [];
    });
    // 已订阅 diff 当前页面视频列表 = 需要取消订阅的流列表
    const toUnsub = doneSub
      .filter((stream) => {
        return !waitingSub.includes(stream);
      })
      .concat(quitSub);
    // 当前页面视频列表 diff 已订阅 = 需要订阅的流列表
    const toSub = waitingSub.filter((stream) => {
      return !doneSub.includes(stream);
    });

    const { muteRemoteVideoStreamMass, setupRemoteVideo, setRemoteVideoStreamType } =
      this.classroomStore.streamStore;

    if (toUnsub.length) {
      await muteRemoteVideoStreamMass(toUnsub, true);
      toUnsub.forEach(({ streamUuid }) => {
        this.subSet.delete(streamUuid);
      });

      // 从已订阅列表移除
      doneSub = doneSub.filter((stream) => {
        return !toUnsub.includes(stream);
      });
    }

    let subList: string[] = [];
    if (toSub.length) {
      // 订阅成功的列表
      subList = (await muteRemoteVideoStreamMass(toSub, false)) || [];
      subList.forEach((streamUuid) => {
        this.subSet.add(streamUuid);
      });

      // 取到流对象
      const newSub = toSub.filter(({ streamUuid }) => {
        return subList.includes(streamUuid);
      });

      // await Promise.all(
      //   newSub.map(async (stream) => {
      //     const streamType =
      //       stream.fromUser.userUuid === this.pinnedUser
      //         ? AGRemoteVideoStreamType.HIGH_STREAM
      //         : AGRemoteVideoStreamType.LOW_STREAM;
      //     // 根据是否被pin设置大小流
      //     await setRemoteVideoStreamType(stream.streamUuid, streamType);
      //   }),
      // );
      // 加入已订阅
      doneSub = doneSub.concat(newSub);
    }

    // 重新渲染视频流
    doneSub.forEach((stream) => {
      const dom = this._videoDoms.get(stream.streamUuid);
      if (dom) {
        const needMirror = stream.videoSourceType !== AgoraRteVideoSourceType.ScreenShare;
        setupRemoteVideo(stream, dom, needMirror);
      }
    });
    // 更新已订阅列表
    runInAction(() => {
      this.doneSub = doneSub;
    });
  }

  onDestroy(): void {
    this._subscribeTask?.stop();
  }
  onInstall(): void {
    this._subscribeTask = Scheduler.shared.addPollingTask(
      this._handleSubscribe,
      Scheduler.Duration.second(1),
    );
  }
}
