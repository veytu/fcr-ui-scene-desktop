import { ClassDialog, ClassDialogProps } from '@components/dialog/class-dialog';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import { FC, useState } from 'react';

export const ClassInfoDialog: FC<ClassDialogProps> = observer((props) => {
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
    <ClassDialog
      getContainer={() => {
        return document.querySelector(`.${classroomViewportClassName}`) as HTMLElement;
      }}
      maskClosable={false}
      visible={visible}
      {...props}
      afterOpenChange={handleVisibleChanged}
      onClose={() => {
        setVisible(false);
      }}></ClassDialog>
  );
});
