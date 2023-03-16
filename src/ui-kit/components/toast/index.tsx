import { themeVal } from '@onlineclass/ui-kit/tailwindcss';
import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
const colors = themeVal('colors');

import './index.css';
export type FcrToastType = 'alarm' | 'warn' | 'info' | 'normal';
interface FcrToastProps {
  type: FcrToastType;
  content: string;
  closeable?: boolean;
  icon?: SvgIconEnum;
  iconSize?: number;
  action?: {
    text: string;
    onClick: () => void;
  };
  onClose?: () => void;
}
export const FcrToast = (props: FcrToastProps) => {
  const { content, icon, type, closeable, action, onClose } = props;
  return (
    <div
      style={{
        paddingRight: closeable ? '0' : '20px',
        paddingLeft: '20px',
      }}
      className={classNames('fcr-toast-container', `fcr-toast-${type.toLowerCase()}`)}>
      {icon && (
        <div className={classNames('fcr-toast-container-icon')}>
          <SvgImg type={icon} colors={{ iconPrimary: colors['icon-1'] }} size={24}></SvgImg>
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
        <div onClick={onClose} className={classNames('fcr-toast-container-close', 'fcr-divider')}>
          <SvgImg
            type={SvgIconEnum.FCR_CLOSE}
            colors={{ iconPrimary: colors['white'] }}
            size={20}></SvgImg>
        </div>
      )}
    </div>
  );
};

export const ToastTransitionGroup = (
  props: { onEnded?: () => void; duration?: number; position?: 'top' | 'bottom' } & FcrToastProps,
) => {
  const { onEnded, duration = 3000, position = 'top', ...others } = props;
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(true);
  }, []);

  return (
    <CSSTransition
      onExited={onEnded}
      mountOnEnter
      classNames={'fcr-toast-anim'}
      onEntered={() => {
        setActive(false);
      }}
      in={active}
      timeout={200}>
      <div
        style={{
          width: 'fit-content',
          position: 'absolute',
          left: 0,
          right: 0,
          margin: '0 auto',
          ...(position === 'top' ? { top: '22%' } : { bottom: '15%' }),
        }}>
        <FcrToast
          {...others}
          onClose={() => {
            setActive(false);
            others.onClose?.();
          }}></FcrToast>
      </div>
    </CSSTransition>
  );
};
interface ToastConfig {
  id?: string;
  persist?: boolean;
  toastProps: FcrToastProps;
  getContainer?: HTMLElement;
  duration?: number;
}
interface RenderableToast extends ToastConfig {
  portal?: HTMLElement;
}

export class Toast {
  private static _maxPresistToastRenderCount = 2;
  private static _presistToastRenderCount = 0;

  private static _presistToasts: RenderableToast[] = [];
  private static _singleToast: RenderableToast | null = null;
  private static _unmountToast = (toast: RenderableToast) => {
    if (toast.portal) {
      unmountComponentAtNode(toast.portal);
      (toast.getContainer || document.body).removeChild(toast.portal);
    }
  };
  private static _preCheck = () => {
    return this._presistToastRenderCount < this._maxPresistToastRenderCount;
  };
  private static _scanRenderableToast = () => {
    if (!this._preCheck()) return;
    const renderableToast = this._presistToasts[0];
    if (renderableToast) {
      this._presistToastRenderCount++;
      this._render(renderableToast, () => {
        this._presistToastRenderCount--;
        this._scanRenderableToast();
      });
    }
  };
  private static _render = (toast: RenderableToast, onClose?: () => void) => {
    toast.portal = document.createElement('div');
    (toast.getContainer || document.body).appendChild(toast.portal);
    ReactDOM.render(
      <ToastTransitionGroup
        onEnded={() => {
          if (toast) {
            this._unmountToast(toast);
            onClose?.();
          }
        }}
        {...toast.toastProps}></ToastTransitionGroup>,
      toast.portal,
    );
  };
  static open(config: ToastConfig) {
    if (!config.id) config.id = uuidv4();
    if (config.persist) {
      this._presistToasts.push(config);
      this._scanRenderableToast();
    } else {
      if (this._singleToast) {
        this._unmountToast(this._singleToast);
        this._singleToast = null;
      }
      this._singleToast = config;
      this._render(this._singleToast, () => {
        this._singleToast = null;
      });
    }
  }
}
