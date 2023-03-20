import { FcrConfirmDialog } from './confirm-dialog';
import { FcrClassDialog } from './class-dialog';
import { FC, ReactNode } from 'react';
import RcDialog from 'rc-dialog';
import './index.css';
import classnames from 'classnames';

import { SvgIconEnum, SvgImg } from '../svg-img';
import { themeVal } from '@onlineclass/ui-kit/tailwindcss';
const colors = themeVal('colors');
interface FcrBaseDialogProps {
  visible?: boolean;
  onClose?: () => void;
  maskClosable?: boolean;
  width?: number;
  classNames?: string;
  closable?: boolean;
  closeIcon?: ReactNode;
}
const FcrBaseDialog: FC<FcrBaseDialogProps> = (props) => {
  const {
    visible,
    onClose,
    children,
    maskClosable,
    width,
    classNames,
    closable = true,
    closeIcon,
  } = props;
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
      {closable ? (
        closeIcon ? (
          closeIcon
        ) : (
          <div onClick={onClose} className={classnames('fcr-dialog-close')}>
            <SvgImg
              type={SvgIconEnum.FCR_CLOSE}
              size={18}
              colors={{ iconPrimary: colors['notsb-inverse'] }}></SvgImg>
          </div>
        )
      ) : null}
      {children}
    </RcDialog>
  );
};
export { FcrConfirmDialog, FcrClassDialog, FcrBaseDialog };
