import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ActionBarItem } from '..';
import './index.css';
export const Record = () => {
  return <ActionBarItem icon={SvgIconEnum.FCR_RECORDING_STOP} text={'Recording'}></ActionBarItem>;
};
