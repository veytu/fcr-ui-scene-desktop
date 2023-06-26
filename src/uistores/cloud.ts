import { action, computed, observable } from 'mobx';
import { EduUIStoreBase } from './base';
import { SvgIconEnum } from '@components/svg-img';
import { AgoraOnlineclassSDK, CoursewareItem } from '..';
import { CloudDriveResource } from 'agora-edu-core';

export class CloudUIStore extends EduUIStoreBase {
  cloudHelpTips = [
    {
      svgType: SvgIconEnum.FCR_FILE_PPT,
      desc: 'PPT',
      supportType: ['ppt', 'pptx'],
    },
    {
      svgType: SvgIconEnum.FCR_FILE_DOC,
      desc: 'Word',
      supportType: ['docx', 'doc'],
    },
    {
      svgType: SvgIconEnum.FCR_FILE_PDF,
      desc: 'Pdf',
      supportType: ['pdf'],
    },
    {
      svgType: SvgIconEnum.FCR_FILE_VIDEO,
      desc: 'Video',
      supportType: ['mp4'],
    },
    {
      svgType: SvgIconEnum.FCR_FILE_AUDIO,
      desc: 'Audio',
      supportType: ['mp3'],
    },
    {
      svgType: SvgIconEnum.FCR_FILE_PHOTO,
      desc: 'Photo',
      supportType: ['png', 'jpg'],
    },
    {
      svgType: SvgIconEnum.FCR_FILE_ALF,
      desc: 'Sharing courseware',
      supportType: ['alf'],
    },
  ];
  @observable cloudDialogVisible = false;
  @action.bound
  setCloudDialogVisible(visible: boolean) {
    this.cloudDialogVisible = visible;
  }
  @observable
  searchPublicResourcesKeyword = '';
  @computed
  get publicResources() {
    const keyword = this.searchPublicResourcesKeyword;
    const list = AgoraOnlineclassSDK.coursewareList;
    return list.filter((item) => (keyword ? item.name.includes(keyword) : true));
  }
  fileNameToType(name: string) {
    if (name.match(/ppt|pptx|pptx/i)) {
      return SvgIconEnum.FCR_FILE_PPT;
    }
    if (name.match(/doc|docx/i)) {
      return SvgIconEnum.FCR_FILE_DOC;
    }
    if (name.match(/xls|xlsx/i)) {
      return SvgIconEnum.FCR_FILE_DOC;
    }
    if (name.match(/mp4/i)) {
      return SvgIconEnum.FCR_FILE_VIDEO;
    }
    if (name.match(/mp3/i)) {
      return SvgIconEnum.FCR_FILE_AUDIO;
    }
    if (name.match(/gif|png|jpeg|jpg|bmp/i)) {
      return SvgIconEnum.FCR_FILE_PHOTO;
    }
    if (name.match(/pdf/i)) {
      return SvgIconEnum.FCR_FILE_PDF;
    }
    if (name.match(/h5/i)) {
      return SvgIconEnum.FCR_FILE_ALF;
    }
    if (name.match(/alf/i)) {
      return SvgIconEnum.FCR_FILE_ALF;
    }
    return SvgIconEnum.FCR_FILE_DOC;
  }
  formatFileSize(fileByteSize: number, decimalPoint?: number) {
    const bytes = +fileByteSize;
    if (bytes === 0) return '- -';
    const k = 1000;
    const dm = decimalPoint || 2;
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + units[i];
  }
  onDestroy(): void {}
  onInstall(): void {}
}
