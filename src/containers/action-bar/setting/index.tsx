import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ToolTip } from '@onlineclass/components/tooltip';
import { ActionBarItem } from '..';
import './index.css';
export const Setting = () => {
  return (
    <ToolTip content="Setting">
      <ActionBarItem icon={SvgIconEnum.FCR_SETTING} text={'Setting'}></ActionBarItem>
    </ToolTip>
  );
};
