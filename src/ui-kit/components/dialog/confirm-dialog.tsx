import classNames from 'classnames';

import { FC, ReactNode } from 'react';
import { FcrButton } from '../button';
import { SvgIconEnum, SvgImg } from '../svg-img';
import { FcrCheckbox, FcrCheckboxProps } from '../checkbox';
import { FcrBaseDialog } from '.';
import './confirm-dialog.css';

interface FcrConfirmDialogProps {
  visible?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  onOk?: () => void;
  closable?: boolean;
  closeIcon?: ReactNode;
  maskClosable?: boolean;
  checkable?: boolean;
  checkedProps?: FcrCheckboxProps;
  width?: number;
  okText?: ReactNode;
  cancelText?: ReactNode;
  icon?: ReactNode;
}
export const FcrConfirmDialog: FC<FcrConfirmDialogProps> = (props) => {
  const {
    visible,
    onClose,
    children,
    title,
    closable,
    footer,
    closeIcon,
    maskClosable,
    onOk,
    checkable,
    checkedProps,
    width,
    icon,
  } = props;
  return (
    <FcrBaseDialog
      closable={closable}
      closeIcon={closeIcon}
      width={width || 415}
      maskClosable={maskClosable}
      visible={visible}
      onClose={onClose}>
      <div className="fcr-confirm-dialog-inner-wrap">
        {icon && <div className="fcr-confirm-dialog-inner-icon">{icon}</div>}
        <div></div>
        <div>
          <div className={classNames('fcr-confirm-dialog-title')}>{title}</div>
          <div className={classNames('fcr-confirm-dialog-inner')}>{children}</div>
        </div>
      </div>

      <div className={classNames('fcr-confirm-dialog-footer')}>
        {checkable && <FcrCheckbox {...checkedProps} />}
        {footer || (
          <div className={classNames('fcr-confirm-dialog-footer-btns')}>
            <FcrButton onClick={onClose} size="S" styleType="gray">
              Cancel
            </FcrButton>
            <FcrButton onClick={onOk} size="S">
              Ok
            </FcrButton>
          </div>
        )}
      </div>
    </FcrBaseDialog>
  );
};
