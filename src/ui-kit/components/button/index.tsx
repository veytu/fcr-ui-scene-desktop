import classNames from 'classnames';
import { FC } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';
type FcrButtonSize = 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS';
type FcrButtonType = 'primary' | 'secondary' | 'text' | 'link';
type FcrButtonShape = 'circle' | 'rounded';
type FcrButtonStyleType = 'danger' | 'gray';
interface FcrButtonProps {
  size?: FcrButtonSize;
  type?: FcrButtonType;
  shape?: FcrButtonShape;
  styleType?: FcrButtonStyleType;
  preIcon?: SvgIconEnum;
  postIcon?: SvgIconEnum;
  loading?: boolean;
  disabled?: boolean;
}

export const FcrButton: FC<FcrButtonProps> = (props) => {
  const {
    loading,
    type = 'primary',
    shape = 'circle',
    styleType,
    size = 'L',
    preIcon,
    postIcon,
    disabled,
  } = props;
  return (
    <button
      disabled={disabled}
      className={classNames(
        'fcr-button',
        `fcr-button-${type}`,
        `fcr-button-${shape}`,
        `fcr-button-${size}`,
        {
          [`fcr-button-${styleType}`]: !!styleType,
          'fcr-button-icon-only': !props.children,
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
          <SvgImg type={loading ? SvgIconEnum.FCR_ALLLEAVE : postIcon!}></SvgImg>
        </div>
      )}
    </button>
  );
};
