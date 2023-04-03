import { ConfirmDialogProps } from '@onlineclass/components/dialog/confirm-dialog';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { iterateMap } from 'agora-edu-core';
import { observer } from 'mobx-react';
import { ConfirmDialogWrapper } from './confirm';
import { Logger } from 'agora-common-libs';
import { DeviceSettingsDialog } from '../device-settings/dialog-wrapper';

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
          default:
            Logger.warn(`dialog type [${props.type}] is not supported`);
        }
      })}
    </>
  );
});
