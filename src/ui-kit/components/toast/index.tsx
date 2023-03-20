import { themeVal } from '@onlineclass/ui-kit/tailwindcss';
import classNames from 'classnames';
import { ReactNode, useEffect, useRef, useState } from 'react';
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
  closable?: boolean;
  icon?: SvgIconEnum;
  iconSize?: number;
  action?: {
    text: string;
    onClick: () => void;
  };
  onClose?: () => void;
}
export const FcrToast = (props: FcrToastProps) => {
  const { content, icon, type = 'normal', closable, action, onClose } = props;
  return (
    <div
      style={{
        paddingRight: closable ? '0' : '20px',
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
          paddingRight: closable ? '10px' : '0',
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
      {closable && (
        <div onClick={onClose} className={classNames('fcr-toast-container-close', 'fcr-divider')}>
          <SvgImg
            type={SvgIconEnum.FCR_CLOSE}
            colors={{ iconPrimary: type === 'normal' ? colors['notsb'] : colors['white'] }}
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
  const timerRef = useRef<number>(-1);
  useEffect(() => {
    setActive(true);
    timerRef.current = window.setTimeout(() => {
      setActive(false);
    }, duration);
    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <CSSTransition
      onExited={onEnded}
      mountOnEnter
      classNames={'fcr-toast-anim'}
      in={active}
      timeout={200}>
      <div
        style={{
          width: 'fit-content',
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
  duration?: number;
}
interface RenderableToast extends ToastConfig {
  portal?: HTMLElement;
}

export class Toast {
  private static get _presistToastContainer() {
    return document.querySelector(`.${this._presistToastContainerCls}`);
  }
  private static get _singleToastContainer() {
    return document.querySelector(`.${this._singleToastContainerCls}`);
  }
  private static _maxPresistToastRenderCount = 2;
  private static _presistToastRenderCount = 0;

  private static _presistToasts: RenderableToast[] = [];
  private static _singleToast: RenderableToast | null = null;
  private static _singleToastContainerCls = 'fcr-single-toast-container';
  private static _presistToastContainerCls = 'fcr-presist-toast-container';

  private static _unmountToast = (toast: RenderableToast) => {
    if (toast.portal) {
      unmountComponentAtNode(toast.portal);

      const container = toast.persist ? this._presistToastContainer : this._singleToastContainer;
      container?.removeChild(toast.portal);
      if (toast.persist) {
        this._presistToastRenderCount--;
      }
      this._removeToastContainer();
    }
  };
  private static _preCheck = () => {
    return this._presistToastRenderCount < this._maxPresistToastRenderCount;
  };
  private static _createToastContainer = (persist: boolean) => {
    if (persist) {
      if (!this._presistToastContainer) {
        const presistToastContainer = document.createElement('div');
        presistToastContainer.className = this._presistToastContainerCls;
        document.body.appendChild(presistToastContainer);
      }
    } else {
      if (!this._singleToastContainer) {
        const singleToastContainer = document.createElement('div');
        singleToastContainer.className = this._singleToastContainerCls;
        document.body.appendChild(singleToastContainer);
      }
    }
  };
  private static _removeToastContainer = () => {
    if (this._presistToastRenderCount === 0) {
      if (this._presistToastContainer) {
        document.body.removeChild(this._presistToastContainer);
      }
    }
    if (!this._singleToast) {
      if (this._singleToastContainer) {
        document.body.removeChild(this._singleToastContainer);
      }
    }
  };
  private static _scanRenderableToast = () => {
    if (!this._preCheck()) return;
    const renderableToast = this._presistToasts.shift();
    if (renderableToast) {
      this._presistToastRenderCount++;
      this._render(renderableToast, () => {
        this._scanRenderableToast();
      });
    }
  };
  private static _render = (toast: RenderableToast, onClose?: () => void) => {
    this._createToastContainer(!!toast.persist);
    const container = toast.persist ? this._presistToastContainer : this._singleToastContainer;
    toast.portal = document.createElement('div');
    toast.portal.className = 'fcr-toast-portal';
    container?.appendChild(toast.portal);
    ReactDOM.render(
      <ToastTransitionGroup
        onEnded={() => {
          if (toast) {
            this._unmountToast(toast);
            onClose?.();
          }
        }}
        duration={toast.duration}
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
