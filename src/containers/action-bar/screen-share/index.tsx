import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ToolTip } from '@onlineclass/components/tooltip';
import { ActionBarItem } from '..';
import './index.css';
export const ScreenShare = () => {
  return (
    <ToolTip content={'ScreenShare'}>
      <ActionBarItem icon={SvgIconEnum.FCR_SCREENSHARING} text={'ScreenShare'}></ActionBarItem>
    </ToolTip>
  );
};
