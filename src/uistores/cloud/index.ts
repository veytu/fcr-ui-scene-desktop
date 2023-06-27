import { action, computed, observable, reaction, runInAction } from 'mobx';
import { EduUIStoreBase } from '../base';
import { SvgIconEnum } from '@components/svg-img';
import { AgoraOnlineclassSDK, CoursewareItem } from '../..';
import { AGEduErrorCode, CloudDrivePagingOption, EduErrorCenter } from 'agora-edu-core';
import { CloudDriveCourseResource } from './struct';
import { Lodash, bound } from 'agora-common-libs';
import {
  conversionOption,
  createCloudResource,
  extractFileExt,
  fileExt2ContentType,
} from './helper';
import { UploadItem, supportedTypes } from '../type';
let _lastFetchPersonalResourcesOptions: CloudDrivePagingOption;

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
  @observable
  searchPublicResourcesKeyword = '';
  @computed
  get publicResources() {
    const keyword = this.searchPublicResourcesKeyword;
    const list = AgoraOnlineclassSDK.coursewareList;
    return list.filter((item) => (keyword ? item.name.includes(keyword) : true));
  }
  @observable cloudDialogVisible = false;
  @action.bound
  setCloudDialogVisible(visible: boolean) {
    this.cloudDialogVisible = visible;
  }
  @observable
  searchPersonalResourcesKeyword = '';
  @observable personalResourceUuidByPage: Map<number, string[]> = new Map<number, string[]>();
  pageSize = 6;
  @observable
  currentPersonalResPage = 1;
  @action
  setCurrentPersonalResPage = (num: number) => {
    this.currentPersonalResPage = num;
  };
  @observable
  personalResourcesTotalNum = 0;
  @computed
  get personalResourcesTotalPage() {
    return Math.ceil(this.personalResourcesTotalNum / this.pageSize);
  }
  @computed
  get personalResources() {
    return this.classroomStore.cloudDriveStore.personalResources;
  }
  @computed
  get personalResourcesList() {
    const uuids = this.personalResourceUuidByPage.get(this.currentPersonalResPage) || [];
    const arr = [];
    for (const uuid of uuids) {
      const res = this.personalResources.get(uuid);
      if (res) {
        arr.push({
          resource: res,
          checked: false,
        });
      }
    }
    return arr;
  }
  @computed
  get uploadingProgresses(): UploadItem[] {
    const { uploadProgress } = this.classroomStore.cloudDriveStore;
    const arr = [];
    for (const item of uploadProgress.values()) {
      const { resourceName, size, progress, status, resourceUuid } = item;
      const progressValue = Math.floor(progress * 100);
      arr.push({
        iconType: this.fileNameToType(resourceName),
        fileName: resourceName,
        fileSize: this.formatFileSize(size),
        currentProgress: progressValue,
        resourceUuid,
        status,
      });
    }
    return arr;
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
  @bound
  async fetchPersonalResources(options: CloudDrivePagingOption) {
    try {
      const data = await this.classroomStore.cloudDriveStore.fetchPersonalResources(options);
      const { list = [], total = 0 } = data;
      const resourceList = list.map((data) => createCloudResource(data));
      runInAction(() => {
        const resourceUuids: string[] = [];
        for (let i = 0; i < resourceList.length; i++) {
          const item = resourceList[i];
          resourceUuids.push(item.resourceUuid);
          this.personalResources.set(item.resourceUuid, item);
        }
        this.personalResourcesTotalNum = total;
        this.personalResourceUuidByPage.set(options.pageNo, resourceUuids);
      });

      _lastFetchPersonalResourcesOptions = options;
      this.setCurrentPersonalResPage(options.pageNo);
      return data;
    } catch (e) {
      // this.shareUIStore.addGenericErrorDialog(e as AGError);
    }
  }
  validateFiles(files: File[]) {
    if (!files?.length) {
      return false;
    }

    try {
      for (const file of files) {
        const ext = extractFileExt(file.name)?.toLowerCase();
        if (!ext) {
          EduErrorCenter.shared.handleThrowableError(
            AGEduErrorCode.EDU_ERR_UPLOAD_FAILED_NO_FILE_EXT,
            new Error(`no file ext`),
          );
        }

        if (!supportedTypes.includes(ext)) {
          EduErrorCenter.shared.handleThrowableError(
            AGEduErrorCode.EDU_ERR_INVALID_CLOUD_RESOURCE,
            new Error(`unsupported file type ${ext}`),
          );
        }
      }
    } catch (e) {
      // this.shareUIStore.addGenericErrorDialog(e as AGError);
      return false;
    }

    return true;
  }
  @bound
  async uploadPersonalResource(files: File[]) {
    if (!this.validateFiles(files)) {
      return;
    }

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];

      try {
        const ext = extractFileExt(file.name)?.toLowerCase() || '';

        const resourceUuid = await this.classroomStore.cloudDriveStore.calcResourceUuid(file);
        const contentType = fileExt2ContentType(ext);
        const conversion = conversionOption(ext);

        await this.classroomStore.cloudDriveStore.uploadPersonalResource(
          file,
          resourceUuid,
          ext,
          contentType,
          conversion,
        );
      } catch (e) {
        // this.shareUIStore.addGenericErrorDialog(e as AGError);
      } finally {
        this.reloadPersonalResources();
      }
    }
  }
  @bound
  @Lodash.debounced(500)
  async reloadPersonalResources() {
    this.fetchPersonalResources({
      pageNo: this.currentPersonalResPage,
      pageSize: this.pageSize,
      resourceName: this.searchPersonalResourcesKeyword,
    });
  }
  private async _tryOpenCourseware(resource: CloudDriveCourseResource) {
    if (resource.status == 'Converting' && _lastFetchPersonalResourcesOptions) {
      this.fetchPersonalResources(_lastFetchPersonalResourcesOptions);
      return;
    }

    if (resource.status == 'Fail') {
      // this.shareUIStore.addGenericErrorDialog(
      //   AGErrorWrapper(
      //     AGEduErrorCode.EDU_ERR_CLOUD_RESOURCE_CONVERSION_FAIL,
      //     Error('fail to convert resource'),
      //   ),
      // );
      return;
    }

    const pageList = (resource.scenes || []).map(
      ({ name, contentUrl, previewUrl, width, height }) => {
        return {
          name,
          contentUrl,
          previewUrl,
          contentWidth: width,
          contentHeight: height,
        };
      },
    );

    // this.getters.boardApi.openMaterialResourceWindow({
    //   resourceUuid: resource.resourceUuid,
    //   urlPrefix: resource.prefix || '',
    //   title: resource.resourceName,
    //   pageList: pageList,
    //   taskUuid: resource.taskUuid,
    //   resourceHasAnimation: resource.hasAnimation,
    // });
  }
  onDestroy(): void {}
  onInstall(): void {
    this._disposers.push(
      reaction(
        () => this.personalResourcesList,
        (personalResourcesList) => {
          if (personalResourcesList.length) {
            const hasConverting = personalResourcesList.some(
              (item) =>
                item?.resource instanceof CloudDriveCourseResource &&
                item?.resource?.status === 'Converting',
            );
            if (hasConverting) {
              this.fetchPersonalResources({
                pageNo: this.currentPersonalResPage,
                pageSize: this.pageSize,
                resourceName: this.searchPersonalResourcesKeyword,
              });
            }
          }
        },
        {
          delay: 1500,
        },
      ),
    );
    this._disposers.push(
      reaction(
        () => this.searchPersonalResourcesKeyword,
        (keyword) => {
          this.fetchPersonalResources({
            pageNo: 1,
            pageSize: this.pageSize,
            resourceName: keyword,
          });
        },
        {
          delay: 500,
        },
      ),
    );
  }
}
