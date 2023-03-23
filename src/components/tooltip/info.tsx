import { themeVal } from '@onlineclass/utils/tailwindcss';
import 'rc-tooltip/assets/bootstrap_white.css';
import { CSSProperties, FC } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';
import './arrow.css';

import { FcrToolTip, FcrToolTipProps } from '.';
const colors = themeVal('colors');
const borderRadius = themeVal('borderRadius');
const defaultInfoOverlayInnerStyle: CSSProperties = {
  padding: '0 12px',
  background: `${colors['block-2']}`,
  border: `2px solid ${colors['line-1']}`,
  fontSize: '13px',
  lineHeight: '50px',
  color: colors['text-1'],
  borderRadius: `${borderRadius[12]}`,
  minWidth: '180px',
  textAlign: 'center',
};

interface FcrInfoToolTipProps extends FcrToolTipProps {}

export const FcrInfoToolTip: FC<FcrInfoToolTipProps> = (props) => {
  const { content, ...others } = props;
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
      content={content}
      overlayInnerStyle={{
        ...defaultInfoOverlayInnerStyle,
        ...props.overlayInnerStyle,
      }}
      {...others}></FcrToolTip>
  );
};
