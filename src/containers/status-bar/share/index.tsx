import { Button } from '@onlineclass/components/button';
import { SvgIconEnum } from '@onlineclass/components/svg-img';
import './index.css';
export const Share = () => {
  return (
    <div className="fcr-share">
      <div className="fcr-share-title">Share Link or ID</div>
      <div className="fcr-share-room-name">Tracy’s Room</div>
      <div className="fcr-share-room-id">
        <span>Room ID</span>
        <span>090 233 334</span>
        <Button preIcon={SvgIconEnum.FCR_SHARE} type="secondary" size="XXS"></Button>
      </div>
      <div className="fcr-share-room-link">
        <span>Link</span>
        <span>https://fanyi.bfanyi.b1n...</span>
      </div>
      <Button size="S" block shape="rounded" preIcon={SvgIconEnum.FCR_SHARE}>
        Copy Link
      </Button>
    </div>
  );
};
