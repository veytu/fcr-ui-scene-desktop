import { themeVal } from '@onlineclass/ui-kit/tailwindcss';
import classNames from 'classnames';
import RcDialog from 'rc-dialog';
import './class-dialog.css';
import { FC, ReactNode } from 'react';
import { FcrButton, FcrButtonProps } from '../button';
import { FcrCheckboxProps } from '../checkbox';
import { FcrBaseDialog, FcrBaseDialogProps } from '.';
const colors = themeVal('colors');

interface FcrClassDialogProps extends FcrBaseDialogProps {
  /**
   * 对话框标题
   */
  /** @en
   * The dialog Title.
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
   * 对话框顶部图片地址
   */
  /** @en
   * Set the url for the image on the top of dialog.
   */
  imgUrl?: string;
  /**
   * 对话框描述内容
   */
  /** @en
   * The dialog content
   */
  content?: ReactNode;
  /**
   * 对话框按钮组，会在描述内容下方渲染若干操作按钮
   */
  /** @en
   * Set the action buttons on the bottom of the dialog content.
   */
  actions?: (FcrButtonProps & { text?: string })[];
  /**
   * 是否显示取消按钮
   */
  /** @en
   * Wheter the cancel button is visible on bottom of the dialog or not.
   */
  cancelBtn?: boolean;
}
export const FcrClassDialog: FC<FcrClassDialogProps> = (props) => {
  const {
    visible,
    onClose,
    title,
    content,
    maskClosable,

    imgUrl,
    width,
    actions,
    cancelBtn,
  } = props;
  return (
    <FcrBaseDialog
      closable={false}
      classNames="fcr-class-dialog"
      width={width || 344}
      maskClosable={maskClosable}
      visible={visible}
      onClose={onClose}>
      <div className="fcr-class-dialog-inner">
        {imgUrl && (
          <div className="fcr-class-dialog-img">
            <img src={imgUrl}></img>
          </div>
        )}

        <div className="fcr-class-dialog-title">{title}</div>
        <div className="fcr-class-dialog-content">{content}</div>
        <div className="fcr-class-dialog-actions">
          {actions?.map((btnProps) => {
            return (
              <FcrButton size="S" block {...btnProps}>
                {btnProps.text || 'Text'}
              </FcrButton>
            );
          })}
        </div>
        {cancelBtn && (
          <div className="fcr-class-dialog-cancel" onClick={onClose}>
            <FcrButton styleType="gray" size="S" block>
              Cancel
            </FcrButton>
          </div>
        )}
      </div>
    </FcrBaseDialog>
  );
};
