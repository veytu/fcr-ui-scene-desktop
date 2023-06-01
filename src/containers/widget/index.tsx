import { observer } from 'mobx-react';
import React, { CSSProperties, FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { AgoraTrackSyncedWidget, AgoraWidgetBase } from 'agora-common-libs/lib/widget';
import { ZIndexController } from './z-index-controller';
const WidgetZIndexContext = React.createContext(new ZIndexController());
import { Rnd } from 'react-rnd';
import { Participants } from '../participants';
import { useMinimize, useVisible } from '@ui-kit-utils/hooks/animations';
export const WidgetContainer = observer(() => {
  const {
    widgetUIStore: { z0Widgets, z10Widgets },
  } = useStore();
  const zIndexControllerRef = useRef(new ZIndexController());
  return (
    <WidgetZIndexContext.Provider value={zIndexControllerRef.current}>
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
    </WidgetZIndexContext.Provider>
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
const useZIndex = (id: string) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const zIndexController = React.useContext(WidgetZIndexContext);
  const zIndex = zIndexController.zIndexMap.get(id);
  const updateZIndex = () => {
    zIndexController.updateZIndex(id);
  };
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('mousedown', updateZIndex);
    }
    return () => {
      ref.current?.removeEventListener('mousedown', updateZIndex);
    };
  }, []);
  useEffect(() => {
    if (!zIndex) {
      zIndexController.updateZIndex(id);
    }
  }, [zIndex, zIndexController]);

  return { zIndex, ref, updateZIndex };
};
const WidgetDraggableWrapper: FC<PropsWithChildren<{ widget: AgoraWidgetBase }>> = observer(
  (props) => {
    const { children, widget } = props;
    const [rndStyle, setRndStyle] = useState<CSSProperties>({});
    const [transitionType, setTransitionType] = useState<'minimize' | 'visible'>('visible');

    const {
      layoutUIStore: { classroomViewportClassName },
      eduToolApi: { isWidgetMinimized, isWidgetVisible, sendWidgetVisible },
    } = useStore();
    const zIndexController = React.useContext(WidgetZIndexContext);

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
    const { ref: positionRef, position, setPosition } = useDraggablePosition({ centered: true });
    const refHandle = (ele: HTMLDivElement) => {
      minimizeRef.current = ele;
      positionRef.current = ele;
    };

    return (
      <Rnd
        style={rndStyle}
        bounds={`.${classroomViewportClassName}`}
        enableResizing={false}
        position={position}
        onDrag={(_, { x, y }) => setPosition({ x, y })}
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

const ParticipantsDialog = observer(() => {
  const { zIndex, ref: zIndexRef, updateZIndex } = useZIndex('participants');
  const {
    layoutUIStore: { classroomViewportClassName },

    participantsUIStore: { participantsDialogVisible },
  } = useStore();
  const [rndStyle, setRndStyle] = useState<CSSProperties>({});

  const { style } = useVisible({
    visible: participantsDialogVisible,
    beforeChange: (visible) => {
      visible && setRndStyle({ display: 'block' });
    },
    afterChange: (visible) => {
      !visible && setRndStyle({ display: 'none' });
    },
  });
  const { ref: positionRef, position, setPosition } = useDraggablePosition({ centered: true });
  const refHandle = (ele: HTMLDivElement) => {
    zIndexRef.current = ele;
    positionRef.current = ele;
  };
  useEffect(() => {
    if (participantsDialogVisible) updateZIndex();
  }, [participantsDialogVisible]);
  return (
    <Rnd
      bounds={`.${classroomViewportClassName}`}
      position={position}
      onDrag={(_, { x, y }) => setPosition({ x, y })}
      enableResizing={false}
      cancel="fcr-participants-header-close"
      dragHandleClassName="fcr-participants-header"
      style={{ zIndex, ...rndStyle }}>
      <div style={{ ...style }} ref={refHandle}>
        <Participants></Participants>
      </div>
    </Rnd>
  );
});
const useDraggablePosition = ({
  initPosition = { x: 0, y: 0 },
  centered = false,
}: {
  initPosition?: { x: number; y: number };
  centered?: boolean;
}) => {
  const [position, setPosition] = useState(initPosition);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    centered &&
      setTimeout(() => {
        setPosition({
          x: document.body.getBoundingClientRect().width / 2 - (ref.current?.offsetWidth || 0) / 2,
          y:
            document.body.getBoundingClientRect().height / 2 - (ref.current?.offsetHeight || 0) / 2,
        });
      }, 500);
  }, []);
  return { position, setPosition, ref };
};
