import { EduClassroomConfig, EduRoleTypeEnum } from 'agora-edu-core';
import { SceneUIAiStore } from '.';

export class Getters {
  constructor(private _classroomUIStore: SceneUIAiStore) { }

  get classroomUIStore() {
    return this._classroomUIStore;
  }
  get isTeacher() {
    return EduClassroomConfig.shared.sessionInfo.role === EduRoleTypeEnum.teacher;
  }
  get isAssistant() {
    return EduClassroomConfig.shared.sessionInfo.role === EduRoleTypeEnum.assistant;
  }
  get isHost() {
    return this.isTeacher || this.isAssistant;
  }
}
