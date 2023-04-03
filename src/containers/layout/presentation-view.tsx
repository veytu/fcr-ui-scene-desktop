import { Layout } from '@onlineclass/uistores/type';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.css';
import { StreamWindow } from '../window';
import { convertStreamUIStatus, StreamWindowContext } from '../window/context';
export const PresentationView = observer(() => {
  const {
    layoutUIStore: { layout },
    streamUIStore: { cameraUIStreams },
    presentationUIStore: { mainViewStream, listViewStreams },
  } = useStore();
  return (
    <div className={classnames(`fcr-layout-content-${layout}`)}>
      <div className={classnames(`fcr-layout-content-list-view`)}>
        <div
          className={classnames(`fcr-layout-content-video-list`, {
            'fcr-layout-content-video-list-row': layout === Layout.ListOnTop,
            'fcr-layout-content-video-list-col': layout === Layout.ListOnRight,
          })}>
          {listViewStreams.map((stream) => {
            const sideStreamSize = { width: 222, height: 222 * 0.5625 };

            return (
              <div key={stream.stream.streamUuid} style={{ ...sideStreamSize }}>
                <StreamWindowContext.Provider
                  value={convertStreamUIStatus(stream, 'list-view', layout, cameraUIStreams)}>
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
            value={convertStreamUIStatus(mainViewStream, 'main-view', layout, cameraUIStreams)}>
            <StreamWindow></StreamWindow>
          </StreamWindowContext.Provider>
        ) : null}
      </div>
    </div>
  );
});
