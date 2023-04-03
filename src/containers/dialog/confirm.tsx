import { ConfirmDialog } from '@onlineclass/components/dialog';
import { ConfirmDialogProps } from '@onlineclass/components/dialog/confirm-dialog';
import { FC, useState } from 'react';

export const ConfirmDialogWrapper: FC<ConfirmDialogProps> = (props) => {
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
