import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.css';
import { StreamWindow } from '../window';
import useMeasure from 'react-use-measure';
import { useEffect, useMemo } from 'react';
import { calculateGridMatrix } from '@onlineclass/utils/grid';
import { convertStreamUIStatus, StreamWindowContext } from '../window/context';
import { FloatPagination } from '@components/pagination';

export const GalleryView = observer(() => {
  const {
    layoutUIStore: { layout },
    galleryUIStore: { mainViewStream },
    streamUIStore: { subscribeMass },
  } = useStore();
  useEffect(() => {
    if (mainViewStream) {
      subscribeMass([mainViewStream.stream]);
    }
  }, [mainViewStream]);
  return (
    <div className={classnames(`fcr-layout-content-${layout}`)}>
      <div className={classnames(`fcr-layout-content-main-view`)}>
        {mainViewStream ? (
          <StreamWindowContext.Provider
            value={convertStreamUIStatus(mainViewStream, 'main-view', layout, false)}>
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
    galleryUIStore: { totalPage, currentPage, streamsByPage, showPager, setCurrentPage },
    layoutUIStore: { layout },
    streamUIStore: { subscribeMass },
  } = useStore();
  const [ref, bounds] = useMeasure();
  const { matrix, numOfCols, numOfRows } = calculateGridMatrix(streamsByPage.length);
  let count = 0;
  useEffect(() => {
    subscribeMass(streamsByPage.map((stream) => stream.stream));
  }, [streamsByPage]);

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
      {showPager && (
        <FloatPagination
          onChange={setCurrentPage}
          wrapperCls="fcr-gallery-view-pager"
          total={totalPage}
          current={currentPage}></FloatPagination>
      )}

      <div className="fcr-gallery-view-stream-wrapper" ref={ref}>
        {matrix.map((rows, idx) => {
          return (
            <div className="flex" key={idx} style={{ gap: 8 }}>
              {rows.map(() => {
                const stream = streamsByPage[count++];

                return (
                  <div key={stream.stream.streamUuid} style={{ ...outerSize }}>
                    <StreamWindowContext.Provider
                      value={convertStreamUIStatus(stream, 'main-view', layout, true)}>
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
