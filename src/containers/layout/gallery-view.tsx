import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.css';
import { UserWindow } from '../window';
export const GalleryView = observer(() => {
  const {
    layoutUIStore: { layout },
    galleryUIStore: { isSingleUser, currentUser },
  } = useStore();
  return (
    <div className={classnames(`fcr-layout-content-${layout}`)}>
      <div className={classnames(`fcr-layout-content-main-view`)}>
        {isSingleUser ? <UserWindow user={currentUser}></UserWindow> : null}
      </div>
    </div>
  );
});
