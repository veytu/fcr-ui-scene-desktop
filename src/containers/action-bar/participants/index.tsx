import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ToolTip } from '@onlineclass/components/tooltip';
import { ActionBarItem } from '..';
import './index.css';
export const Participants = () => {
  return (
    <ToolTip content={'Participants'}>
      <ActionBarItem icon={SvgIconEnum.FCR_PEOPLE} text={'Participants'}></ActionBarItem>
    </ToolTip>
  );
};
