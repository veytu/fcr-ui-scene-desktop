import { EduRoleTypeEnum, EduRoomTypeEnum } from 'agora-edu-core';
import { AgoraLatencyLevel } from 'agora-rte-sdk';
import { FcrMultiThemeMode } from 'agora-common-libs';

/**
 * 启动参数
 */
/** @en
 * Options to launch SDK
 */
export type LaunchOption = {
  /**
   * 用户uuid
   */
  /** @en
   *
   */
  userUuid: string;
  /**
   * 用户昵称
   */
  /** @en
   *
   */
  userName: string;
  /**
   * 房间uuid
   */
  /** @en
   *
   */
  roomUuid: string;
  /**
   * 角色
   */
  /** @en
   *
   */
  roleType: EduRoleTypeEnum;
  /**
   * 房间类型
   */
  /** @en
   *
   */
  roomType: EduRoomTypeEnum;
  /**
   * 房间名称
   */
  /** @en
   *
   */
  roomName: string;
  /**
   * 开启设备检测
   */
  /** @en
   *
   */
  pretest: boolean;
  /**
   * rtmToken
   */
  /** @en
   *
   */
  rtmToken: string;
  /**
   * 语言
   */
  /** @en
   *
   */
  language: LanguageEnum;
  /**
   * 开始时间（单位：毫秒）
   */
  /** @en
   *
   */
  startTime?: number; //
  /**
   * 房间时长（单位：秒）
   */
  /** @en
   *
   */
  duration: number;
  /**
   * 公共课件列表
   */
  /** @en
   *
   */
  courseWareList: CoursewareList;
  /**
   * 用户自定义属性
   */
  /** @en
   *
   */
  userFlexProperties?: { [key: string]: unknown };
  /**
   * 延迟等级
   */
  /** @en
   *
   */
  latencyLevel?: AgoraLatencyLevel;
  /**
   * 录制页面地址
   */
  /** @en
   *
   */
  recordUrl?: string;
  /**
   * 录制重试间隔
   */
  /** @en
   *
   */
  recordRetryTimeout?: number;
  /**
   * UI主题
   */
  /** @en
   *
   */
  uiMode?: FcrMultiThemeMode;
  /**
   * 分享链接
   */
  /** @en
   *
   */
  shareUrl?: string;
  /**
   * 虚拟背景图片
   */
  /** @en
   *
   */
  virtualBackgroundImages?: string[];
  /**
   * 虚拟背景视频
   */
  /** @en
   *
   */
  virtualBackgroundVideos?: string[];
  /**
   * WebRTC 扩展插件包路径前缀
   */
  /** @en
   *
   */
  webrtcExtensionBaseUrl?: string;
};

/**
 * 支持的语言
 */
/** @en
 *
 */
export type LanguageEnum = 'en' | 'zh';

/**
 * 课件页信息
 */
/** @en
 *
 */
export type CoursewarePageInfo = {
  /**
   * 预览图
   */
  /** @en
   *
   */
  preview?: string;
  /**
   * 图片资源链接
   */
  /** @en
   *
   */
  src: string;
  /**
   * 图片资源宽度
   */
  /** @en
   *
   */
  width: number;
  /**
   * 图片资源高度
   */
  /** @en
   *
   */
  height: number;
};

/**
 * 课件信息
 */
/** @en
 *
 */
export type CoursewareItem = {
  /**
   * 课件名称
   */
  /** @en
   *
   */
  name: string;
  /**
   * 课件资源链接
   */
  /** @en
   *
   */
  url?: string;
  /**
   * 课件大小
   */
  /** @en
   *
   */
  size?: number;
  /**
   * 更新时间
   */
  /** @en
   *
   */
  updateTime?: number;
  /**
   * 课件转换ID
   */
  /** @en
   *
   */
  taskUuid?: string;
  /**
   * 课件资源列表
   */
  /** @en
   *
   */
  pages?: CoursewarePageInfo[];
};
/**
 * 公共课件列表
 */
/** @en
 *
 */
export type CoursewareList = CoursewareItem[];
