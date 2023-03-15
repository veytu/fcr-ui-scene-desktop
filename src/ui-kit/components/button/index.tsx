import classNames from 'classnames';
import { FC } from 'react';
import './index.css';
type FcrButtonSize = 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS';
type FcrButtonType = 'primary' | 'secondary' | 'text' | 'link';
type FcrButtonShape = 'circle' | 'rounded';
interface FcrButtonProps {
  size?: FcrButtonSize;
  type?: FcrButtonType;
  shape?: FcrButtonShape;
  danger?: boolean;
}
export const FcrButton: FC<FcrButtonProps> = (props) => {
  const { type = 'primary', shape = 'circle', danger, size = 'L' } = props;
  return (
    <button
      className={classNames(
        'fcr-button',
        `fcr-button-${type}`,
        `fcr-button-${shape}`,
        `fcr-button-${size}`,
      )}>
      <span>{props.children}</span>
    </button>
  );
};
