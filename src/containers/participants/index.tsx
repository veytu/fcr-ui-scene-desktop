import { BaseDialog, BaseDialogProps } from '@components/dialog';
import { createContext, FC, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@components/input';
import { Table } from '@components/table';

import './index.css';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { observer } from 'mobx-react-lite';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { ToolTip } from '@components/tooltip';
import { EduStreamUI } from '@onlineclass/utils/stream/struct';
import { DialogToolTip } from '@components/tooltip/dialog';
import { Button } from '@components/button';
import { Radio, RadioGroup } from '@components/radio';
import { EduClassroomConfig, EduRoleTypeEnum, EduUserStruct } from 'agora-edu-core';
import { themeVal } from '@ui-kit-utils/tailwindcss';
import classnames from 'classnames';
import { ToastApiFactory } from '@components/toast';
import { useDeviceSwitch } from '@onlineclass/utils/hooks/use-device-switch';
import { AgoraRteMediaPublishState } from 'agora-rte-sdk';
import {
  ParticipantsOrderDirection,
  ParticipantsTableSortKeysEnum,
} from '@onlineclass/uistores/participants';
import { useAuthorization } from '@onlineclass/utils/hooks/use-authorization';

interface ParticipantsContext {
  toastApi: ToastApiFactory | null;
}
const ParticipantsContext = createContext<ParticipantsContext | null>(null);

const colors = themeVal('colors');
export const ParticipantsDialog: FC<React.PropsWithChildren<BaseDialogProps>> = observer(
  (props) => {
    const {
      participantsUIStore: { participantsDialogVisible, setParticipantsDialogVisible },
      statusBarUIStore: { isHost },
    } = useStore();
    const afterClose = () => {
      props.onClose?.();
    };
    const { hostColumns, studentColumns } = useParticipantsColumn();

    const tableColumns = isHost ? hostColumns : studentColumns;
    const tableWidth = useMemo(() => {
      return tableColumns.reduce((prev, columns) => {
        return prev + columns.width;
      }, 0);
    }, [tableColumns]);
    return (
      <BaseDialog
        {...props}
        width={tableWidth < 430 ? 430 : tableWidth}
        classNames={'fcr-participants-dialog'}
        visible={participantsDialogVisible}
        maskClosable={false}
        mask={false}
        wrapClassName={'fcr-participants-dialog-wrap'}
        onClose={() => {
          setParticipantsDialogVisible(false);
        }}
        afterClose={afterClose}>
        <Participants columns={tableColumns}></Participants>
      </BaseDialog>
    );
  },
);
const Participants = observer(({ columns }: { columns: any }) => {
  const {
    participantsUIStore: {
      participantList,
      participantStudentList,
      searchKey,
      setSearchKey,
      tableIconSize,
    },
    statusBarUIStore: { isHost },
    classroomStore: {
      streamStore: { updateRemotePublishStateBatch },
    },
  } = useStore();
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
    toastApiRef.current?.open({
      toastProps: { type: 'normal', content: 'Mute All', size: 'small' },
    });
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
    toastApiRef.current?.open({
      toastProps: { type: 'normal', content: 'Request to unmute all', size: 'small' },
    });
  };

  return (
    <ParticipantsContext.Provider value={{ toastApi: toastApiRef.current }}>
      <div ref={participantsContainerRef} className="fcr-participants-container">
        <div className="fcr-participants-header">
          <div className="fcr-participants-title">Participants</div>
          <div className="fcr-participants-count">(Student {participantStudentList.length})</div>
          <div className="fcr-participants-search">
            <Input
              size="small"
              value={searchKey}
              onChange={setSearchKey}
              iconPrefix={SvgIconEnum.FCR_V2_SEARCH}
              placeholder="Search"
            />
          </div>
        </div>
        <Table
          scroll={{
            y: 400,
          }}
          columns={columns as any}
          data={participantList}
          rowKey={(record) => record.user.userUuid}></Table>

        {isHost && (
          <div className="fcr-participants-footer">
            <ToolTip placement="top" content="Mute All">
              <Button
                disabled={participantStudentList.length <= 0}
                onClick={handleMuteAll}
                preIcon={SvgIconEnum.FCR_ALL_MUTE}
                size="XS"
                type="secondary">
                Mute All
              </Button>
            </ToolTip>
            <ToolTip placement="top" content="Unmute all">
              <Button
                disabled={participantStudentList.length <= 0}
                onClick={handleUnMuteAll}
                preIcon={SvgIconEnum.FCR_ALL_UNMUTE}
                size="XS"
                type="secondary">
                Request to unmute all
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
      {/* <Avatar size={30} textSize={14} nickName={name}></Avatar> */}
      <div className="fcr-participants-table-name-text">{name}</div>
    </div>
  );
};
const TableAuth = observer(({ userUuid, role }: { userUuid: string; role: EduRoleTypeEnum }) => {
  const {
    participantsUIStore: { isHostByUserRole, tableIconSize },
    presentationUIStore: { isBoardWidgetActive },
  } = useStore();
  const { tooltip, toggleAuthorization, granted } = useAuthorization(userUuid);
  const isHostLocal = EduClassroomConfig.shared.sessionInfo.role === EduRoleTypeEnum.teacher;
  const isHost = isHostByUserRole(role);
  const tooltipContent = isHost ? 'host' : tooltip;
  const disabled = !isHostLocal || !isBoardWidgetActive;

  return (
    <div className="fcr-participants-table-auth">
      {isHost ? (
        'Host'
      ) : (
        <TableIconWrapper
          tooltip={tooltipContent}
          disabled={disabled}
          onClick={toggleAuthorization}>
          <SvgImg
            onClick={() => disabled && toggleAuthorization()}
            type={SvgIconEnum.FCR_HOST}
            colors={{ iconPrimary: granted ? colors['yellow'] : colors['icon-1'] }}
            size={tableIconSize}></SvgImg>
        </TableIconWrapper>
      )}
    </div>
  );
});
const TableIconWrapper: FC<
  PropsWithChildren<{ onClick?: () => void; disabled?: boolean; tooltip?: string }>
> = (props) => {
  const { children, disabled = false, tooltip, ...others } = props;
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const handleVisibleChanged = (visible: boolean) => {
    if (!tooltip || disabled) {
      return setTooltipVisible(false);
    }
    setTooltipVisible(visible);
  };
  return (
    <ToolTip
      visible={tooltipVisible}
      onVisibleChange={handleVisibleChanged}
      placement="bottom"
      content={tooltip}>
      <div
        className={classnames('fcr-participants-table-cell-wrap', {
          'fcr-participants-table-cell-wrap-disabled': disabled,
        })}>
        <div
          {...others}
          onClick={() => !disabled && props.onClick?.()}
          className={classnames('fcr-participants-table-icon-wrap', {
            'fcr-participants-table-icon-wrap-disable': disabled,
          })}>
          <div>{children}</div>
        </div>
      </div>
    </ToolTip>
  );
};

const TableCamera = observer(({ stream }: { stream?: EduStreamUI }) => {
  const {
    statusBarUIStore: { isHost },
    classroomStore: {
      userStore: { localUser },
    },
    participantsUIStore: { tableIconSize },
  } = useStore();
  const isSelf = stream?.fromUser.userUuid === localUser?.userUuid;
  const actionDisabled = !isHost && !isSelf;
  const { cameraTooltip, handleCameraClick } = useDeviceSwitch(stream);
  const icon = stream?.isVideoStreamPublished ? SvgIconEnum.FCR_CAMERA : SvgIconEnum.FCR_CAMERAOFF;
  const iconColor = stream?.isVideoStreamPublished ? {} : { iconSecondary: colors['red']['6'] };

  return (
    <TableIconWrapper tooltip={cameraTooltip} disabled={actionDisabled} onClick={handleCameraClick}>
      <SvgImg colors={iconColor} type={icon} size={tableIconSize}></SvgImg>
    </TableIconWrapper>
  );
});
const TableMicrophone = observer(({ stream }: { stream?: EduStreamUI }) => {
  const { micTooltip, handleMicrophoneClick } = useDeviceSwitch(stream);
  const {
    statusBarUIStore: { isHost },
    classroomStore: {
      userStore: { localUser },
    },
    participantsUIStore: { tableIconSize },
  } = useStore();
  const isSelf = stream?.fromUser.userUuid === localUser?.userUuid;
  const actionDisabled = !isHost && !isSelf;
  const icon = stream?.isMicStreamPublished ? SvgIconEnum.FCR_MUTE : SvgIconEnum.FCR_NOMUTE;

  const iconColor = stream?.isMicStreamPublished ? {} : { iconSecondary: colors['red']['6'] };

  return (
    <TableIconWrapper
      tooltip={micTooltip}
      disabled={actionDisabled}
      onClick={handleMicrophoneClick}>
      <SvgImg colors={iconColor} type={icon} size={tableIconSize}></SvgImg>
    </TableIconWrapper>
  );
});
const TableReward = observer(({ userUuid, role }: { userUuid: string; role: EduRoleTypeEnum }) => {
  const {
    participantsUIStore: { sendReward, rewardsByUserUuid, isHostByUserRole, tableIconSize },
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
    <TableIconWrapper
      tooltip={'Reward'}
      disabled={actionDisabled}
      onClick={() => sendReward(userUuid)}>
      <>
        {rewards > 0 && <div className="fcr-participants-table-rewards">{rewards}</div>}
        <SvgImg type={SvgIconEnum.FCR_REWARD} size={tableIconSize}></SvgImg>
      </>
    </TableIconWrapper>
  );
});
const TableRemove = observer(({ userUuid, role }: { userUuid: string; role: EduRoleTypeEnum }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const {
    participantsUIStore: { isHostByUserRole, tableIconSize },
  } = useStore();
  const isStreamFromHost = isHostByUserRole(role);

  return isStreamFromHost ? (
    <>{'-'}</>
  ) : (
    <DialogToolTip
      overlayOffset={0}
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
      <TableIconWrapper tooltip="Remove">
        <SvgImg type={SvgIconEnum.FCR_ONELEAVE} size={tableIconSize}></SvgImg>
      </TableIconWrapper>
    </DialogToolTip>
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
            <div className="fcr-participants-table-remove-options-divider"></div>
            <Radio value="ban" label="Ban the student from re-entering the classroom"></Radio>
          </RadioGroup>
        </div>
        <div className="fcr-participants-table-remove-btns">
          <Button onClick={onClose} shape="rounded" size="XS" styleType="gray">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleRemove();
              onClose?.();
            }}
            shape="rounded"
            size="XS">
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
const SortedColumnsHeader = observer(({ sortKey }: { sortKey: string }) => {
  const {
    participantsUIStore: { orderKey, orderDirection, setOrderDirection, setOrderKey },
  } = useStore();
  const [hover, setHover] = useState(false);
  const active = orderKey === sortKey;
  const direction: ParticipantsOrderDirection = active ? orderDirection : 'asc';
  const handleSortClick = () => {
    if (active) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderKey(sortKey);
      setOrderDirection('asc');
    }
  };
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fcr-participants-table-sorted-header"
      onClick={handleSortClick}>
      {sortKey}
      <SvgImg
        className={classnames('fcr-participants-table-sorted-header-icon', {
          'fcr-participants-table-sorted-header-icon-desc': direction === 'desc',
          'fcr-participants-table-sorted-header-icon-active': active,
        })}
        colors={hover ? { iconPrimary: colors['brand']['6'] } : {}}
        type={SvgIconEnum.FCR_UPORDER}
        size={14}></SvgImg>
    </div>
  );
});
const useParticipantsColumn = () => {
  const hostColumns = [
    {
      title: <div className="fcr-participants-table-name-label">Name</div>,
      render: (_: unknown, item: UserTableItem) => {
        return <TableName name={item.user.userName}></TableName>;
      },
      width: 85,
      align: 'left',
    },
    {
      title: <SortedColumnsHeader sortKey={ParticipantsTableSortKeysEnum.Auth} />,
      width: 50,
      render: (_: unknown, item: UserTableItem) => {
        return <TableAuth role={item.user.userRole} userUuid={item.user.userUuid}></TableAuth>;
      },
    },
    {
      title: <SortedColumnsHeader sortKey={ParticipantsTableSortKeysEnum.Camera} />,
      width: 68,
      render: (_: unknown, item: UserTableItem) => {
        return <TableCamera stream={item.stream}></TableCamera>;
      },
    },
    {
      title: <SortedColumnsHeader sortKey={ParticipantsTableSortKeysEnum.Microphone} />,
      width: 92,
      render: (_: unknown, item: UserTableItem) => {
        return <TableMicrophone stream={item.stream}></TableMicrophone>;
      },
    },
    {
      title: <SortedColumnsHeader sortKey={ParticipantsTableSortKeysEnum.Reward} />,
      width: 66,
      render: (_: unknown, item: UserTableItem) => {
        return <TableReward role={item.user.userRole} userUuid={item.user.userUuid}></TableReward>;
      },
    },
    {
      title: 'Remove',
      width: 67,
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
      width: 85,
    },
    {
      title: <SortedColumnsHeader sortKey={ParticipantsTableSortKeysEnum.Auth} />,
      width: 50,
      render: (_: unknown, item: UserTableItem) => {
        return <TableAuth role={item.user.userRole} userUuid={item.user.userUuid}></TableAuth>;
      },
    },
    {
      title: <SortedColumnsHeader sortKey={ParticipantsTableSortKeysEnum.Camera} />,
      width: 68,
      render: (_: unknown, item: UserTableItem) => {
        return <TableCamera stream={item.stream}></TableCamera>;
      },
    },
    {
      title: <SortedColumnsHeader sortKey={ParticipantsTableSortKeysEnum.Microphone} />,
      width: 92,
      render: (_: unknown, item: UserTableItem) => {
        return <TableMicrophone stream={item.stream}></TableMicrophone>;
      },
    },
    {
      title: <SortedColumnsHeader sortKey={ParticipantsTableSortKeysEnum.Reward} />,
      width: 78,
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
