import 'rc-tooltip/assets/bootstrap_white.css';
import { CSSProperties, FC } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';
import './arrow.css';
import { ToolTip, ToolTipProps } from '.';
import classNames from 'classnames';
import { themeVal } from '@onlineclass/utils/tailwindcss';
const colors = themeVal('colors');
const borderRadius = themeVal('borderRadius');
const defaultDialogOverlayInnerStyle: CSSProperties = {
  padding: '0',
  background: `${colors['block-2']}`,
  border: `2px solid ${colors['line-1']}`,
  color: colors['text-1'],
  borderRadius: `${borderRadius[12]}`,
};

interface FcrDialogToolTipProps extends ToolTipProps {
  /**
   * 点击关闭按钮的回调
   */
  /** @en
   * Size of the input box:
   * medium
   * large
   */
  onClose?: () => void;
}
const DialogToolTipClosableOverlayWrap: FC<Pick<FcrDialogToolTipProps, 'content' | 'onClose'>> = (
  props,
) => {
  const { content, onClose } = props;
  return (
    <div className={classNames('fcr-dialog-tooltip-overlay-content')}>
      <div className={classNames('fcr-dialog-tooltip-overlay-close')} onClick={onClose}>
        <SvgImg
          type={SvgIconEnum.FCR_CLOSE}
          size={9}
          colors={{ iconPrimary: colors['text-1'] }}></SvgImg>
      </div>
      <div className={classNames('fcr-dialog-tooltip-overlay-content-inner')}>{content}</div>
    </div>
  );
};
export const FcrDialogToolTip: FC<FcrDialogToolTipProps> = (props) => {
  const { content, onClose, ...others } = props;
  return (
    <ToolTip
      overlayClassName="fcr-tooltip-border-width-2"
      arrowContent={
        <SvgImg
          type={SvgIconEnum.FCR_TOOLTIP_ARROW_2}
          colors={{
            iconPrimary: colors['block-2'],
            iconSecondary: colors['line-1'],
          }}
          size={20}></SvgImg>
      }
      content={
        <DialogToolTipClosableOverlayWrap
          onClose={onClose}
          content={content}></DialogToolTipClosableOverlayWrap>
      }
      overlayInnerStyle={{
        ...defaultDialogOverlayInnerStyle,
        ...props.overlayInnerStyle,
      }}
      {...others}></ToolTip>
  );
};
