import { SvgImg } from '@components/svg-img';
import { useStore } from '@ui-scene/utils/hooks/use-store';
import { FC, useRef } from 'react';
import { StatusBarItemWrapper } from '..';
import classnames from 'classnames';
import { isNumber } from 'lodash';
import './index.css';
import { formatRoomID } from '@ui-scene/utils';
import { useNetwork } from '@ui-scene/utils/hooks/use-network';
import { observer } from 'mobx-react';
export const StatusBarInfo: FC = observer(() => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const {
    statusBarUIStore: { roomUuid },
  } = useStore();
  const network = useNetwork();
  return (
    <StatusBarItemWrapper>
      <div className="fcr-status-bar-info">
        <div className="fcr-status-bar-info-network">
          <SvgImg type={network.icon} size={20}></SvgImg>
        </div>
        <div className={classnames('fcr-status-bar-info-id', 'fcr-divider')}>
          <span>ID:</span>
          <span ref={ref} data-clipboard-text={roomUuid}>
            {isNumber(roomUuid) ? formatRoomID(roomUuid) : roomUuid}
          </span>
        </div>
      </div>
    </StatusBarItemWrapper>
  );
});
