import { BaseDialog, BaseDialogProps } from '@components/dialog';
import { createContext, FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
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
import { EduRoleTypeEnum, EduUserStruct } from 'agora-edu-core';
import { themeVal } from '@ui-kit-utils/tailwindcss';
import classnames from 'classnames';
import { ToastApiFactory } from '@components/toast';
import { useDeviceSwitch } from '@onlineclass/utils/hooks/use-device-switch';
import { Avatar } from '@components/avatar';
import { AgoraRteMediaPublishState } from 'agora-rte-sdk';
interface ParticipantsContext {
  toastApi: ToastApiFactory | null;
}
const ParticipantsContext = createContext<ParticipantsContext | null>(null);

const colors = themeVal('colors');
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
      mask={false}
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
    participantsUIStore: { participantList, participantStudentList, searchKey, setSearchKey },
    statusBarUIStore: { isHost },
    classroomStore: {
      streamStore: { updateRemotePublishStateBatch },
    },
  } = useStore();
  const { hostColumns, studentColumns } = useParticipantsColumn();
  const participantsContainerRef = useRef<HTMLDivElement | null>(null);
  const toastApiRef = useRef<ToastApiFactory | null>(null);
  useEffect(() => {
    if (participantsContainerRef.current) {
      toastApiRef.current = new ToastApiFactory({
        toastPlacement: 'bottom',
        renderContainer: participantsContainerRef.current,
      });
    }
  }, []);
  const handleMuteAll = async () => {
    await updateRemotePublishStateBatch(
      participantStudentList.map(({ user, stream }) => {
        return {
          userUuid: user.userUuid,
          streamUuid: stream?.stream.streamUuid || '',
          audioState: AgoraRteMediaPublishState.Unpublished,
        };
      }),
    );
    toastApiRef.current?.open({ toastProps: { type: 'normal', content: 'Mute All' } });
  };
  const handleUnMuteAll = async () => {
    await updateRemotePublishStateBatch(
      participantStudentList.map(({ user, stream }) => {
        return {
          userUuid: user.userUuid,
          streamUuid: stream?.stream.streamUuid || '',
          audioState: AgoraRteMediaPublishState.Published,
        };
      }),
    );
    toastApiRef.current?.open({ toastProps: { type: 'normal', content: 'Unmute All' } });
  };
  return (
    <ParticipantsContext.Provider value={{ toastApi: toastApiRef.current }}>
      <div ref={participantsContainerRef} className="fcr-participants-container">
        <div className="fcr-participants-header">
          <div className="fcr-participants-title">Participants</div>
          <div className="fcr-participants-count">
            (Student {participantStudentList.length} / Co-teacher 0)
          </div>
          <div className="fcr-participants-search">
            <Input
              size="medium"
              value={searchKey}
              onChange={setSearchKey}
              iconPrefix={SvgIconEnum.FCR_V2_SEARCH}
              placeholder="Search"
            />
          </div>
        </div>
        <Table
          columns={(isHost ? hostColumns : studentColumns) as any}
          data={participantList}
          rowKey={(record) => record.user.userUuid}></Table>

        {isHost && (
          <div className="fcr-participants-footer">
            <ToolTip placement="top" content="Mute All">
              <Button
                onClick={handleMuteAll}
                preIcon={SvgIconEnum.FCR_ALL_MUTE}
                size="S"
                type="secondary">
                Mute All
              </Button>
            </ToolTip>
            <ToolTip placement="top" content="Unmute all">
              <Button
                onClick={handleUnMuteAll}
                preIcon={SvgIconEnum.FCR_ALL_UNMUTE}
                size="S"
                type="secondary">
                Ask all to Unmute
              </Button>
            </ToolTip>
          </div>
        )}
      </div>
    </ParticipantsContext.Provider>
  );
});
const TableName = ({ name }: { name: string }) => {
  return (
    <div className="fcr-participants-table-name">
      <Avatar size={30} textSize={14} nickName={name}></Avatar>
      <div className="fcr-participants-table-name-text">{name}</div>
    </div>
  );
};
const TableAuth = observer(({ userUuid, role }: { userUuid: string; role: EduRoleTypeEnum }) => {
  const {
    participantsUIStore: { isHostByUserRole },
    boardApi: { grantedUsers, grantPrivilege },
  } = useStore();
  const isHost = isHostByUserRole(role);
  const granted = grantedUsers.has(userUuid);
  const tooltipContent = isHost ? 'host' : granted ? 'UnAuthorization' : 'Authorization';
  const handleAuth = () => {
    grantPrivilege(userUuid, !granted);
  };
  return (
    <ToolTip placement="bottom" content={tooltipContent}>
      <div className="fcr-participants-table-auth">
        {isHost ? (
          'Host'
        ) : (
          <TableIconWrapper onClick={handleAuth}>
            <SvgImg
              type={SvgIconEnum.FCR_HOST}
              colors={{ iconPrimary: granted ? colors['yellow'] : colors['icon-1'] }}
              size={36}></SvgImg>
          </TableIconWrapper>
        )}
      </div>
    </ToolTip>
  );
});
const TableIconWrapper: FC<PropsWithChildren<{ onClick?: () => void; disabled?: boolean }>> = (
  props,
) => {
  const { children, disabled = false, ...others } = props;
  return (
    <div
      className={classnames('fcr-participants-table-cell-wrap', {
        'fcr-participants-table-cell-wrap-disabled': disabled,
      })}>
      <div
        {...others}
        onClick={() => !disabled && props.onClick?.()}
        className="fcr-participants-table-icon-wrap">
        {children}
      </div>
    </div>
  );
};

const TableCamera = observer(({ stream }: { stream?: EduStreamUI }) => {
  const {
    statusBarUIStore: { isHost },
    classroomStore: {
      userStore: { localUser },
    },
  } = useStore();
  const isSelf = stream?.fromUser.userUuid === localUser?.userUuid;
  const actionDisabled = !isHost && !isSelf;
  const { cameraTooltip, handleCameraClick } = useDeviceSwitch(stream);
  const icon = stream?.isVideoStreamPublished ? SvgIconEnum.FCR_CAMERA : SvgIconEnum.FCR_CAMERAOFF;
  return (
    <ToolTip placement="bottom" content={cameraTooltip}>
      <TableIconWrapper disabled={actionDisabled} onClick={handleCameraClick}>
        <SvgImg type={icon} size={36}></SvgImg>
      </TableIconWrapper>
    </ToolTip>
  );
});
const TableMicrophone = observer(({ stream }: { stream?: EduStreamUI }) => {
  const { micTooltip, handleMicrophoneClick } = useDeviceSwitch(stream);
  const icon = stream?.isMicStreamPublished ? SvgIconEnum.FCR_MUTE : SvgIconEnum.FCR_NOMUTE;
  const {
    statusBarUIStore: { isHost },
    classroomStore: {
      userStore: { localUser },
    },
  } = useStore();
  const isSelf = stream?.fromUser.userUuid === localUser?.userUuid;
  const actionDisabled = !isHost && !isSelf;
  return (
    <ToolTip content={micTooltip} placement="bottom">
      <TableIconWrapper disabled={actionDisabled} onClick={handleMicrophoneClick}>
        <SvgImg type={icon} size={36}></SvgImg>
      </TableIconWrapper>
    </ToolTip>
  );
});
const TableReward = observer(({ userUuid, role }: { userUuid: string; role: EduRoleTypeEnum }) => {
  const {
    participantsUIStore: { sendReward, rewardsByUserUuid, isHostByUserRole },
  } = useStore();
  const rewards = rewardsByUserUuid(userUuid);
  const {
    statusBarUIStore: { isHost },
  } = useStore();
  const actionDisabled = !isHost;
  const isStreamFromHost = isHostByUserRole(role);

  return isStreamFromHost ? (
    <>{'-'}</>
  ) : (
    <ToolTip placement="bottom" content="Reward">
      <TableIconWrapper disabled={actionDisabled} onClick={() => sendReward(userUuid)}>
        <>
          {rewards > 0 && <div className="fcr-participants-table-rewards">{rewards}</div>}
          <SvgImg type={SvgIconEnum.FCR_REWARD} size={36}></SvgImg>
        </>
      </TableIconWrapper>
    </ToolTip>
  );
});
const TableRemove = observer(({ userUuid, role }: { userUuid: string; role: EduRoleTypeEnum }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const {
    participantsUIStore: { isHostByUserRole },
  } = useStore();
  const isStreamFromHost = isHostByUserRole(role);

  return isStreamFromHost ? (
    <>{'-'}</>
  ) : (
    <ToolTip placement="bottom" content="Remove">
      <DialogToolTip
        visible={dialogVisible}
        onVisibleChange={setDialogVisible}
        onClose={() => setDialogVisible(false)}
        content={
          <RemoveDialogContent
            userUuid={userUuid}
            onClose={() => setDialogVisible(false)}></RemoveDialogContent>
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
const RemoveDialogContent = observer(
  ({ onClose, userUuid }: { onClose?: () => void; userUuid: string }) => {
    const {
      classroomStore: {
        userStore: { kickOutOnceOrBan },
      },
    } = useStore();
    const [kickOutType, setKickOutType] = useState<'once' | 'ban'>('once');
    const handleRemove = async () => {
      await kickOutOnceOrBan(userUuid, kickOutType === 'ban');
    };
    return (
      <div className="fcr-participants-table-remove-dialog">
        <div className="fcr-participants-table-remove-title">Remove students </div>
        <div className="fcr-participants-table-remove-options">
          <RadioGroup<'once' | 'ban'>
            value={kickOutType}
            onChange={(value) => value && setKickOutType(value)}>
            <Radio value="once" label="Remove the student from the classroom"></Radio>
            <Radio value="ban" label="Ban the student from re-entering the classroom"></Radio>
          </RadioGroup>
        </div>
        <div className="fcr-participants-table-remove-btns">
          <Button onClick={onClose} shape="rounded" size="S" styleType="gray">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleRemove();
              onClose?.();
            }}
            shape="rounded"
            size="S">
            Remove
          </Button>
        </div>
      </div>
    );
  },
);

type UserTableItem = {
  stream: EduStreamUI;
  user: EduUserStruct;
};

const useParticipantsColumn = () => {
  const hostColumns = [
    {
      title: <div className="fcr-participants-table-name-label">Name</div>,
      render: (_: unknown, item: UserTableItem) => {
        return <TableName name={item.user.userName}></TableName>;
      },
      width: 150,
      align: 'left',
    },
    {
      title: 'Auth',
      width: 100,
      render: (_: unknown, item: UserTableItem) => {
        return <TableAuth role={item.user.userRole} userUuid={item.user.userUuid}></TableAuth>;
      },
    },
    {
      title: 'Camera',
      width: 100,
      render: (_: unknown, item: UserTableItem) => {
        return <TableCamera stream={item.stream}></TableCamera>;
      },
    },
    {
      title: 'Microphone',
      width: 100,
      render: (_: unknown, item: UserTableItem) => {
        return <TableMicrophone stream={item.stream}></TableMicrophone>;
      },
    },
    {
      title: 'Reward',
      width: 100,
      render: (_: unknown, item: UserTableItem) => {
        return <TableReward role={item.user.userRole} userUuid={item.user.userUuid}></TableReward>;
      },
    },
    {
      title: 'Remove',
      width: 100,
      render: (_: unknown, item: UserTableItem) => {
        return <TableRemove role={item.user.userRole} userUuid={item.user.userUuid}></TableRemove>;
      },
    },
  ];
  const studentColumns = [
    {
      title: <div className="fcr-participants-table-name-label">Name</div>,
      render: (_: unknown, item: UserTableItem) => {
        return <TableName name={item.user.userName}></TableName>;
      },
      align: 'left',
      width: 200,
    },

    {
      title: 'Camera',
      width: 150,
      render: (_: unknown, item: UserTableItem) => {
        return <TableCamera stream={item.stream}></TableCamera>;
      },
    },
    {
      title: 'Microphone',
      width: 150,
      render: (_: unknown, item: UserTableItem) => {
        return <TableMicrophone stream={item.stream}></TableMicrophone>;
      },
    },
    {
      title: 'Reward',
      width: 150,
      render: (_: unknown, item: UserTableItem) => {
        return <TableReward role={item.user.userRole} userUuid={item.user.userUuid}></TableReward>;
      },
    },
  ];
  return {
    hostColumns,
    studentColumns,
  };
};
