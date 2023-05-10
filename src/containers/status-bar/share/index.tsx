import { Button } from '@components/button';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { EduClassroomConfig } from 'agora-edu-core';
import CopyToClipboard from 'react-copy-to-clipboard';
import './index.css';
import { ToastApi } from '@components/toast';
import { getConfig } from '@onlineclass/utils/launch-options-holder';
import { ClickableIcon } from '@components/svg-img/clickable-icon';

export const Share = () => {
  const { roomUuid } = EduClassroomConfig.shared.sessionInfo;

  const { shareUrl } = getConfig();

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
          <div className="fcr-share-room-id-copy" data-clipboard-text={shareUrl}>
            <SvgImg size={20} type={SvgIconEnum.FCR_COPY}></SvgImg>
          </div>
        </CopyToClipboard>
      </div>
      <div className="fcr-share-room-link">
        <span>Link</span>
        <span>{shareUrl as string}</span>
      </div>
      <CopyToClipboard
        text={shareUrl as string}
        onCopy={() =>
          ToastApi.open({ toastProps: { type: 'info', content: 'success to copy share link' } })
        }>
        <Button size="XS" block shape="rounded" preIcon={SvgIconEnum.FCR_LINK}>
          Copy Link
        </Button>
      </CopyToClipboard>
    </div>
  );
};
