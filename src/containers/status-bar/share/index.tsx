import { Button } from '@components/button';
import { SvgIconEnum } from '@components/svg-img';
import { EduClassroomConfig } from 'agora-edu-core';
import CopyToClipboard from 'react-copy-to-clipboard';
import './index.css';
import { AgoraOnlineclassSDK } from '@onlineclass/index';
import { ToastApi } from '@components/toast';
export const Share = () => {
  const { roomUuid } = EduClassroomConfig.shared.sessionInfo;
  const { shareUrl } = AgoraOnlineclassSDK;

  return (
    <div className="fcr-share">
      <div className="fcr-share-title">Share Link or ID</div>
      <div className="fcr-share-room-name">Tracy’s Room</div>
      <div className="fcr-share-room-id">
        <span>Room ID</span>
        <span data-clipboard-text={shareUrl}>{roomUuid}</span>
        <CopyToClipboard
          text={roomUuid}
          onCopy={() =>
            ToastApi.open({ toastProps: { type: 'info', content: 'success to copy room id' } })
          }>
          <Button
            data-clipboard-text={shareUrl}
            preIcon={SvgIconEnum.FCR_SHARE}
            type="secondary"
            size="XXS"></Button>
        </CopyToClipboard>
      </div>
      <div className="fcr-share-room-link">
        <span>Link</span>
        <span>{shareUrl}</span>
      </div>
      <CopyToClipboard
        text={shareUrl}
        onCopy={() =>
          ToastApi.open({ toastProps: { type: 'info', content: 'success to copy share link' } })
        }>
        <Button size="S" block shape="rounded" preIcon={SvgIconEnum.FCR_SHARE}>
          Copy Link
        </Button>
      </CopyToClipboard>
    </div>
  );
};
