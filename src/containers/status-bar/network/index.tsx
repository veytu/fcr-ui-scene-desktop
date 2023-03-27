import { observer } from 'mobx-react';
import { themeVal } from '@onlineclass/utils/tailwindcss';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { AGNetworkQuality } from 'agora-rte-sdk';
const colors = themeVal('colors');
const connectionStatus = {
  [AGNetworkQuality.great]: {
    color: colors['green'],
    text: 'Excellent 👍',
  },
  [AGNetworkQuality.good]: {
    color: colors['green'],
    text: 'Excellent 👍',
  },
  [AGNetworkQuality.poor]: {
    color: colors['yellow'],
    text: 'Average 💪',
  },
  [AGNetworkQuality.bad]: {
    color: colors['red.6'],
    text: 'Poor 😭',
  },
  [AGNetworkQuality.down]: {
    color: colors['red.6'],
    text: 'Poor 😭',
  },
  [AGNetworkQuality.unknown]: {
    color: colors['text-1'],
    text: 'Unknow',
  },
};
export const NetworkConnection = observer(() => {
  const {
    statusBarUIStore: { networkQuality },
  } = useStore();
  const currentStatus = connectionStatus[networkQuality];
  return (
    <div className="fcr-network-connection">
      <div className="fcr-network-connection-title">Network Connection</div>
      <div className="fcr-network-connection-status" style={{ color: currentStatus.color }}>
        {currentStatus.text}
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
          <span>{packetLoss}</span>
          <span>{packetLoss}</span>
        </div>
      </div>
    </div>
  );
});
