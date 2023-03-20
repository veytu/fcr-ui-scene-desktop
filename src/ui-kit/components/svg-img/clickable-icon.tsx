import { FC, useState } from 'react';
import { SvgIconEnum, SvgImg } from '.';
import classnames from 'classnames';
import './clickable-icon.css';
import { themeVal } from '@onlineclass/ui-kit/tailwindcss';
const colors = themeVal('colors');

interface FcrClickableIconProps {
  size?: 'large' | 'small';
  icon: SvgIconEnum;
  iconSize?: number;
  disabled?: boolean;
  classNames?: string;
  onClick?: () => void;
}
export const FcrClickableIcon: FC<FcrClickableIconProps> = (props) => {
  const { icon, size = 'small', classNames, onClick, disabled } = props;

  return (
    <button
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
        colors={{ iconPrimary: colors?.['notsb-inverse'] }}></SvgImg>
    </button>
  );
};
interface FcrPretestDeviceIconProps {
  icon: SvgIconEnum;
  onClick?: () => void;
  disabled?: boolean;
  classNames?: string;
  status: 'active' | 'inactive' | 'idle';
}
export const FcrPretestDeviceIcon: FC<FcrPretestDeviceIconProps> = (props) => {
  const { status, icon, onClick, disabled } = props;

  return (
    <FcrClickableIcon
      disabled={disabled}
      onClick={onClick}
      icon={icon}
      size="large"
      classNames={classnames(`fcr-pretest-device-icon-${status}`)}></FcrClickableIcon>
  );
};
