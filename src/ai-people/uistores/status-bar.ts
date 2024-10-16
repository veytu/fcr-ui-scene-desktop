import { EduUIStoreBase } from './base';
import { computed } from 'mobx';
import { ClassState } from 'agora-edu-core';
import dayjs from 'dayjs';

export class StatusBarUIStore extends EduUIStoreBase {
  @computed
  get classroomSchedule() {
    return this.classroomStore.roomStore.classroomSchedule;
  }
  @computed get afterClass() {
    return this.classroomSchedule.state === ClassState.afterClass;
  }
  @computed
  get classStatusText() {
    const duration = this.classTimeDuration || 0;

    if (duration < 0) {
      return `-- : --`;
    }

    switch (this.classroomSchedule.state) {
      case ClassState.beforeClass:
        return `${this.formatCountDown(duration)}`;
      case ClassState.ongoing:
        return `${this.formatCountDown(duration)}`;
      case ClassState.afterClass:
        return `${this.formatCountDown(duration)}`;
      default:
        return `-- : --`;
    }
  }
  @computed
  get calibratedTime() {
    const { clockTime, clientServerTimeShift } = this.classroomStore.roomStore;
    return clockTime + clientServerTimeShift;
  }
  @computed
  get classTimeDuration(): number {
    let duration = -1;
    if (this.classroomSchedule) {
      switch (this.classroomSchedule.state) {
        case ClassState.beforeClass:
          if (this.classroomSchedule.startTime !== undefined) {
            duration = Math.max(this.classroomSchedule.startTime - this.calibratedTime, 0);
          }
          break;
        case ClassState.ongoing:
          if (this.classroomSchedule.startTime !== undefined) {
            duration = Math.max(this.calibratedTime - this.classroomSchedule.startTime, 0);
          }
          break;
        case ClassState.afterClass:
          if (
            this.classroomSchedule.startTime !== undefined &&
            this.classroomSchedule.duration !== undefined
          ) {
            duration = Math.max(this.calibratedTime - this.classroomSchedule.startTime, 0);
          }
          break;
      }
    }
    return duration;
  }
  private formatCountDown(ms: number): string {
    const duration = dayjs.duration(ms);

    if (duration.days() > 0) {
      const mmss = duration.format('mm : ss');
      const h = Math.floor(duration.asHours());
      return `${h} : ${mmss}`;
    }

    const seconds = Math.floor(ms / 1000);
    if (seconds < 60 * 60) {
      return duration.format('mm : ss');
    }

    return duration.format('HH : mm : ss');
  }
  onDestroy(): void {
    this._disposers.forEach((d) => d());
    this._disposers = [];
  }
  onInstall(): void {}
}
