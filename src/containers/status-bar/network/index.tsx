import { SvgImg } from '@onlineclass/components/svg-img';
import { themeVal } from '@onlineclass/utils/tailwindcss';
import './index.css';
const colors = themeVal('colors');
const connectionStatus = {
  Excellent: {
    color: colors['green'],
    text: 'Excellent 👍',
  },
  Average: {
    color: colors['yellow'],
    text: 'Average 💪',
  },
  Poor: {
    color: colors['red.6'],
    text: 'Poor 😭',
  },
};
export const NetworkConnection = () => {
  const currentStatus = connectionStatus['Excellent'];
  return (
    <div className="fcr-network-connection">
      <div className="fcr-network-connection-title">Network Connection</div>
      <div className="fcr-network-connection-status" style={{ color: currentStatus.color }}>
        {currentStatus.text}
      </div>
    </div>
  );
};
export const NetworkDetail = () => {
  return (
    <div className="fcr-network-connection-detail">
      <div className="fcr-network-connection-detail-key">
        <div>Network latency:</div>
        <div>Packet loss rate:</div>
      </div>
      <div className="fcr-network-connection-detail-value">
        <div>
          <span>0ms</span>
        </div>
        <div>
          <span>0.00%</span>
          <span>0.00%</span>
        </div>
      </div>
    </div>
  );
};
