import { EduClassroomConfig, EduClassroomStore } from 'agora-edu-core';

export class Getters {
  get roomName() {
    return EduClassroomConfig.shared.sessionInfo.roomName;
  }
  get roomUuid() {
    return EduClassroomConfig.shared.sessionInfo.roomUuid;
  }
  constructor(private _classroomStore: EduClassroomStore) {}
}
