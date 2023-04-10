import { BaseDialog, BaseDialogProps } from '@components/dialog';
import { FC, PropsWithChildren, useState } from 'react';
import { Input } from '@components/input';
import { Table } from '@components/table';

import './index.css';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { observer } from 'mobx-react-lite';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { generateShortUserName } from '@onlineclass/utils/short-name';
import { ToolTip } from '@components/tooltip';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { DialogToolTip } from '@components/tooltip/dialog';
import { Button } from '@components/button';
import { Radio, RadioGroup } from '@components/radio';

export const ParticipantsDialog: FC<React.PropsWithChildren<BaseDialogProps>> = (props) => {
  const [visible, setVisible] = useState(true);
  const handleVisibleChanged = (visible: boolean) => {
    if (!visible) {
      props.onClose?.();
    }
  };
  return (
    <BaseDialog
      {...props}
      classNames={'fcr-participants-dialog'}
      width={720}
      visible={visible}
      maskClosable={false}
      onClose={() => {
        setVisible(false);
      }}
      afterOpenChange={handleVisibleChanged}>
      <Participants></Participants>
    </BaseDialog>
  );
};
const Participants = observer(() => {
  const {
    participantsUIStore: { participantList },
  } = useStore();
  return (
    <div className="fcr-participants-container">
      <div className="fcr-participants-header">
        <div className="fcr-participants-title">Participants</div>
        <div className="fcr-participants-count">
          (Student {participantList.length} / Co-teacher 0)
        </div>
        <div className="fcr-participants-search">
          <Input size="medium" iconPrefix={SvgIconEnum.FCR_V2_SEARCH} placeholder="Search" />
        </div>
      </div>
      <Table
        columns={[
          {
            title: 'Name',
            render: (_, item) => {
              return <TableName name={item.user.userName}></TableName>;
            },
          },
          {
            title: 'Auth',
            width: 100,
            render: (_, item) => {
              return <TableAuth userUuid={item.user.userUuid}></TableAuth>;
            },
          },
          {
            title: 'Camera',
            width: 100,
            render: (_, item) => {
              return <TableCamera stream={item.stream}></TableCamera>;
            },
          },
          {
            title: 'Microphone',
            width: 100,
            render: (_, item) => {
              return <TableMicrophone stream={item.stream}></TableMicrophone>;
            },
          },
          {
            title: 'Reward',
            width: 100,
            render: (_, item) => {
              return <TableReward userUuid={item.user.userUuid}></TableReward>;
            },
          },
          {
            title: 'Remove',
            width: 100,
            render: (_, item) => {
              return <TableRemove userUuid={item.user.userUuid}></TableRemove>;
            },
          },
        ]}
        data={participantList}
        rowKey={(record) => record.user.userUuid}></Table>
      <div className="fcr-participants-footer">
        <Button preIcon={SvgIconEnum.FCR_ALL_MUTE} size="S" type="secondary">
          Mute All
        </Button>
        <Button preIcon={SvgIconEnum.FCR_ALL_UNMUTE} size="S" type="secondary">
          Ask all to Unmute
        </Button>
      </div>
    </div>
  );
});
const TableName = ({ name }: { name: string }) => {
  return (
    <div className="fcr-participants-table-name">
      <div className="fcr-participants-table-name-logo">{generateShortUserName(name)}</div>
      <div className="fcr-participants-table-name-text">{name}</div>
    </div>
  );
};
const TableAuth = observer(({ userUuid }: { userUuid: string }) => {
  const {
    participantsUIStore: { isHost },
    boardApi: { grantedUsers },
  } = useStore();
  const tooltipContent = isHost
    ? 'host'
    : grantedUsers.has(userUuid)
    ? 'UnAuthorization'
    : 'Authorization';
  return (
    <ToolTip mouseEnterDelay={0} content={tooltipContent}>
      <div className="fcr-participants-table-auth">
        {isHost ? (
          'Host'
        ) : (
          <TableIconWrapper>
            <SvgImg type={SvgIconEnum.FCR_HOST} size={36}></SvgImg>
          </TableIconWrapper>
        )}
      </div>
    </ToolTip>
  );
});
const TableIconWrapper: FC<PropsWithChildren<{ onClick?: () => void }>> = (props) => {
  const { children, ...others } = props;
  return (
    <div className="fcr-participants-table-cell-wrap">
      <div {...others} className="fcr-participants-table-icon-wrap">
        {children}
      </div>
    </div>
  );
};

const TableCamera = observer(({ stream }: { stream?: EduStreamUI }) => {
  const {} = useStore();
  const icon = stream?.isVideoStreamPublished ? SvgIconEnum.FCR_CAMERA : SvgIconEnum.FCR_CAMERAOFF;
  return (
    <ToolTip>
      <TableIconWrapper>
        <SvgImg type={icon} size={36}></SvgImg>
      </TableIconWrapper>
    </ToolTip>
  );
});
const TableMicrophone = observer(({ stream }: { stream?: EduStreamUI }) => {
  const {} = useStore();
  const icon = stream?.isMicStreamPublished ? SvgIconEnum.FCR_MUTE : SvgIconEnum.FCR_NOMUTE;
  return (
    <ToolTip>
      <TableIconWrapper>
        <SvgImg type={icon} size={36}></SvgImg>
      </TableIconWrapper>
    </ToolTip>
  );
});
const TableReward = observer(({ userUuid }: { userUuid: string }) => {
  const {
    participantsUIStore: { sendReward, rewardsByUserUuid },
  } = useStore();
  const rewards = rewardsByUserUuid(userUuid);
  return (
    <ToolTip content="Reward">
      <TableIconWrapper onClick={() => sendReward(userUuid)}>
        <>
          {rewards > 0 && <div className="fcr-participants-table-rewards">{rewards}</div>}
          <SvgImg type={SvgIconEnum.FCR_REWARD} size={36}></SvgImg>
        </>
      </TableIconWrapper>
    </ToolTip>
  );
});
const TableRemove = observer(({ userUuid }: { userUuid: string }) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <ToolTip mouseEnterDelay={0} content="Remove">
      <DialogToolTip
        visible={dialogVisible}
        onVisibleChange={setDialogVisible}
        onClose={() => setDialogVisible(false)}
        content={
          <RemoveDialogContent onClose={() => setDialogVisible(false)}></RemoveDialogContent>
        }
        trigger="click"
        placement="right">
        <TableIconWrapper>
          <SvgImg type={SvgIconEnum.FCR_ONELEAVE} size={36}></SvgImg>
        </TableIconWrapper>
      </DialogToolTip>
    </ToolTip>
  );
});
const RemoveDialogContent = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="fcr-participants-table-remove-dialog">
      <div className="fcr-participants-table-remove-title">Remove students </div>
      <div className="fcr-participants-table-remove-options">
        <RadioGroup>
          <Radio value="1" label="Remove the student from the classroom"></Radio>
          <Radio value="2" label="Ban the student from re-entering the classroom"></Radio>
        </RadioGroup>
      </div>
      <div className="fcr-participants-table-remove-btns">
        <Button onClick={onClose} shape="rounded" size="S" styleType="gray">
          Cancel
        </Button>
        <Button onClick={onClose} shape="rounded" size="S">
          Remove
        </Button>
      </div>
    </div>
  );
};
