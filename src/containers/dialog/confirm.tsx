import { ConfirmDialog } from '@components/dialog';
import { ConfirmDialogProps } from '@components/dialog/confirm-dialog';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import { FC, useState } from 'react';

export const ConfirmDialogWrapper: FC<ConfirmDialogProps> = observer((props) => {
  const [visible, setVisible] = useState(true);
  const {
    layoutUIStore: { classroomViewportClassName },
  } = useStore();
  const handleVisibleChanged = (visible: boolean) => {
    if (!visible) {
      props.onClose?.();
    }
  };
  return (
    <ConfirmDialog
      getContainer={() => {
        return document.querySelector(`.${classroomViewportClassName}`) as HTMLElement;
      }}
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
});
