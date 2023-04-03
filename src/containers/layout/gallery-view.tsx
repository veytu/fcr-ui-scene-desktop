import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.css';
import { StreamWindow, StreamWindowContext } from '../window';

export const GalleryView = observer(() => {
  const {
    layoutUIStore: { layout },

    galleryUIStore: { mainViewStream },
  } = useStore();
  return (
    <div className={classnames(`fcr-layout-content-${layout}`)}>
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
