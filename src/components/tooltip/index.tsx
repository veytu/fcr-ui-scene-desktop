import { themeVal } from '@onlineclass/utils/tailwindcss';
import RcToolTip from 'rc-tooltip';
import { CSSMotionProps } from 'rc-motion';
import { CSSProperties, FC, ReactElement, ReactNode } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';
import './arrow.css';

const overlayOffset = 12;
const calcOverlayOffset = (placement: string) => {
  if (placement.includes('top')) {
    return [0, -overlayOffset];
  }
  if (placement.includes('bottom')) {
    return [0, overlayOffset];
  }
  if (placement.includes('left')) {
    return [-overlayOffset, 0];
  }
  if (placement.includes('right')) {
    return [overlayOffset, 0];
  }
};
const colors = themeVal('colors');
const borderRadius = themeVal('borderRadius');
const borderColor = themeVal('borderColor');
const defaultOverlayInnerStyle: CSSProperties = {
  padding: '0 10px',
  background: `${colors?.['black']}`,
  border: `1px solid ${borderColor?.[1]}`,
  fontFamily: 'Helvetica Neue',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '32px',
  color: colors?.['text-1'],
  borderRadius: `${borderRadius?.[8]}`,
};

type ToolTipActionType = 'hover' | 'focus' | 'click' | 'contextMenu';
export interface ToolTipProps {
  /**
   * 卡片内容
   */
  /** @en
   * Size of the input box:
   * medium
   * large
   */
  content?: ReactNode;
  /**
   * 触发行为，可选 hover | focus | click | contextMenu
   */
  /** @en
   * Size of the input box:
   * medium
   * large
   */

  trigger?: ToolTipActionType;
  /**
   * 气泡框位置，可选 top left right bottom topLeft topRight bottomLeft bottomRight leftTop leftBottom rightTop rightBottom
   */
  /** @en
   * Size of the input box:
   * medium
   * large
   */
  placement?: string;
  /**
   * 自定义箭头
   */
  /** @en
   * Size of the input box:
   * medium
   * large
   */
  arrowContent?: ReactNode;
  /**
   * 卡片内容区域的样式对象
   */
  /** @en
   * Size of the input box:
   * medium
   * large
   */
  overlayInnerStyle?: CSSProperties;
  /**
   * 气泡的显示状态
   */
  /** @en
   * Size of the input box:
   * medium
   * large
   */
  visible?: boolean;
  /**
   * 卡片类名
   */
  /** @en
   * Size of the input box:
   * medium
   * large
   */
  overlayClassName?: string;
  /**
   * 修改箭头的显示状态
   */
  /** @en
   * Size of the input box:
   * medium
   * large
   */
  showArrow?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  motion?: CSSMotionProps;
  getTooltipContainer?: (node: HTMLElement) => HTMLElement;
}

export const ToolTip: FC<ToolTipProps> = (props) => {
  const {
    content,
    children,
    trigger,
    placement = 'top',
    arrowContent,
    overlayInnerStyle,
    overlayClassName,
    showArrow = true,
    onVisibleChange,
    motion,
    getTooltipContainer,
    ...others
  } = props;
  return (
    <RcToolTip
      getTooltipContainer={getTooltipContainer}
      onVisibleChange={onVisibleChange}
      prefixCls="fcr-tooltip"
      overlayClassName={overlayClassName}
      arrowContent={
        showArrow === false
          ? null
          : arrowContent || (
              <SvgImg
                type={SvgIconEnum.FCR_TOOLTIP_ARROW}
                colors={{
                  iconPrimary: colors?.['black'],
                  iconSecondary: colors?.['line-1'],
                }}
                size={16}></SvgImg>
            )
      }
      align={{ offset: calcOverlayOffset(placement) }}
      trigger={trigger}
      placement={placement}
      overlay={content}
      overlayInnerStyle={{ ...defaultOverlayInnerStyle, ...overlayInnerStyle }}
      motion={
        motion || {
          motionAppear: true,
          motionName: 'fcr-tooltip-anim',
        }
      }
      {...others}>
      {(children as ReactElement) || <></>}
    </RcToolTip>
  );
};
