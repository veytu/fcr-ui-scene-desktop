import { useDraggablePosition } from '@onlineclass/utils/hooks/use-drag-position';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { useZIndex } from '@onlineclass/utils/hooks/use-z-index';
import { useVisible } from '@ui-kit-utils/hooks/animations';
import { observer } from 'mobx-react';
import { CSSProperties, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { Participants } from '.';
export const ParticipantsDialog = observer(() => {
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
