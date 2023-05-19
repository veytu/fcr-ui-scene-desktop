import { observer } from 'mobx-react';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { useNetwork } from '@onlineclass/utils/hooks/use-network';

export const NetworkConnection = observer(() => {
  const network = useNetwork();
  return (
    <div className="fcr-network-connection">
      <div className="fcr-network-connection-title">Network Connection</div>
      <div className="fcr-network-connection-status" style={{ color: network.color }}>
        {network.text}
      </div>
    </div>
  );
});
export const NetworkDetail = observer(() => {
  const {
    statusBarUIStore: { delay, packetLoss },
  } = useStore();
  return (
    <div className="fcr-network-connection-detail">
      <div className="fcr-network-connection-detail-key">
        <div>Network latency:</div>
        <div>Packet loss rate:</div>
      </div>
      <div className="fcr-network-connection-detail-value">
        <div>
          <span>{delay}</span>
        </div>
        <div>
          <span>
            {packetLoss} <SvgImg size={14} type={SvgIconEnum.FCR_UPORDER}></SvgImg>
          </span>
          <span>
            {packetLoss} <SvgImg size={14} type={SvgIconEnum.FCR_UPORDER}></SvgImg>
          </span>
        </div>
      </div>
    </div>
  );
});
