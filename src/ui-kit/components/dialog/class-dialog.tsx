import { themeVal } from '@onlineclass/ui-kit/tailwindcss';
import classNames from 'classnames';
import RcDialog from 'rc-dialog';
import './class-dialog.css';
import { FC, ReactNode } from 'react';
import { FcrButton, FcrButtonProps } from '../button';
import { SvgIconEnum, SvgImg } from '../svg-img';
import { FcrCheckbox, FcrCheckboxProps } from '../checkbox';
import { FcrBaseDialog } from '.';
const colors = themeVal('colors');
interface FcrClassDialogProps {
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
  imgUrl?: string;
  content?: ReactNode;
  actions?: FcrButtonProps & { text?: string }[];
  cancelBtn?: boolean;
}
export const FcrClassDialog: FC<FcrClassDialogProps> = (props) => {
  const {
    visible,
    onClose,
    title,
    content,
    maskClosable,
    onOk,
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
              <FcrButton size="S" block onClick={onOk} {...btnProps}>
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
