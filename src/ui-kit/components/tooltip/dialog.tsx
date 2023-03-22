import 'rc-tooltip/assets/bootstrap_white.css';
import { CSSProperties, FC } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';
import './arrow.css';
import { FcrToolTip, FcrToolTipProps } from '.';
import classNames from 'classnames';
import { themeVal } from '@onlineclass/ui-kit/tailwindcss';
const colors = themeVal('colors');
const borderRadius = themeVal('borderRadius');
const boxShadow = themeVal('boxShadow');
const defaultDialogOverlayInnerStyle: CSSProperties = {
  padding: '0',
  background: `${colors['block-2']}`,
  border: `2px solid ${colors['line-1']}`,
  color: colors['text-1'],
  borderRadius: `${borderRadius[12]}`,
};

interface FcrDialogToolTipProps extends FcrToolTipProps {
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
    <FcrToolTip
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
      {...others}></FcrToolTip>
  );
};
