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
  return (
    <div className="fcr-cloud-personal-tab-content">
      <div className="fcr-cloud-personal-tab-search">
        <Input size="small" iconPrefix={SvgIconEnum.FCR_V2_SEARCH} placeholder="search"></Input>
      </div>
      <div className="fcr-cloud-personal-tab-table">
        <Table
          scroll={{ y: 335 }}
          columns={[
            {
              key: 'file-name',
              title: 'File Name',
            },
            {
              key: 'size',
              title: 'Size',
            },
            {
              key: 'update-time',
              title: 'Updated at',
            },
          ]}></Table>
      </div>

      <div className="fcr-cloud-personal-tab-footer">
        <Pagination current={1} total={6}></Pagination>
        <Button
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
