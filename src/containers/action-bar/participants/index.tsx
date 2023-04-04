import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { ActionBarItem } from '..';
import './index.css';
export const Participants = () => {
  return (
    <ToolTip content={'Participants'}>
      <ActionBarItem icon={SvgIconEnum.FCR_PEOPLE} text={'Participants'}></ActionBarItem>
    </ToolTip>
  );
};
