import classNames from 'classnames';
import { FC } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';

type FcrButtonSize = 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS';
type FcrButtonType = 'primary' | 'secondary' | 'text' | 'link';
type FcrButtonShape = 'circle' | 'rounded';
type FcrButtonStyleType = 'danger' | 'gray';

export interface FcrButtonProps {
  /**
   * 按钮尺寸，可选值为 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS'，默认为'L'
   */
  /** @en
   * Set the size of button, can be set to 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS', default value is 'L'.
   */
  size?: FcrButtonSize;
  /**
   * 按钮类型，可选值为 'primary' | 'secondary' | 'text' | 'link'，默认为'primary'
   */
  /** @en
   * Set the type of button,can be set to 'primary' | 'secondary' | 'text' | 'link', default value is 'primary'.
   */
  type?: FcrButtonType;
  /**
   * 按钮形状，可选值为 'circle' | 'rounded'，默认为'circle'
   */
  /** @en
   * Set the shape of button,can be set to 'circle' | 'rounded', default value is 'circle'.
   */
  shape?: FcrButtonShape;
  /**
   * 按钮样式类型，可选值为 'danger' | 'gray'
   */
  /** @en
   * Set the style type of button, can be set to 'danger' | 'gray'.
   */
  styleType?: FcrButtonStyleType;
  /**
   * 设置按钮前置图标
   */
  /** @en
   * Set the icon before the button text.
   */
  preIcon?: SvgIconEnum;
  /**
   * 设置按钮后置图标
   */
  /** @en
   * Set the icon after the button text.
   */
  postIcon?: SvgIconEnum;
  /**
   * 设置按钮加载状态
   */
  /** @en
   * Set the loading status of button.
   */
  loading?: boolean;
  /**
   * 按钮禁用状态
   */
  /** @en
   * Disabled state of button.
   */
  disabled?: boolean;
  /**
   * 点击按钮时的回调
   */
  /** @en
   * Set the handler to handle click event.
   */

  onClick?: () => void;
  /**
   * 将按钮宽度调整为其父宽度的选项，默认为false
   */
  /** @en
   * Option to fit button width to its parent width, default value is false.
   */
  block?: boolean;
}
export const FcrButton: FC<FcrButtonProps> = (props) => {
  const {
    block,
    loading,
    type = 'primary',
    shape = 'circle',
    styleType,
    size = 'L',
    preIcon,
    postIcon,
    disabled,
    onClick,
    ...otherProps
  } = props;
  return (
    <button
      {...otherProps}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'fcr-button',
        `fcr-button-${type}`,
        `fcr-button-${shape}`,
        `fcr-button-${size}`,
        'fcr-btn-click-effect',
        {
          [`fcr-button-${styleType}`]: !!styleType,
          'fcr-button-icon-only': !props.children,
          'fcr-button-block': block,
        },
      )}>
      {preIcon && (
        <div>
          <SvgImg type={preIcon}></SvgImg>
        </div>
      )}

      <p>{props.children}</p>
      {(loading || postIcon) && (
        <div>
          <SvgImg
            className={classNames({ 'fcr-button-loading': loading })}
            type={loading ? SvgIconEnum.FCR_BTN_LOADING : postIcon!}></SvgImg>
        </div>
      )}
    </button>
  );
};
