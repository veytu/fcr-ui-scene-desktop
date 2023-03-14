import { themeVal } from '@onlineclass/ui-kit/tailwindcss';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
const colors = themeVal('colors');

import './index.css';
export type FcrToastType = 'Alarm' | 'Warn' | 'Info' | 'Normal';
interface FcrToastProps {
  type: FcrToastType;
  content: string;
  closeable?: boolean;
  icon?: SvgIconEnum;
  action?: {
    text: string;
    onClick: () => void;
  };
}
export const FcrToast = (props: FcrToastProps) => {
  const { content, icon, type, closeable, action } = props;
  return (
    <div
      style={{
        paddingRight: closeable ? '0' : '20px',
        paddingLeft: '20px',
      }}
      className={classNames('fcr-toast-container', `fcr-toast-${type.toLowerCase()}`)}>
      {icon && (
        <div className={classNames('fcr-toast-container-icon')}>
          <SvgImg type={icon}></SvgImg>
        </div>
      )}
      <div
        style={{
          paddingRight: closeable ? '10px' : '0',
        }}
        className={classNames('fcr-toast-container-content')}>
        <span>{content}</span>
      </div>
      {action && (
        <div
          className={classNames('fcr-toast-container-action', 'fcr-divider')}
          onClick={action.onClick}>
          <span>{action.text}</span>
        </div>
      )}
      {closeable && (
        <div className={classNames('fcr-toast-container-close', 'fcr-divider')}>
          <SvgImg
            type={SvgIconEnum.FCR_CLOSE}
            colors={{ iconPrimary: colors['white'] }}
            size={20}></SvgImg>
        </div>
      )}
    </div>
  );
};
