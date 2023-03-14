import { themeVal } from '../../../infra/utils/tailwindcss';
import ToolTip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { CSSProperties, FC, ReactElement, ReactNode } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';
import './arrow.css';

const colors = themeVal('theme.colors');
const borderRadius = themeVal('theme.borderRadius');
const borderColor = themeVal('theme.borderColor');
const boxShadow = themeVal('theme.boxShadow');
const defaultOverlayInnerStyle: CSSProperties = {
  padding: '0 10px',
  background: `${colors['black']}`,
  border: `1px solid ${borderColor[1]}`,
  fontFamily: 'Helvetica Neue',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '32px',
  color: '#fff',
  borderRadius: `${borderRadius[8]}`,
  boxShadow: `${boxShadow[2]}`,
};

type FcrToolTipActionType = 'hover' | 'focus' | 'click' | 'contextMenu';
export interface FcrToolTipProps {
  content?: ReactNode;
  trigger?: FcrToolTipActionType;
  placement?: string;
  arrowContent?: ReactNode;
  overlayInnerStyle?: CSSProperties;
  visible?: boolean;
  overlayClassName?: string;
}

export const FcrToolTip: FC<FcrToolTipProps> = (props) => {
  const {
    content,
    children,
    trigger,
    placement,
    arrowContent,
    overlayInnerStyle,
    overlayClassName,
    ...others
  } = props;
  return (
    <ToolTip
      overlayClassName={overlayClassName}
      arrowContent={
        arrowContent || (
          <SvgImg
            type={SvgIconEnum.TOOLTIP_ARROW}
            colors={{
              iconPrimary: colors['black'],
              iconSecondary: colors['line-1'],
            }}
            size={16}></SvgImg>
        )
      }
      trigger={trigger}
      placement={placement}
      overlay={content}
      overlayInnerStyle={{ ...defaultOverlayInnerStyle, ...overlayInnerStyle }}
      motion={{
        motionName: { enter: 'animate__fadeIn', leave: 'animate__fadeOut' },
      }}
      {...others}>
      {(children as ReactElement) || <></>}
    </ToolTip>
  );
};
