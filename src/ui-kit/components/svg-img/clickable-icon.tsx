import { FC, useState } from 'react';
import { SvgIconEnum, SvgImg } from '.';
import classnames from 'classnames';
import './clickable-icon.css';
import { themeVal } from '@onlineclass/ui-kit/tailwindcss';
const colors = themeVal('colors');

interface FcrClickableIconProps {
  icon: SvgIconEnum;
  size?: number;
  disabled?: boolean;
  classNames?: string;
  onClick?: () => void;
}
export const FcrClickableIcon: FC<FcrClickableIconProps> = (props) => {
  const { icon, size, classNames, onClick, disabled } = props;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classnames('fcr-clickabel-icon', classNames)}>
      <SvgImg type={icon} colors={{ iconPrimary: colors?.['notsb-inverse'] }} size={size}></SvgImg>
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
      classNames={classnames(`fcr-pretest-device-icon-${status}`)}></FcrClickableIcon>
  );
};
