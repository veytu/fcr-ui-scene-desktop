import { ConfirmDialog } from './confirm-dialog';
import { ClassDialog } from './class-dialog';
import { FC, ReactNode } from 'react';
import RcDialog from 'rc-dialog';
import './index.css';
import classnames from 'classnames';
import { SvgIconEnum, SvgImg } from '../svg-img';
import { themeVal } from '@onlineclass/ui-kit/tailwindcss';
const colors = themeVal('colors');
export interface BaseDialogProps {
  /**
   * 对话框是否显示
   */
  /** @en
   * Whether the dialog is visible or not.
   */
  visible?: boolean;
  /**
   * 对话框关闭的回调，点击关闭按钮或蒙层时触发
   */
  /** @en
   * Specify a function that will be called when a user clicks mask, close button on top right or Cancel button
   */
  onClose?: () => void;
  /**
   * 是否可以点击蒙层关闭
   */
  /** @en
   * Whether to close the modal dialog when the mask (area outside the modal) is clicked
   */
  maskClosable?: boolean;
  /**
   * 对话框宽度
   */
  /** @en
   * Width of the dialog
   */
  width?: number;
  /**
   * 对话框类名
   */
  /** @en
   * classname of the dialog
   */
  classNames?: string;
  /**
   * 是否显示对话框关闭按钮
   */
  /** @en
   * Whether a close (x) button is visible on top right of the dialog or not
   */
  closable?: boolean;
  /**
   * 自定义对话框关闭按钮
   */
  /** @en
   * Custom close icon
   */
  closeIcon?: ReactNode;
}
const BaseDialog: FC<BaseDialogProps> = (props) => {
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
export { ConfirmDialog, ClassDialog, BaseDialog };
