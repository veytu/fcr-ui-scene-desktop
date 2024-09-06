import { observer } from 'mobx-react';
import loadingGif from './assets/loading.gif';
import './index.css';
import { useStore } from '@ui-scene/ai-people/utils/hooks/use-store';
export const ClassroomLoading = observer(() => {
  const {
    showLoading,
  } = useStore();

  return showLoading ? (
    <div className="fcr-classroom-loading">
      <div className="fcr-classroom-loading-img-wrap">
        <img src={loadingGif} />
      </div>
    </div>
  ) : null;
});
