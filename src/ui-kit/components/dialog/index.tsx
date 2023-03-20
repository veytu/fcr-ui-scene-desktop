import { FcrConfirmDialog } from './confirm-dialog';
import { FcrClassDialog } from './class-dialog';
import { FC, ReactNode } from 'react';
import RcDialog from 'rc-dialog';
import './index.css';
interface FcrBaseDialogProps {
  visible?: boolean;
  onClose?: () => void;
  maskClosable?: boolean;
  width?: number;
  classNames?: string;
}
const FcrBaseDialog: FC<FcrBaseDialogProps> = (props) => {
  const { visible, onClose, children, maskClosable, width, classNames } = props;
  return (
    <RcDialog
      className={classNames}
      width={width || 415}
      maskClosable={maskClosable}
      footer={null}
      prefixCls="fcr-dialog"
      animation={'zoom'}
      maskAnimation={'fade'}
      closable={false}
      visible={visible}
      onClose={onClose}>
      {children}
    </RcDialog>
  );
};
export { FcrConfirmDialog, FcrClassDialog, FcrBaseDialog };
