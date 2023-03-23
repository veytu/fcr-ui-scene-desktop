import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import { Button } from '../button';
import { Checkbox, CheckboxProps } from '../checkbox';
import { BaseDialog, BaseDialogProps } from '.';
import './confirm-dialog.css';

interface ConfirmDialogProps extends BaseDialogProps {
  /**
   * 对话框标题
   */
  /** @en
   * The dialog's title.
   */
  title?: ReactNode;
  /**
   * 对话框底部元素
   */
  /** @en
   * Footer content
   */
  footer?: ReactNode;
  /**
   * 点击对话框确认按钮回调
   */
  /** @en
   * Specify a function that will be called when a user clicks the OK button
   */
  onOk?: () => void;

  /**
   * 是否展示对话框checkbox
   */
  /** @en
   * Wheter the chekcbox is visibleon bottom left of the dialog or not.
   */
  checkable?: boolean;
  /**
   * 对话框checkbox属性
   */
  /** @en
   * The checkbox props.
   */
  checkedProps?: CheckboxProps;
  /**
   * 对话框确认按钮文案
   */
  /** @en
   * Text of the OK button
   */
  okText?: ReactNode;
  /**
   * 对话框取消按钮文案
   */
  /** @en
   * Text of the cancel button
   */
  cancelText?: ReactNode;
  /**
   * 对话框图标
   */
  /** @en
   * Set the icon on the left of the dialog title and content.
   */
  icon?: ReactNode;
}
export const ConfirmDialog: FC<ConfirmDialogProps> = (props) => {
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
    okText,
    cancelText,
  } = props;
  return (
    <BaseDialog
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
        {checkable && <Checkbox {...checkedProps} />}
        {footer || (
          <div className={classNames('fcr-confirm-dialog-footer-btns')}>
            <Button onClick={onClose} size="S" styleType="gray">
              {cancelText || 'Cancel'}
            </Button>
            <Button onClick={onOk} size="S">
              {okText || 'Ok'}
            </Button>
          </div>
        )}
      </div>
    </BaseDialog>
  );
};
