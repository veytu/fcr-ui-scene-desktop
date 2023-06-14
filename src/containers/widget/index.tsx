import { observer } from 'mobx-react';
import React, { CSSProperties, FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { AgoraTrackSyncedWidget, AgoraWidgetBase } from 'agora-common-libs';
import { ZIndexController } from '../../utils/z-index-controller';
import { Rnd } from 'react-rnd';

import { useMinimize, useVisible } from '@ui-kit-utils/hooks/animations';

import { ParticipantsDialog } from '../participants/dialog';
import { ZIndexContext, useZIndex } from '@onlineclass/utils/hooks/use-z-index';
export const WidgetContainer = observer(() => {
  const {
    widgetUIStore: { z0Widgets, z10Widgets },
  } = useStore();
  const zIndexControllerRef = useRef(new ZIndexController());
  return (
    <ZIndexContext.Provider value={zIndexControllerRef.current}>
      <React.Fragment>
        <div className="fcr-widget-container fcr-z-0">
          <ParticipantsDialog></ParticipantsDialog>
          {z0Widgets.map((w: AgoraWidgetBase) => (
            <Widget key={w.widgetId} widget={w} />
          ))}
        </div>
        <div className="fcr-widget-container fcr-z-10">
          {z10Widgets.map((w: AgoraWidgetBase) => (
            <Widget key={w.widgetId} widget={w} />
          ))}
        </div>
      </React.Fragment>
    </ZIndexContext.Provider>
  );
});

export const Widget = observer(({ widget }: { widget: AgoraWidgetBase }) => {
  const containerDom = useRef<HTMLElement>();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const locatedNode = widget.locate();

    if (locatedNode) {
      containerDom.current = locatedNode;
    }

    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  const renderWidgetInner = () => {
    return <WidgetWrapper widget={widget}></WidgetWrapper>;
  };

  if (mounted) {
    if (containerDom.current) {
      return createPortal(renderWidgetInner(), containerDom.current);
    }
    return renderWidgetInner();
  }

  return null;
});
const WidgetWrapper = observer(({ widget }: { widget: AgoraWidgetBase }) => {
  const { zIndex, ref } = useZIndex(widget.widgetId);
  useEffect(() => {
    if (ref.current) {
      widget.render(ref.current);
    }
    return () => {
      widget.unload();
    };
  }, []);
  return (
    <>
      {widget.widgetId === 'netlessBoard' ? (
        <div style={{ zIndex }} className="fcr-widget-inner">
          <div ref={ref}></div>
        </div>
      ) : (
        <div style={{ zIndex }} className="fcr-widget-inner">
          <WidgetDraggableWrapper widget={widget}>
            <div ref={ref}></div>
          </WidgetDraggableWrapper>
        </div>
      )}
    </>
  );
});

const WidgetDraggableWrapper: FC<PropsWithChildren<{ widget: AgoraWidgetBase }>> = observer(
  (props) => {
    const { children, widget } = props;
    //@ts-ignore
    const defaultRect = widget.defaultRect as {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    const [rndStyle, setRndStyle] = useState<CSSProperties>({});
    const [transitionType, setTransitionType] = useState<'minimize' | 'visible'>('visible');

    const {
      layoutUIStore: { classroomViewportClassName },
      eduToolApi: { isWidgetMinimized, isWidgetVisible, sendWidgetVisible },
    } = useStore();
    const zIndexController = React.useContext(ZIndexContext);

    const minimize = isWidgetMinimized(widget.widgetId);
    const visible = isWidgetVisible(widget.widgetId);
    useEffect(() => {
      if (minimize) zIndexController.updateZIndex(widget.widgetId);
    }, [minimize]);
    useEffect(() => {
      sendWidgetVisible(widget.widgetId, visible);
      if (visible) zIndexController.updateZIndex(widget.widgetId);
    }, [visible]);
    const { style: minimizeStyle, ref: minimizeRef } = useMinimize({
      minimize,
      beforeChange: (minimize) => {
        if (!minimize) {
          setRndStyle({ display: 'block' });
        }
        setTransitionType('minimize');
      },
      afterChange: (minimize) => {
        if (minimize) {
          setRndStyle({ display: 'none' });
        }
      },
    });
    const { style: visibleStyle } = useVisible({
      visible,
      beforeChange: (visible) => {
        if (visible) {
          setRndStyle({ display: 'block' });
        }
        setTransitionType('visible');
      },
      afterChange: (visible) => {
        if (!visible) {
          setRndStyle({ display: 'none' });
        }
      },
    });
    const refHandle = (ele: HTMLDivElement) => {
      minimizeRef.current = ele;
    };

    return (
      <Rnd
        default={defaultRect}
        style={rndStyle}
        bounds={`.${classroomViewportClassName}`}
        enableResizing={false}
        dragHandleClassName={
          (widget as AgoraWidgetBase & AgoraTrackSyncedWidget).dragHandleClassName
        }
        cancel={(widget as AgoraWidgetBase & AgoraTrackSyncedWidget).dragCancelClassName}>
        <div
          ref={refHandle}
          style={transitionType === 'minimize' ? { ...minimizeStyle } : { ...visibleStyle }}>
          {children}
        </div>
      </Rnd>
    );
  },
);
