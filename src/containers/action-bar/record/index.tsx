import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ToolTip } from '@onlineclass/components/tooltip';
import { ActionBarItem } from '..';
import './index.css';
export const Record = () => {
  return (
    <ToolTip content={'Recording'}>
      <ActionBarItem icon={SvgIconEnum.FCR_RECORDING_STOP} text={'Recording'}></ActionBarItem>
    </ToolTip>
  );
};
