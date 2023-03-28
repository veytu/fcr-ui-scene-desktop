import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ToolTip } from '@onlineclass/components/tooltip';
import { ActionBarItem } from '..';
import './index.css';
export const Leave = () => {
  return (
    <ToolTip content="Leave">
      <ActionBarItem icon={SvgIconEnum.FCR_QUIT2} text={'Leave'}></ActionBarItem>
    </ToolTip>
  );
};
