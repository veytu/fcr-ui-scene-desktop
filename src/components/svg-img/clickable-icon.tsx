import { FC } from 'react';
import { SvgIconEnum, SvgImg } from '.';
import classnames from 'classnames';
import './clickable-icon.css';
import { themeVal } from '@onlineclass/utils/tailwindcss';
import { ToolTip } from '../tooltip';
const colors = themeVal('colors');

interface ClickableIconProps {
  size?: 'large' | 'small';
  icon: SvgIconEnum;
  iconSize?: number;
  disabled?: boolean;
  classNames?: string;
  onClick?: () => void;
}
export const ClickableIcon: FC<ClickableIconProps> = (props) => {
  const { icon, size = 'small', classNames, onClick, disabled, ...otherProps } = props;

  return (
    <button
      {...otherProps}
      disabled={disabled}
      onClick={onClick}
      className={classnames(
        'fcr-clickabel-icon',
        `fcr-clickable-icon-${size}`,
        'fcr-btn-click-effect',
        classNames,
      )}>
      <SvgImg
        type={icon}
        size={size === 'large' ? 32 : 20}
        colors={{
          iconPrimary: colors?.['notsb-inverse'],
          iconSecondary: colors?.['notsb-inverse'],
        }}></SvgImg>
    </button>
  );
};
interface PretestDeviceIconProps {
  icon: SvgIconEnum;
  onClick?: () => void;
  disabled?: boolean;
  classNames?: string;
  status: 'active' | 'inactive' | 'idle' | 'disabled';
  tooltip: string;
}
export const PretestDeviceIcon: FC<PretestDeviceIconProps> = (props) => {
  const { status, icon, onClick, classNames, tooltip, ...otherProps } = props;

  return (
    <ToolTip content={tooltip}>
      <ClickableIcon
        {...otherProps}
        onClick={status === 'disabled' ? () => {} : onClick}
        icon={icon}
        size="large"
        classNames={classnames(`fcr-pretest-device-icon-${status}`, classNames)}></ClickableIcon>
    </ToolTip>
  );
};
