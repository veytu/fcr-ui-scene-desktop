import { ConfirmDialog } from '@onlineclass/components/dialog';
import { ConfirmDialogProps } from '@onlineclass/components/dialog/confirm-dialog';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { iterateMap } from 'agora-edu-core';
import { observer } from 'mobx-react';
import { FC, useState } from 'react';

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
          default:
            const dialog = props as ConfirmDialogProps;
            return (
              <ConfirmDialog
                visible
                {...dialog}
                onOk={() => {
                  dialog.onOk?.();
                  deleteDialog(id);
                }}></ConfirmDialog>
            );
        }
      })}
    </>
  );
});
const ConfirmDialogWrapper: FC<ConfirmDialogProps> = (props) => {
  const [visible, setVisible] = useState(true);
  const handleVisibleChanged = (visible: boolean) => {
    if (!visible) {
      props.onClose?.();
    }
  };
  return (
    <ConfirmDialog
      maskClosable={false}
      visible={visible}
      {...props}
      afterOpenChange={handleVisibleChanged}
      onClose={() => {
        setVisible(false);
      }}
      onOk={() => {
        props.onOk?.();
        setVisible(false);
      }}></ConfirmDialog>
  );
};
