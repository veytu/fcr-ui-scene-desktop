import { Layout } from '@onlineclass/uistores/type';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.css';
import { StreamWindow, StreamWindowContext } from '../window';
export const PresentationView = observer(() => {
  const {
    layoutUIStore: { layout },
    presentationUIStore: { mainViewStream },
  } = useStore();
  return (
    <div className={classnames(`fcr-layout-content-${layout}`)}>
      <div className={classnames(`fcr-layout-content-list-view`)}>
        <div className={classnames(`fcr-layout-content-video-list`)}></div>
      </div>
      <div className={classnames(`fcr-layout-content-main-view`)}>
        {mainViewStream ? (
          <StreamWindowContext.Provider value={{ stream: mainViewStream, placement: 'main-view' }}>
            <StreamWindow></StreamWindow>
          </StreamWindowContext.Provider>
        ) : null}
      </div>
    </div>
  );
});
