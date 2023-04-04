import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.css';
import { StreamWindow } from '../window';
import useMeasure from 'react-use-measure';
import { useMemo } from 'react';
import { calculateGridMatrix } from '@onlineclass/utils/grid';
import { convertStreamUIStatus, StreamWindowContext } from '../window/context';

export const GalleryView = observer(() => {
  const {
    layoutUIStore: { layout },

    galleryUIStore: { mainViewStream },
  } = useStore();
  return (
    <div className={classnames(`fcr-layout-content-${layout}`)}>
      <div className={classnames(`fcr-layout-content-main-view`)}>
        {mainViewStream ? (
          <StreamWindowContext.Provider
            value={convertStreamUIStatus(mainViewStream, 'main-view', layout)}>
            <StreamWindow></StreamWindow>
          </StreamWindowContext.Provider>
        ) : (
          <GalleryContainer></GalleryContainer>
        )}
      </div>
    </div>
  );
});

const GalleryContainer = observer(() => {
  const {
    layoutUIStore: { layout },
    streamUIStore: { cameraUIStreams },
  } = useStore();
  const [ref, bounds] = useMeasure();
  const { matrix, numOfCols, numOfRows } = calculateGridMatrix(cameraUIStreams.length);
  let count = 0;

  const outerSize = useMemo(() => {
    let perCellWidth = bounds.width / numOfCols - 8;

    let perCellHeight = perCellWidth * 0.5625;

    const maxCellHeight = bounds.height / numOfRows - 8;

    if (perCellHeight > maxCellHeight) {
      perCellHeight = maxCellHeight;
      perCellWidth = perCellHeight / 0.5625;
    }

    return { width: perCellWidth, height: perCellHeight };
  }, [bounds.width, bounds.height, numOfCols, numOfRows]);
  return (
    <div className="fcr-gallery-view-container">
      <div className="fcr-gallery-view-stream-wrapper" ref={ref}>
        {matrix.map((rows, idx) => {
          return (
            <div className="flex" key={idx} style={{ gap: 8 }}>
              {rows.map(() => {
                const stream = cameraUIStreams[count++];

                return (
                  <div key={stream.stream.streamUuid} style={{ ...outerSize }}>
                    <StreamWindowContext.Provider
                      value={convertStreamUIStatus(stream, 'main-view', layout)}>
                      <StreamWindow></StreamWindow>
                    </StreamWindowContext.Provider>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});
