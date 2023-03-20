import { themeVal } from '@onlineclass/ui-kit/tailwindcss';
import classNames from 'classnames';
import RcDialog from 'rc-dialog';
import './index.css';
import { FC, ReactNode } from 'react';
import { FcrButton } from '../button';
import { SvgIconEnum, SvgImg } from '../svg-img';
import { FcrCheckbox, FcrCheckboxProps } from '../checkbox';
const colors = themeVal('colors');

interface FcrDialogProps {
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
export const FcrDialog: FC<FcrDialogProps> = (props) => {
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
    <RcDialog
      width={width || 415}
      maskClosable={maskClosable}
      footer={null}
      prefixCls="fcr-dialog"
      animation={'zoom'}
      maskAnimation={'fade'}
      closable={false}
      visible={visible}
      onClose={onClose}>
      {closable && closeIcon ? (
        closeIcon
      ) : (
        <div onClick={onClose} className={classNames('fcr-dialog-close')}>
          <SvgImg
            type={SvgIconEnum.FCR_CLOSE}
            size={18}
            colors={{ iconPrimary: colors['notsb-inverse'] }}></SvgImg>
        </div>
      )}
      <div className="fcr-dialog-inner-wrap">
        {icon && <div className="fcr-dialog-inner-icon">{icon}</div>}
        <div></div>
        <div>
          <div className={classNames('fcr-dialog-title')}>{title}</div>
          <div className={classNames('fcr-dialog-inner')}>{children}</div>
        </div>
      </div>

      <div className={classNames('fcr-dialog-footer')}>
        {checkable && <FcrCheckbox {...checkedProps} />}
        {footer || (
          <div className={classNames('fcr-dialog-footer-btns')}>
            <FcrButton onClick={onClose} size="S" styleType="gray">
              Cancel
            </FcrButton>
            <FcrButton onClick={onOk} size="S">
              Ok
            </FcrButton>
          </div>
        )}
      </div>
    </RcDialog>
  );
};
