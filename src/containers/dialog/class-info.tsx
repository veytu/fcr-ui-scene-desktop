import { ClassDialog, ClassDialogProps } from '@components/dialog/class-dialog';
import { FC, useState } from 'react';

export const ClassInfoDialog: FC<ClassDialogProps> = (props) => {
  const [visible, setVisible] = useState(true);
  const handleVisibleChanged = (visible: boolean) => {
    if (!visible) {
      props.onClose?.();
    }
  };
  return (
    <ClassDialog
      maskClosable={false}
      visible={visible}
      {...props}
      afterOpenChange={handleVisibleChanged}
      onClose={() => {
        setVisible(false);
      }}></ClassDialog>
  );
};
