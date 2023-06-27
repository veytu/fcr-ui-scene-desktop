import { Button } from '@components/button';
import { Input } from '@components/input';
import { Pagination } from '@components/pagination';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { Table } from '@components/table';
import { TextArea } from '@components/textarea';
import { observer } from 'mobx-react';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { CoursewareItem } from '@onlineclass/type';
import dayjs from 'dayjs';
import { supportedTypes } from '@onlineclass/uistores/cloud/helper';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Checkbox } from '@components/checkbox';
export const PublicResource = observer(() => {
  const {
    cloudUIStore: { publicResources, fileNameToType, formatFileSize },
  } = useStore();
  return (
    <div className="fcr-cloud-public-tab-content">
      <div className="fcr-cloud-public-tab-search">
        <Input size="small" iconPrefix={SvgIconEnum.FCR_V2_SEARCH} placeholder="search"></Input>
      </div>
      <div className="fcr-cloud-public-tab-table">
        <Table
          rowKey={'name'}
          scroll={{ y: 335 }}
          columns={[
            {
              key: 'file-name',
              title: <div className="fcr-cloud-public-tab-table-header-filename">File Name</div>,
              dataIndex: 'name',
              align: 'left',

              render: (fileName: string) => {
                return (
                  <div className="fcr-cloud-public-tab-table-filename">
                    <SvgImg size={24} type={fileNameToType(fileName)}></SvgImg>
                    <span title={fileName}>{fileName}</span>
                  </div>
                );
              },
            },
            {
              key: 'size',
              title: 'Size',
              dataIndex: 'size',
              width: 65,
              align: 'left',
              render: (size: number) => {
                return formatFileSize(size);
              },
            },
            {
              key: 'update-time',
              title: (
                <div className="fcr-cloud-public-tab-table-header-update-time">Updated at</div>
              ),
              dataIndex: 'updateTime',
              width: 130,
              align: 'right',
              render: (time) => {
                return (
                  <div className="fcr-cloud-public-tab-table-update-time">
                    {dayjs(time).format('YYYY-MM-DD HH:mm')}
                  </div>
                );
              },
            },
          ]}
          data={publicResources}></Table>
      </div>
    </div>
  );
});
export const PersonalResource = observer(() => {
  const [uploadListVisible, setUploadListVisible] = useState(false);
  const {
    cloudUIStore: {
      uploadPersonalResource,
      fileNameToType,
      formatFileSize,
      validateFiles,
      personalResourcesList,
      fetchPersonalResources,
      currentPersonalResPage,
      pageSize,
      personalResourcesTotalNum,
      personalResourcesTotalPage,
      setCurrentPersonalResPage,
      reloadPersonalResources,
      uploadingProgresses,
    },
  } = useStore();
  useEffect(() => {
    fetchPersonalResources({
      pageNo: currentPersonalResPage,
      pageSize,
    });
  }, []);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(evt.target.files || []);
    if (validateFiles(files)) {
      const filesArr = Array.from(files);
      uploadPersonalResource(filesArr);
    }
  };
  return (
    <div className="fcr-cloud-personal-tab-content">
      <div className="fcr-cloud-personal-tab-search">
        <Input size="small" iconPrefix={SvgIconEnum.FCR_V2_SEARCH} placeholder="search"></Input>
      </div>
      <div className="fcr-cloud-personal-tab-table">
        <Table
          rowKey={(record) => record.resource.resourceUuid}
          scroll={{ y: 335 }}
          data={personalResourcesList}
          columns={[
            {
              key: 'file-name',
              title: (
                <div className="fcr-cloud-personal-tab-table-header-filename">
                  <Checkbox size="small"></Checkbox>
                  <span> File Name ({personalResourcesTotalNum})</span>
                </div>
              ),
              align: 'left',

              render: (_, record) => {
                const {
                  resource: { resourceName },
                } = record;
                return (
                  <div className="fcr-cloud-personal-tab-table-filename">
                    <Checkbox size="small"></Checkbox>
                    <SvgImg size={24} type={fileNameToType(resourceName)}></SvgImg>
                    <span title={resourceName}>{resourceName}</span>
                  </div>
                );
              },
            },
            {
              key: 'size',
              title: 'Size',
              dataIndex: 'resource.size',
              width: 65,
              align: 'left',
              render: (_, record) => {
                const {
                  resource: { size },
                } = record;
                return formatFileSize(size);
              },
            },
            {
              key: 'update-time',
              title: (
                <div className="fcr-cloud-personal-tab-table-header-update-time">Updated at</div>
              ),
              dataIndex: 'resource.updateTime',
              width: 130,
              align: 'right',
              render: (_, record) => {
                const {
                  resource: { updateTime },
                } = record;
                return (
                  <div className="fcr-cloud-personal-tab-table-update-time">
                    {dayjs(updateTime).format('YYYY-MM-DD HH:mm')}
                  </div>
                );
              },
            },
          ]}></Table>
      </div>

      <div className="fcr-cloud-personal-tab-footer">
        <Pagination
          onChange={setCurrentPersonalResPage}
          current={currentPersonalResPage}
          total={personalResourcesTotalPage}></Pagination>
        <input
          ref={fileRef}
          id="upload-image"
          accept={supportedTypes.map((item) => '.' + item).join(',')}
          onChange={handleUpload}
          multiple
          type="file"
          style={{ display: 'none' }}
        />
        <Button
          onClick={() => {
            fileRef.current?.click();
          }}
          size="XS"
          preIcon={SvgIconEnum.FCR_FILE}
          extra={{
            content: <OnlineCoursewareUploadContent></OnlineCoursewareUploadContent>,
            overlayOffset: 15,
            overlayInnerStyle: { width: 270 },
          }}>
          Upload
        </Button>
      </div>
      <div
        className="fcr-cloud-personal-tab-float-btn fcr-cloud-personal-tab-open-upload"
        onClick={() => {
          setUploadListVisible(true);
        }}>
        <SvgImg type={SvgIconEnum.FCR_UPLOADLIST} size={32}></SvgImg>
      </div>
      <div
        className="fcr-cloud-personal-tab-float-btn fcr-cloud-personal-tab-refresh"
        onClick={reloadPersonalResources}>
        <SvgImg type={SvgIconEnum.FCR_RESET} size={32}></SvgImg>
      </div>
      <TransitionGroup>
        {uploadListVisible && (
          <CSSTransition
            timeout={500}
            classNames="fcr-cloud-personal-tab-upload-list-transition"
            unmountOnExit>
            <div className="fcr-cloud-personal-tab-upload-list">
              <div className="fcr-cloud-personal-tab-upload-list-header">
                （1/3）网页刷新后，上传任务会被清空；上传过程中请勿关闭网面。
                <div
                  className="fcr-cloud-personal-tab-upload-list-header-collapsed"
                  onClick={() => {
                    setUploadListVisible(false);
                  }}>
                  <SvgImg type={SvgIconEnum.FCR_DOWN} size={16}></SvgImg>
                </div>
              </div>

              <div className="fcr-cloud-personal-tab-upload-list-content">
                {uploadingProgresses.map((progress) => {
                  return (
                    <div
                      key={progress.resourceUuid}
                      className="fcr-cloud-personal-tab-upload-list-item">
                      <div className="fcr-cloud-personal-tab-upload-list-item-filename">
                        <SvgImg size={24} type={fileNameToType(progress.fileName || '')}></SvgImg>
                        <span>{progress.fileName}</span>
                      </div>
                      <div className="fcr-cloud-personal-tab-upload-list-item-size">
                        {formatFileSize(progress.fileSize ? Number(progress.fileSize) : 0)}
                      </div>
                      <div className="fcr-cloud-personal-tab-upload-list-item-status"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
});
const OnlineCoursewareUploadContent = observer(() => {
  return (
    <div className="fcr-cloud-personal-tab-footer-upload">
      <div className="fcr-cloud-personal-tab-footer-upload-title">Upload Courseware</div>
      <div className="fcr-cloud-personal-tab-footer-upload-item-wrapper">
        <div className="fcr-cloud-personal-tab-footer-upload-item">
          <div>Courseware Link</div>
          <TextArea placeholder="Please input link."></TextArea>
        </div>

        <div className="fcr-cloud-personal-tab-footer-upload-item">
          <div>Courseware Name</div>
          <TextArea placeholder="Please input name."></TextArea>
        </div>
      </div>

      <div className="fcr-cloud-personal-tab-footer-upload-actions">
        <Button size="XS" styleType="gray" shape="rounded">
          Cancel
        </Button>
        <Button size="XS" shape="rounded">
          Upload
        </Button>
      </div>
    </div>
  );
});
