import { Layout } from '@onlineclass/uistores/type';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.css';
import { StreamWindow } from '../window';
import { convertStreamUIStatus, StreamWindowContext } from '../window/context';
import { useEffect } from 'react';
export const PresentationView = observer(() => {
  const {
    streamUIStore: { subscribeMass },
    layoutUIStore: { layout },
    presentationUIStore: { mainViewStream, listViewStreamsByPage },
  } = useStore();
  useEffect(() => {
    subscribeMass(listViewStreamsByPage.map((stream) => stream.stream));
  }, [listViewStreamsByPage]);
  return (
    <div className={classnames(`fcr-layout-content-${layout}`)}>
      <div className={classnames(`fcr-layout-content-list-view`)}>
        <div
          className={classnames(`fcr-layout-content-video-list`, {
            'fcr-layout-content-video-list-row': layout === Layout.ListOnTop,
            'fcr-layout-content-video-list-col': layout === Layout.ListOnRight,
          })}>
          {listViewStreamsByPage.map((stream) => {
            const sideStreamSize = { width: 192, height: 192 * 0.5625 };

            return (
              <div key={stream.stream.streamUuid} style={{ ...sideStreamSize }}>
                <StreamWindowContext.Provider
                  value={convertStreamUIStatus(stream, 'list-view', layout, false)}>
                  <StreamWindow></StreamWindow>
                </StreamWindowContext.Provider>
              </div>
            );
          })}
        </div>
      </div>
      <div className={classnames(`fcr-layout-content-main-view`)}>
        {mainViewStream ? (
          <StreamWindowContext.Provider
            value={convertStreamUIStatus(mainViewStream, 'main-view', layout, false)}>
            <StreamWindow></StreamWindow>
          </StreamWindowContext.Provider>
        ) : null}
        <div className="fcr-layout-board-view" />
      </div>
    </div>
  );
});
