import { ConfirmDialogProps } from '@components/dialog/confirm-dialog';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { iterateMap } from 'agora-edu-core';
import { observer } from 'mobx-react';
import { ConfirmDialogWrapper } from './confirm';
import { Logger } from 'agora-common-libs/lib/annotation';
import { DeviceSettingsDialog } from '../device-settings/dialog-wrapper';
import { ParticipantsDialog } from '../participants';
import { ClassDialogProps } from '@components/dialog/class-dialog';
import { ClassInfoDialog } from './class-info';

export const ClassRoomDialogContainer = observer(() => {
  const {
    layoutUIStore: { dialogMap, deleteDialog },
  } = useStore();

  const { list } = iterateMap(dialogMap, {
    onMap: (_key, item) => {
      return { id: _key, props: item };
    },
  });

  return (
    <>
      {list.map(({ id, props }) => {
        switch (props.type) {
          case 'confirm':
            const confirmDialog = props as ConfirmDialogProps;
            return (
              <ConfirmDialogWrapper
                key={id}
                {...confirmDialog}
                onClose={() => {
                  deleteDialog(id);
                  confirmDialog.onClose?.();
                }}></ConfirmDialogWrapper>
            );
          case 'device-settings':
            return <DeviceSettingsDialog key={id} id={id} />;
          case 'participants':
            return (
              <ParticipantsDialog
                key={id}
                onClose={() => {
                  deleteDialog(id);
                }}></ParticipantsDialog>
            );
          case 'class-info':
            const classDialog = props as ClassDialogProps;

            return (
              <ClassInfoDialog
                {...classDialog}
                onClose={() => {
                  deleteDialog(id);
                  classDialog.onClose?.();
                }}
                key={id}></ClassInfoDialog>
            );
          default:
            Logger.warn(`dialog type [${props.type}] is not supported`);
        }
      })}
    </>
  );
});
