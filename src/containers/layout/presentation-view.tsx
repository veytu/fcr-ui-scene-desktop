import { Layout } from '@onlineclass/uistores/type';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.css';
export const PresentationView = observer(() => {
  const {
    layoutUIStore: { layout },
  } = useStore();
  return (
    <div className={classnames(`fcr-layout-content-${layout}`)}>
      <div className={classnames(`fcr-layout-content-list-view`)}>
        <div className={classnames(`fcr-layout-content-video-list`)}></div>
      </div>
      <div className={classnames(`fcr-layout-content-main-view`)}></div>
    </div>
  );
});
