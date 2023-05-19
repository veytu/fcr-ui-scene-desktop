import { SvgIconEnum } from '@components/svg-img';
import { themeVal } from '@ui-kit-utils/tailwindcss';
import { AGNetworkQuality } from 'agora-rte-sdk';
import { useStore } from './use-store';

const colors = themeVal('colors');
const connectionStatus = {
  [AGNetworkQuality.great]: {
    color: colors['green'],
    text: 'Excellent 👍',
    icon: SvgIconEnum.FCR_V2_SIGNAL_GOOD,
  },
  [AGNetworkQuality.good]: {
    color: colors['green'],
    text: 'Excellent 👍',
    icon: SvgIconEnum.FCR_V2_SIGNAL_GOOD,
  },
  [AGNetworkQuality.poor]: {
    color: colors['yellow'],
    text: 'Average 💪',
    icon: SvgIconEnum.FCR_V2_SIGNAL_NORMAL,
  },
  [AGNetworkQuality.bad]: {
    color: colors['red.6'],
    text: 'Poor 😭',
    icon: SvgIconEnum.FCR_V2_SIGNAL_BAD,
  },
  [AGNetworkQuality.down]: {
    color: colors['red.6'],
    text: 'Poor 😭',
    icon: SvgIconEnum.FCR_V2_SIGNAL_BAD,
  },
  [AGNetworkQuality.unknown]: {
    color: colors['text-1'],
    text: 'Unknow',
    icon: SvgIconEnum.FCR_V2_SIGNAL_BAD,
  },
};
export const useNetwork = () => {
  const {
    statusBarUIStore: { networkQuality },
  } = useStore();

  const currentStatus = connectionStatus[networkQuality];
  return currentStatus;
};
