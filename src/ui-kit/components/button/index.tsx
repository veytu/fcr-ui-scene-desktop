import classNames from 'classnames';
import { FC } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';
type FcrButtonSize = 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS';
type FcrButtonType = 'primary' | 'secondary' | 'text' | 'link';
type FcrButtonShape = 'circle' | 'rounded';
type FcrButtonStyleType = 'danger' | 'gray';
export interface FcrButtonProps {
  size?: FcrButtonSize;
  type?: FcrButtonType;
  shape?: FcrButtonShape;
  styleType?: FcrButtonStyleType;
  preIcon?: SvgIconEnum;
  postIcon?: SvgIconEnum;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
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
  } = props;
  return (
    <button
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
